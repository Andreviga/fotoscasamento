import '../styles/globals.css';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

const titleFont = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-romance'
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-clean'
});

export default function App({ Component, pageProps }) {
  return (
    <div
      className={`${titleFont.variable} ${bodyFont.variable}`}
      style={{
        '--font-wedding-title': 'var(--font-romance)',
        '--font-wedding-body': 'var(--font-clean)'
      }}
    >
      <Component {...pageProps} />
    </div>
  );
}
