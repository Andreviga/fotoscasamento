require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const DATA_PATH = path.join(__dirname, "data", "gifts.json");

function readGifts() {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}
function writeGifts(gifts) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(gifts, null, 2), "utf-8");
}

function moneyBRL(n) {
  return Number(n || 0).toFixed(2);
}

async function createBtgPix(total, description) {
  const url = process.env.BTG_PIX_CREATE_URL;
  if (!url) {
    throw new Error("BTG_PIX_CREATE_URL não configurada");
  }

  const headers = {
    "Content-Type": "application/json"
  };

  const token = process.env.BTG_PIX_AUTH_TOKEN;
  if (token) {
    const headerName = process.env.BTG_PIX_AUTH_HEADER || "Authorization";
    const prefix = process.env.BTG_PIX_AUTH_PREFIX || "Bearer";
    headers[headerName] = prefix ? `${prefix} ${token}` : token;
  }

  const payload = {
    amount: moneyBRL(total),
    description,
    externalReference: `AN-${Date.now()}`
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  const emv = data?.emv || data?.pixCopiaECola || data?.qrCode;

  if (!res.ok || !emv) {
    const details = data || { status: res.status };
    throw new Error(`BTG Pix erro: ${JSON.stringify(details)}`);
  }

  return emv;
}

function requireAdmin(req, res, next) {
  const pass = req.header("x-admin-pass") || "";
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: "ADMIN_PASSWORD não configurada no .env" });
  }
  if (pass !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  next();
}

// ======= API pública =======

app.get("/api/config", (req, res) => {
  res.json({
    pix: {
      key: process.env.PIX_KEY || "",
      merchantName: process.env.PIX_MERCHANT_NAME || "ANDRE E NATHALIA",
      merchantCity: process.env.PIX_MERCHANT_CITY || "SAO PAULO"
    }
  });
});

app.get("/api/gifts", (req, res) => {
  const gifts = readGifts().filter(g => g.active);
  res.json(gifts);
});

// Cria Pix dinâmico (BTG) e retorna copia e cola (EMV)
app.post("/api/create-pix", async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) return res.status(400).json({ error: "Carrinho vazio" });

    const gifts = readGifts();
    let total = 0;
    let descriptionParts = [];

    for (const it of items) {
      const g = gifts.find(x => x.id === it.id && x.active);
      const qty = Math.max(1, parseInt(it.quantity || 1, 10));
      if (!g) return res.status(400).json({ error: `Presente inválido: ${it.id}` });
      total += Number(g.price) * qty;
      descriptionParts.push(`${qty}x ${g.title}`);
    }

    total = Number(total.toFixed(2));
    const description = `Presentes André & Nathália: ${descriptionParts.join(", ").slice(0, 180)}`;

    const emv = await createBtgPix(total, description);
    res.json({ emv });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar Pix", details: String(err) });
  }
});

// Cria cobrança/link no Asaas (cartão)
app.post("/api/create-checkout", async (req, res) => {
  try {
    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    if (items.length === 0) return res.status(400).json({ error: "Carrinho vazio" });

    const gifts = readGifts();
    let total = 0;
    let descriptionParts = [];

    for (const it of items) {
      const g = gifts.find(x => x.id === it.id && x.active);
      const qty = Math.max(1, parseInt(it.quantity || 1, 10));
      if (!g) return res.status(400).json({ error: `Presente inválido: ${it.id}` });
      total += Number(g.price) * qty;
      descriptionParts.push(`${qty}x ${g.title}`);
    }

    total = Number(total.toFixed(2));
    const description = `Presentes André & Nathália: ${descriptionParts.join(", ").slice(0, 180)}`;

    const asaasKey = process.env.ASAAS_API_KEY;
    if (!asaasKey) return res.status(500).json({ error: "ASAAS_API_KEY não configurada" });

    const env = (process.env.ASAAS_ENV || "sandbox").toLowerCase();
    const base = env === "prod"
      ? "https://api.asaas.com/v3"
      : "https://sandbox.asaas.com/api/v3";

    // Para simplificar: criamos cobrança com pagamento via cartão
    // O Asaas normalmente exige um "customer". Criamos um customer genérico por cobrança (funciona bem para doações/presentes).
    const customerRes = await fetch(`${base}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": asaasKey
      },
      body: JSON.stringify({
        name: "Convidado(a) - Presentes",
        email: "convidado@exemplo.com"
      })
    });
    const customer = await customerRes.json();
    if (!customer?.id) {
      return res.status(500).json({ error: "Erro ao criar customer no Asaas", details: customer });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const yyyy = dueDate.getFullYear();
    const mm = String(dueDate.getMonth() + 1).padStart(2, "0");
    const dd = String(dueDate.getDate()).padStart(2, "0");

    const publicBase = process.env.PUBLIC_BASE_URL || "http://localhost:3000";

    const payRes = await fetch(`${base}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": asaasKey
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: "CREDIT_CARD",
        value: moneyBRL(total),
        dueDate: `${yyyy}-${mm}-${dd}`,
        description,
        externalReference: `AN-${Date.now()}`,
        // O Asaas pode fornecer invoiceUrl (link) após criar o pagamento
        callback: {
          successUrl: `${publicBase}/thanks.html`,
          autoRedirect: true
        }
      })
    });

    const payment = await payRes.json();
    const url = payment?.invoiceUrl || payment?.bankSlipUrl || payment?.transactionReceiptUrl;

    if (!url) {
      return res.status(500).json({ error: "Não foi possível gerar link no Asaas", details: payment });
    }

    res.json({ url });

  } catch (err) {
    res.status(500).json({ error: "Erro no checkout", details: String(err) });
  }
});

// ======= ADMIN =======
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.get("/api/admin/gifts", requireAdmin, (req, res) => {
  res.json(readGifts());
});

app.post("/api/admin/gifts", requireAdmin, (req, res) => {
  const gifts = Array.isArray(req.body) ? req.body : null;
  if (!gifts) return res.status(400).json({ error: "Formato inválido" });

  // validação simples
  for (const g of gifts) {
    if (!g.id || !g.title) return res.status(400).json({ error: "id e title são obrigatórios" });
    g.price = Number(g.price || 0);
    g.active = Boolean(g.active);
  }
  writeGifts(gifts);
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Rodando em http://localhost:${process.env.PORT || 3000}`);
});
