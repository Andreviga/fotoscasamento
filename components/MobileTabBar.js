import Link from 'next/link';
import { useRouter } from 'next/router';

const QUICK_LINKS = [
  { href: '/#info', label: 'Início' },
  { href: '/#mesa', label: 'Mesa' },
  { href: '/#fotos', label: 'Fotos' },
  { href: '/#mural', label: 'Mural' },
  { href: '/#extra', label: 'Mais' }
];

export default function MobileTabBar() {
  const router = useRouter();

  function isActive(path) {
    if (router.pathname === '/' && path.startsWith('/#')) {
      return router.asPath === path || (path === '/#info' && (router.asPath === '/' || router.asPath === ''));
    }

    return router.asPath === path || router.pathname === path;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-roseDeep/20 bg-ivory/95 pb-safe backdrop-blur sm:hidden" aria-label="Navegação rápida mobile">
      <div className="mx-auto grid h-16 max-w-4xl grid-cols-5 gap-2 px-3" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {QUICK_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex min-w-0 items-center justify-center rounded-full border px-3 py-2 text-xs font-semibold ${
              isActive(item.href)
                ? 'border-wine/35 bg-wine/10 text-wine'
                : 'border-roseDeep/25 bg-white/70 text-roseDeep/90'
            }`}
            aria-label={`Abrir ${item.label}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
