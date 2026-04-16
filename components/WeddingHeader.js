import Link from 'next/link';
import useConfig from '../lib/useConfig';

export default function WeddingHeader() {
  const { data } = useConfig(['site']);
  const site = data.site || {};

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <div className="flex min-w-0 flex-col gap-1">
          <Link href="/" className="site-brand" aria-label="Página inicial">
            {site.nome_noivos || 'André & Nathália'}
          </Link>
          <p className="text-xs uppercase tracking-[0.22em] text-wine/55">
            {site.data_casamento || '03 de maio de 2026'}
          </p>
        </div>
      </div>
    </header>
  );
}
