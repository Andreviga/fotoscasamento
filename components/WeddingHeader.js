import Link from 'next/link';
import useConfig from '../lib/useConfig';

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/fotos', label: 'Instacasamento' },
  { href: '/mural', label: 'Mural' },
  { href: '/roteiro', label: 'Roteiro' },
  { href: '/mesa', label: 'Mesa' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/etiqueta', label: 'Etiqueta' },
  { href: '/cardapio', label: 'Cardapio' }
];

export default function WeddingHeader() {
  const { data } = useConfig(['site']);
  const site = data.site || {};

  return (
    <header className="site-header">
      <div className="container site-header__inner" style={{ gap: '0.8rem' }}>
        <Link href="/" className="site-brand" aria-label="Pagina inicial">
          {site.nome_noivos || 'Andre & Nathalia'}
        </Link>
        <nav className="site-nav" aria-label="Navegacao principal" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
          <Link href="/admin" className="site-nav__link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
