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
  title: 'André & Nathália',
  description: 'Instacasamento, mural ao vivo e cardápio digital do casamento de André & Nathália.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${romance.variable} ${clean.variable} bg-paper pb-16 font-cleanSans text-cocoa antialiased sm:pb-0`}>
        {children}
      </body>
    </html>
  );
}
