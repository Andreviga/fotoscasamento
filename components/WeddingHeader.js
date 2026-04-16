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
  { href: '/cardapio', label: 'Cardápio' }
];

export default function WeddingHeader() {
  const { data } = useConfig(['site']);
  const site = data.site || {};

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="flex min-w-0 flex-col gap-1">
          <Link href="/" className="site-brand" aria-label="Pagina inicial">
            {site.nome_noivos || 'Andre & Nathalia'}
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-wine/55">
            {site.data_casamento || '03 de maio de 2026'}
          </p>
        </div>

        <nav className="site-nav" aria-label="Navegacao principal">
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
