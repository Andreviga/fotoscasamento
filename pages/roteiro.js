import Head from 'next/head';
import { useMemo } from 'react';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const ROTEIRO_FALLBACK = [
  { horario: '17:00', titulo: 'Chegada e welcome drink',      descricao: 'Recepção na varanda com drinks de boas-vindas', destaque: false },
  { horario: '17:30', titulo: 'Abertura do salão',            descricao: 'Convidados são convidados a se acomodar',       destaque: false },
  { horario: '18:00', titulo: 'Entrada dos padrinhos',        descricao: 'Cortejo ao som da trilha escolhida',            destaque: true  },
  { horario: '18:15', titulo: 'Entrada dos pais dos noivos',  descricao: 'Momento especial com a família',                destaque: true  },
  { horario: '18:30', titulo: 'Entrada da noiva',             descricao: 'O grande momento — Nathália chega ao altar',    destaque: true  },
  { horario: '18:35', titulo: 'Cerimônia',                   descricao: 'Celebração do casamento',                      destaque: true  },
  { horario: '19:00', titulo: 'Troca de alianças',           descricao: 'O momento mais aguardado',                     destaque: true  },
  { horario: '19:10', titulo: 'Primeiro beijo',               descricao: 'André & Nathália, agora casados',              destaque: true  },
  { horario: '19:15', titulo: 'Fotos com família',            descricao: 'Sessão de fotos com família e padrinhos',      destaque: false },
  { horario: '19:30', titulo: 'Abertura do buffet',           descricao: 'Convidados são convidados a servir-se',        destaque: false },
  { horario: '20:00', titulo: 'Brinde',                       descricao: 'Discurso dos padrinhos e espumante',           destaque: true  },
  { horario: '20:30', titulo: 'Pista de dança',               descricao: 'DJ/Banda dá início à festa',                  destaque: true  },
  { horario: '21:00', titulo: 'Corte do bolo',               descricao: 'Hora do bolo com os noivos',                  destaque: true  },
  { horario: '21:15', titulo: 'Bouquet da noiva',             descricao: 'Arremesso do buquê',                          destaque: true  },
  { horario: '23:00', titulo: 'Encerramento',                 descricao: 'Últimas músicas e despedida',                 destaque: false },
];

const DIA_FESTA = new Date('2026-05-03');

function getItemAtual(items) {
  const agora = new Date();
  if (agora < DIA_FESTA) return null;
  let current = null;
  for (const item of items) {
    const [h, m] = (item.horario || '').split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) continue;
    const t = new Date(DIA_FESTA);
    t.setHours(h, m, 0);
    if (t <= agora) current = item.horario;
  }
  return current;
}

function TimelineItem({ item, index, isAtual }) {
  const isHighlight = Boolean(item?.destaque);

  return (
    <article
      className={`relative rounded-2xl border p-4 sm:p-5 shadow-sm ${
        isAtual
          ? 'border-wine/60 bg-wine/5 ring-2 ring-wine/20'
          : isHighlight
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
    return Array.isArray(raw) && raw.length > 0 ? raw : ROTEIRO_FALLBACK;
  }, [data]);

  const itemAtualHorario = useMemo(() => getItemAtual(items), [items]);

  return (
    <>
      <Head>
        <title>Roteiro — André & Nathália</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <PageTitle
            kicker="Cronograma"
            title="Roteiro do Casamento"
            subtitle="Acompanhe cada momento do nosso grande dia em ordem cronológica."
          />

          {loading ? <LoadingSpinner label="Carregando roteiro" /> : null}
          {!loading && error ? (
            <div className="romantic-panel p-5 text-sm text-red-700">{error}</div>
          ) : null}

          {!loading && !error ? (
            <div className="mx-auto max-w-3xl space-y-4">
              {items.map((item, index) => (
                <TimelineItem
                  key={`${item.horario}-${index}`}
                  item={item}
                  index={index}
                  isAtual={itemAtualHorario === item.horario}
                />
              ))}
            </div>
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
