import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'André & Nathália',
  description: 'Instacasamento, mural ao vivo e menu digital do casamento de André & Nathália.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper pb-16 text-cocoa antialiased sm:pb-0">
        {children}
      </body>
    </html>
  );
}
