import useConfig from '../lib/useConfig';

export default function WeddingFooter() {
  const { data } = useConfig(['site']);
  const site = data.site || {};
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rose/10 bg-blush/30 py-8 mt-10">
      <div className="container space-y-4 text-center">
        <p className="text-sm text-wine/80">
          {site.nome_noivos || 'Andre & Nathalia'} · {site.data_casamento || '03 de maio de 2026'}
        </p>
        {site.hashtag ? <p className="text-xs text-wine/60">{site.hashtag}</p> : null}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-wine/65">
          <a href="/roteiro" className="hover:text-cocoa">Roteiro</a>
          <span>•</span>
          <a href="/mesa" className="hover:text-cocoa">Mesa</a>
          <span>•</span>
          <a href="/mapa" className="hover:text-cocoa">Mapa</a>
          <span>•</span>
          <a href="/cardapio" className="hover:text-cocoa">Cardapio</a>
          <span>•</span>
          <a href="/fotos" className="hover:text-cocoa">Instacasamento</a>
        </div>
        <p className="text-xs text-wine/50">{year} · Feito com carinho</p>
      </div>
    </footer>
  );
}
