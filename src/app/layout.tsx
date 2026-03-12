import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

const romance = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-romance'
});

const clean = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-clean'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fotoscasamento.vercel.app/'),
  title: 'André & Nathália — 03/05/2026',
  description:
    'Cerimônia às 16h • Rua das Araribás, 25 — São Bernardo do Campo/SP. Clique para ver informações e lista de presentes.',
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'André & Nathália — 03/05/2026',
    description:
      'Cerimônia às 16h • Rua das Araribás, 25 — São Bernardo do Campo/SP. Clique para ver informações e lista de presentes.',
    url: 'https://fotoscasamento.vercel.app/',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Convite digital de André & Nathália com data e local do casamento.'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'André & Nathália — 03/05/2026',
    description:
      'Cerimônia às 16h • Rua das Araribás, 25 — São Bernardo do Campo/SP. Clique para ver informações e lista de presentes.',
    images: ['/api/og']
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${romance.variable} ${clean.variable} bg-[#fbfaf7] font-cleanSans text-[#22352c] antialiased`}>
        {children}
      </body>
    </html>
  );
}
