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
        blush: '#f7eeec',
        rose: '#d8b4ab',
        roseDeep: '#b47d75',
        wine: '#6b3f3a',
        cocoa: '#3b2724',
        ivory: '#fffaf6',
        linen: '#f3e7e2',
        gold: '#d4b483'
      },
      fontFamily: {
        serifRomance: ['var(--font-romance)', 'Georgia', 'serif'],
        cleanSans: ['var(--font-clean)', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        sans: ['system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px rgba(107, 63, 58, 0.12)',
        frame: '0 12px 30px rgba(59, 39, 36, 0.12)'
      },
      backgroundImage: {
        paper: 'radial-gradient(circle at top left, rgba(212,180,131,0.18), transparent 28%), radial-gradient(circle at top right, rgba(216,180,171,0.24), transparent 22%), linear-gradient(180deg, #fffdf9 0%, #f7eeec 100%)'
      }
    }
  },
  plugins: []
};

export default config;