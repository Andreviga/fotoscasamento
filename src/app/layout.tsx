import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '✿ Cabine Fotográfica',
  description: 'Cabine de fotos mobile-first com filtros e impressão para convidados.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
