import Link from 'next/link';

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-brand" aria-label="Página inicial">
          André & Nathália
        </Link>
        <nav className="site-nav" aria-label="Navegação principal">
          <Link href="/" className="site-nav__link">
            Início
          </Link>
          <Link href="/fotos" className="site-nav__link">
            Instacasamento
          </Link>
          <Link href="/mural" className="site-nav__link">
            Mural
          </Link>
          <Link href="/cardapio" className="site-nav__link">
            Cardápio
          </Link>
        </nav>
      </div>
    </header>
  );
}
