import Link from 'next/link';
import useConfig from '../lib/useConfig';

const NAV_ITEMS = [
  { href: '/#info', label: 'Início' },
  { href: '/#mesa', label: 'Mesa' },
  { href: '/#fotos', label: 'Fotos' },
  { href: '/#mural', label: 'Mural' },
  { href: '/#extra', label: 'Mais' }
];

export default function WeddingHeader() {
  const { data } = useConfig(['site']);
  const site = data.site || {};

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="flex min-w-0 flex-col gap-1">
          <Link href="/" className="site-brand" aria-label="Página inicial">
            <span className="wedding-names" style={{ '--font-size': '34px', '--line-height': '1' }}>
              André <span className="wedding-amp">&amp;</span> Nathália
            </span>
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-wine/55">
            {site.data_casamento || '03 de maio de 2026'}
          </p>
        </div>
        <nav className="site-nav" aria-label="Atalhos principais">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
