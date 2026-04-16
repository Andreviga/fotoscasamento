import useConfig from '../lib/useConfig';

export default function WeddingFooter() {
  const { data } = useConfig(['site']);
  const site = data.site || {};
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rose/10 bg-blush/30 py-8 mt-10">
      <div className="container text-center space-y-2">
        <p className="text-sm text-wine/80">
          {site.nome_noivos || 'Andre & Nathalia'} · {site.data_casamento || '03 de maio de 2026'}
        </p>
        {site.hashtag ? <p className="text-xs text-wine/60">{site.hashtag}</p> : null}
        <p className="text-xs text-wine/50">{year} · Feito com carinho</p>
      </div>
    </footer>
  );
}
