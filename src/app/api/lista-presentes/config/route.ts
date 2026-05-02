import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    pix: {
      key: process.env.PIX_KEY || '',
      merchantName: process.env.PIX_MERCHANT_NAME || 'ANDRE E NATHALIA',
      merchantCity: process.env.PIX_MERCHANT_CITY || 'SAO BERNARDO DO CAMPO',
    },
  });
}
