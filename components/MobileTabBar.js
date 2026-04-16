import Link from 'next/link';
import { useRouter } from 'next/router';

const QUICK_LINKS = [
  { href: '/', label: 'Início' },
  { href: '/roteiro', label: 'Roteiro' },
  { href: '/mesa', label: 'Mesa' },
  { href: '/fotos', label: 'Fotos' },
  { href: '/mural', label: 'Mural' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/cardapio', label: 'Cardápio' },
  { href: '/etiqueta', label: 'Etiqueta' }
];

export default function MobileTabBar() {
  const router = useRouter();

  function isActive(path) {
    return router.pathname === path;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-roseDeep/20 bg-ivory/95 pb-safe backdrop-blur sm:hidden" aria-label="Navegação rápida mobile">
      <div className="mx-auto flex h-16 max-w-3xl items-center gap-2 overflow-x-auto px-3" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
              isActive(item.href)
                ? 'border-wine/35 bg-wine/10 text-wine'
                : 'border-roseDeep/25 bg-white/70 text-roseDeep/90'
            }`}
            aria-label={`Abrir ${item.label}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isActive(item.href) ? 'bg-wine' : 'bg-gold'}`} aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
