import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

interface GiftItem {
  id: string;
  price: number;
  title: string;
}

interface CartItem {
  id: string;
  quantity: number;
}

const gifts: GiftItem[] = [
  { id: 'g1', title: 'Cota Lua de Mel', price: 150 },
  { id: 'g2', title: 'Jantar Especial', price: 250 },
  { id: 'g3', title: 'Ajuda com a Casa Nova', price: 300 },
  { id: 'g4', title: 'Passeio Romântico', price: 180 },
  { id: 'g5', title: 'Café da Manhã Especial', price: 120 },
  { id: 'g6', title: 'Brinde para a Casa Nova', price: 90 },
  { id: 'g7', title: 'Kit Vinho & Queijos', price: 220 },
  { id: 'g8', title: 'Noite de Cinema em Casa', price: 140 },
  { id: 'g9', title: 'Ajuda com a Reforma', price: 350 },
  { id: 'g10', title: 'Experiência Gastronômica', price: 280 },
  { id: 'g11', title: 'Day Spa para o Casal', price: 400 },
  { id: 'g12', title: 'Aula de Culinária a Dois', price: 260 },
  { id: 'g13', title: 'Assinatura de Streaming (3 meses)', price: 150 },
  { id: 'g14', title: 'Jardim na Varanda', price: 110 },
  { id: 'g15', title: 'Kit Café Gourmet', price: 130 },
  { id: 'g16', title: 'Cota Pôr do Sol', price: 160 },
  { id: 'g17', title: 'Álbum de Fotos do Casamento', price: 200 },
  { id: 'g18', title: 'Cota Passeio de Barco', price: 320 },
  { id: 'g19', title: 'Cota Massagem Relaxante', price: 190 },
  { id: 'g20', title: 'Contribuição Livre', price: 100 },
];

function moneyBRL(n: number): string {
  return Number(n || 0).toFixed(2);
}

async function createBtgPix(total: number, description: string): Promise<string> {
  const url = process.env.BTG_PIX_CREATE_URL;
  if (!url) {
    throw new Error('BTG_PIX_CREATE_URL não configurada');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = process.env.BTG_PIX_AUTH_TOKEN;
  if (token) {
    const headerName = process.env.BTG_PIX_AUTH_HEADER || 'Authorization';
    const prefix = process.env.BTG_PIX_AUTH_PREFIX || 'Bearer';
    headers[headerName] = prefix ? `${prefix} ${token}` : token;
  }

  const payload = {
    amount: moneyBRL(total),
    description,
    externalReference: `AN-${Date.now()}`,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  const emv: string | undefined = data?.emv || data?.pixCopiaECola || data?.qrCode;

  if (!res.ok || !emv) {
    throw new Error(`BTG Pix erro: ${JSON.stringify(data || { status: res.status })}`);
  }

  return emv;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const items: CartItem[] = Array.isArray(body?.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
    }

    let total = 0;
    const descriptionParts: string[] = [];

    for (const it of items) {
      const g = gifts.find(x => x.id === it.id);
      const qty = Math.max(1, parseInt(String(it.quantity || 1), 10));
      if (!g) {
        return NextResponse.json({ error: `Presente inválido: ${it.id}` }, { status: 400 });
      }
      total += g.price * qty;
      descriptionParts.push(`${qty}x ${g.title}`);
    }

    total = Number(total.toFixed(2));
    const description = `Presentes André e Nathália: ${descriptionParts.join(', ').slice(0, 180)}`;

    const emv = await createBtgPix(total, description);

    const qrDataUrl = await QRCode.toDataURL(emv, { width: 210, margin: 1 });

    return NextResponse.json({ emv, qrDataUrl });
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro ao gerar Pix', details: String(err) },
      { status: 500 }
    );
  }
}
