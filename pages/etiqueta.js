import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const ETIQUETA_FALLBACK = [
  { icone: '👔', titulo: 'Traje', conteudo: 'Esporte fino. Pedimos gentilmente que as convidadas evitem vestidos brancos, creme ou na cor da noiva.' },
  { icone: '⏰', titulo: 'Horários', conteudo: 'A festa começa às 17h. A cerimônia terá início às 18h pontualmente. Por favor, chegue com 20 minutos de antecedência.' },
  { icone: '🔕', titulo: 'Durante a cerimônia', conteudo: 'Deixe o celular no silencioso. Aguarde a entrada da noiva antes de se sentar. Evite passar na frente do fotógrafo e videomaker.' },
  { icone: '📷', titulo: 'Fotos e redes sociais', conteudo: 'Use o Instacasamento no app para publicar fotos no mural ao vivo da festa! Na hashtag #andreanathalia2026 poderemos encontrar suas fotos.' },
  { icone: '🎁', titulo: 'Presente', conteudo: 'Sua presença já é o nosso presente! Se quiser nos presentear, acesse a lista de presentes pelo site.' },
  { icone: '👶', titulo: 'Crianças', conteudo: 'Crianças são bem-vindas! Por favor, verifique no convite se há indicação de faixa etária para este evento.' },
  { icone: '🅿️', titulo: 'Estacionamento', conteudo: 'Serviço de valet disponível no local. Confirme os detalhes com a organização do evento.' },
];

function shareOnWhatsApp() {
  if (typeof window === 'undefined') {
    return;
  }

  const text = encodeURIComponent('Confira o guia de etiqueta do nosso casamento!');
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
}

export default function EtiquetaPage() {
  const { loading, error, data } = useConfig(['site', 'etiqueta']);
  const secoes = Array.isArray(data?.etiqueta?.secoes) && data.etiqueta.secoes.length > 0
    ? data.etiqueta.secoes
    : ETIQUETA_FALLBACK;

  return (
    <>
      <Head>
        <title>Etiqueta — André & Nathália</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <PageTitle
            kicker="Boas práticas"
            title="Etiqueta e Comportamento"
            subtitle="Orientações para que todos aproveitem esse dia inesquecível com leveza e carinho."
          />

          <div className="mb-6 flex justify-center">
            <button type="button" className="btn btn--outline" onClick={shareOnWhatsApp}>
              Compartilhar no WhatsApp
            </button>
          </div>

          {loading ? <LoadingSpinner label="Carregando guia" /> : null}
          {!loading && error ? <div className="romantic-panel p-5 text-sm text-red-700">{error}</div> : null}

          {!loading && !error ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2">
                {secoes.map((secao, index) => (
                  <article
                    key={`${secao.titulo}-${index}`}
                    className="romantic-panel p-5"
                    style={{ animation: `cardRise 0.4s ease ${index * 60}ms both` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-lg">
                        {secao.icone || '✨'}
                      </div>
                      <h2 className="text-xl text-cocoa">{secao.titulo}</h2>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-wine/80">{secao.conteudo}</p>
                  </article>
                ))}
              </section>
            </>
          ) : null}

          <div className="mt-8 text-center text-sm text-wine/70">
            <a href="/fotos" className="font-semibold text-wine hover:underline">
              Ir para o Instacasamento
            </a>
          </div>
        </div>
      </main>
      <WeddingFooter />
      <style jsx global>{`
        @keyframes cardRise {
          from {
            opacity: 0;
            transform: translateY(12px);
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
