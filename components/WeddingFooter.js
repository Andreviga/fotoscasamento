import useConfig from '../lib/useConfig';
import MobileTabBar from './MobileTabBar';
import { useEffect, useState } from 'react';

const FOOTER_LINKS = [
  { href: '/#info', label: 'Início' },
  { href: '/#mesa', label: 'Mesa' },
  { href: '/#fotos', label: 'Fotos' },
  { href: '/#mural', label: 'Mural' },
  { href: '/#mais', label: 'Info' }
];

export default function WeddingFooter() {
  const { data } = useConfig(['site']);
  const site = data.site || {};
  const year = new Date().getFullYear();
  const [isEmbeddedView, setIsEmbeddedView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const embeddedByQuery = new URLSearchParams(window.location.search).get('embedded') === '1';
    const embeddedByFrame = window.self !== window.top;
    setIsEmbeddedView(embeddedByQuery || embeddedByFrame);
  }, []);

  if (isEmbeddedView) {
    return null;
  }

  return (
    <>
      <footer className="mt-10 border-t border-rose/10 bg-blush/30 py-8">
        <div className="container space-y-4 text-center">
          <p className="text-sm text-wine/80">
            {site.nome_noivos || 'André & Nathália'} · {site.data_casamento || '03 de maio de 2026'}
          </p>
          {site.hashtag ? <p className="text-xs text-wine/60">{site.hashtag}</p> : null}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-wine/65">
            {FOOTER_LINKS.map((item) => (
              <a key={item.href} href={item.href} className="site-nav__link !px-3 !py-1.5 !text-xs">
                {item.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-wine/50">{year} · Feito com carinho</p>
        </div>
      </footer>
      <MobileTabBar />
    </>
  );
}
