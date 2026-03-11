import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        blush: '#f6eef1',
        rose: '#b76e79',
        wine: '#6f3642',
        ivory: '#fffdf9'
      },
      fontFamily: {
        serifRomance: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        cleanSans: ['"Inter"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 35px rgba(111, 54, 66, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
