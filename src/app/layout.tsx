import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fotos do Casamento',
  description: 'Capture, aplique filtros e envie para impressão no local.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>{children}</body>
    </html>
  );
}
