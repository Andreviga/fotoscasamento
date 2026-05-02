import { NextResponse } from 'next/server';

const gifts = [
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

export function GET() {
  return NextResponse.json(gifts);
}
