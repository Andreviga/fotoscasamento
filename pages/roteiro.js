import Head from 'next/head';
import { useMemo } from 'react';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import GuestJourney from '../components/GuestJourney';
import useConfig from '../lib/useConfig';

function TimelineItem({ item, index }) {
  const isHighlight = Boolean(item?.destaque);

  return (
    <article
      className={`relative rounded-2xl border p-4 sm:p-5 shadow-sm ${
        isHighlight
          ? 'border-gold/40 bg-[#fff9eb]'
          : 'border-roseDeep/20 bg-white/85'
      }`}
      style={{ animation: `fadeInUp 0.45s ease ${index * 70}ms both` }}
    >
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${isHighlight ? 'bg-gold/20' : 'bg-roseDeep/10'}`}>
          {item?.icone || '✨'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wine/60">{item?.horario || '--:--'}</p>
          <h2 className="mt-1 text-xl text-cocoa">{item?.titulo || 'Momento especial'}</h2>
          <p className="mt-1 text-sm text-wine/75">{item?.descricao || ''}</p>
        </div>
      </div>
    </article>
  );
}

export default function RoteiroPage() {
  const { loading, error, data } = useConfig(['site', 'roteiro']);

  const items = useMemo(() => {
    const raw = data?.roteiro?.itens;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  return (
    <>
      <Head>
        <title>Roteiro do Casamento</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <PageTitle
            kicker="Cronograma"
            title="Roteiro do Casamento"
            subtitle="Acompanhe cada momento do nosso grande dia em ordem cronologica."
          />

          {loading ? <LoadingSpinner label="Carregando roteiro" /> : null}
          {!loading && error ? (
            <div className="romantic-panel p-5 text-sm text-red-700">{error}</div>
          ) : null}

          {!loading && !error ? (
            <>
              <div className="mx-auto max-w-3xl space-y-4">
                {items.map((item, index) => (
                  <TimelineItem key={`${item.horario}-${index}`} item={item} index={index} />
                ))}
              </div>

              <div className="mx-auto mt-8 max-w-5xl">
                <GuestJourney
                  currentPath="/roteiro"
                  compact
                  title="Planeje seus proximos passos"
                  subtitle="Depois do cronograma, consulte sua mesa, veja o mapa do salao e acompanhe o cardapio da noite."
                />
              </div>
            </>
          ) : null}
        </div>
      </main>
      <WeddingFooter />
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
