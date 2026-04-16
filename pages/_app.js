import '../styles/globals.css';
import { Lato, Playfair_Display } from 'next/font/google';

const titleFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-wedding-title'
});

const bodyFont = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-wedding-body'
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${titleFont.variable} ${bodyFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
