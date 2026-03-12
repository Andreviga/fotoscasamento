import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        blush: '#f7f6f2',
        rose: '#cfdacd',
        roseDeep: '#6f8475',
        wine: '#0f4f3d',
        cocoa: '#22352c',
        ivory: '#fbfaf7',
        linen: '#ebe7dc',
        gold: '#c9b37e'
      },
      fontFamily: {
        serifRomance: ['var(--font-romance)', 'Georgia', 'serif'],
        cleanSans: ['var(--font-clean)', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 24px 60px rgba(34, 53, 44, 0.12)',
        frame: '0 14px 32px rgba(34, 53, 44, 0.14)'
      },
      backgroundImage: {
        paper: 'radial-gradient(circle at top left, rgba(201,179,126,0.18), transparent 28%), radial-gradient(circle at top right, rgba(111,132,117,0.16), transparent 24%), linear-gradient(180deg, #fdfcf8 0%, #f7f6f2 100%)'
      }
    }
  },
  plugins: []
};

export default config;