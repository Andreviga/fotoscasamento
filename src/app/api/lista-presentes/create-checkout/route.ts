import { NextRequest, NextResponse } from 'next/server';

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

    const asaasKey = process.env.ASAAS_API_KEY;
    if (!asaasKey) {
      return NextResponse.json({ error: 'ASAAS_API_KEY não configurada' }, { status: 500 });
    }

    const env = (process.env.ASAAS_ENV || 'sandbox').toLowerCase();
    const base =
      env === 'prod'
        ? 'https://api.asaas.com/v3'
        : 'https://sandbox.asaas.com/api/v3';

    const customerRes = await fetch(`${base}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: asaasKey,
      },
      body: JSON.stringify({
        name: 'Convidado(a) - Presentes',
        email: 'convidado@exemplo.com',
      }),
    });
    const customer = await customerRes.json();
    if (!customer?.id) {
      return NextResponse.json(
        { error: 'Erro ao criar customer no Asaas', details: customer },
        { status: 500 }
      );
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const yyyy = dueDate.getFullYear();
    const mm = String(dueDate.getMonth() + 1).padStart(2, '0');
    const dd = String(dueDate.getDate()).padStart(2, '0');

    const publicBase =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.PUBLIC_BASE_URL ||
      'https://fotos.andrenathalia03052026.site';

    const payRes = await fetch(`${base}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: asaasKey,
      },
      body: JSON.stringify({
        customer: customer.id,
        billingType: 'CREDIT_CARD',
        value: moneyBRL(total),
        dueDate: `${yyyy}-${mm}-${dd}`,
        description,
        externalReference: `AN-${Date.now()}`,
        callback: {
          successUrl: `${publicBase}/lista-presentes?obrigado=1`,
          autoRedirect: true,
        },
      }),
    });

    const payment = await payRes.json();
    const url: string | undefined =
      payment?.invoiceUrl || payment?.bankSlipUrl || payment?.transactionReceiptUrl;

    if (!url) {
      return NextResponse.json(
        { error: 'Não foi possível gerar link no Asaas', details: payment },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro no checkout', details: String(err) },
      { status: 500 }
    );
  }
}
