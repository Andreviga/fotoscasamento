import Link from 'next/link';

export default function Header() {
  const links = [
    { href: '/', label: 'Início' },
    { href: '/fotos', label: 'Instacasamento' },
    { href: '/mural', label: 'Mural' },
    { href: '/roteiro', label: 'Roteiro' },
    { href: '/mesa', label: 'Mesa' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/etiqueta', label: 'Etiqueta' },
    { href: '/cardapio', label: 'Cardápio' },
    { href: '/admin', label: 'Admin' }
  ];

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-brand" aria-label="Página inicial">
          André & Nathália
        </Link>
        <nav className="site-nav" aria-label="Navegação principal" style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="site-nav__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
