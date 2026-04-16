import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import GuestJourney from '../components/GuestJourney';
import useConfig from '../lib/useConfig';

const MAP_TYPE_COLORS = {
  mesa_grande: '#C9A96E',
  mesa_pequena: '#D8B774',
  buffet: '#F0DCA8',
  bar: '#C99358',
  dj: '#3D3D3D',
  bolo: '#D97B84',
  cafe: '#A67C52',
  sofa: '#8EA7A0',
  bistro: '#D3874A',
  planta: '#6F9A6E',
  outro: '#B8A794'
};

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function parseMesaNumberFromText(value) {
  const text = String(value || '').toLowerCase();

  const direct = text.match(/mesa\s*[a-z_-]*\s*(\d+)/i);
  if (direct) {
    return Number(direct[1]);
  }

  const fromId = text.match(/mesa[-_\s]*[a-z_-]*[-_\s]*(\d+)/i);
  if (fromId) {
    return Number(fromId[1]);
  }

  return null;
}

function getMesaNumberFromElement(elemento) {
  if (typeof elemento?.mesaNumero === 'number') {
    return elemento.mesaNumero;
  }

  return parseMesaNumberFromText(elemento?.nome) ?? parseMesaNumberFromText(elemento?.id);
}

function MiniMapPreview({ elementos, mesaNumber }) {
  if (!Array.isArray(elementos) || elementos.length === 0 || typeof mesaNumber !== 'number') {
    return null;
  }

  const mesaAlvo = elementos.find((item) => {
    const mesaElemento = getMesaNumberFromElement(item);
    return mesaElemento === mesaNumber && String(item?.tipo || '').startsWith('mesa');
  });

  return (
    <div className="mt-4 rounded-xl border border-roseDeep/20 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wine/60">Mini mapa</p>

      <div className="relative mt-2 overflow-hidden rounded-lg border border-roseDeep/20 bg-[#fdf9ef]" style={{ aspectRatio: '16 / 10' }}>
        <div className="absolute inset-x-0 bottom-0 h-[21%] bg-[#f4e9d0] opacity-80" />
        {elementos.map((item) => {
          const color = item?.cor || MAP_TYPE_COLORS[item?.tipo] || MAP_TYPE_COLORS.outro;
          const highlighted = mesaAlvo?.id === item?.id;

          return (
            <div
              key={item.id}
              title={item.nome}
              className={`absolute rounded-[4px] border border-black/10 ${highlighted ? 'z-20 animate-pulse ring-2 ring-wine' : 'z-10 opacity-85'}`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${item.largura}%`,
                height: `${item.altura}%`,
                transform: `translate(-50%, -50%) rotate(${item.rotacao || 0}deg)`,
                background: color
              }}
            />
          );
        })}
      </div>

      {mesaAlvo ? (
        <p className="mt-2 text-xs text-wine/70">Mesa {mesaNumber} destacada no layout.</p>
      ) : (
        <p className="mt-2 text-xs text-wine/70">Mesa {mesaNumber} nao localizada no layout atual. Toque em "Ver no mapa do salao" para conferir.</p>
      )}
    </div>
  );
}

export default function MesaPage() {
  const { data } = useConfig(['site', 'aparencia', 'mapa']);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [others, setOthers] = useState([]);

  const debounced = useDebouncedValue(search, 300);

  useEffect(() => {
    async function run() {
      if (!debounced.trim()) {
        setResults([]);
        setError('');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/searchGuest?q=${encodeURIComponent(debounced)}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || 'Falha na busca');
        }
        setResults(payload.results || []);
      } catch (requestError) {
        setResults([]);
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [debounced]);

  const selected = results[0] || null;
  const mostrarOutros = Boolean(data?.aparencia?.mostrar_outros_na_mesa);
  const mapaElementos = Array.isArray(data?.mapa?.elementos) ? data.mapa.elementos : [];

  useEffect(() => {
    async function loadOthers() {
      if (!selected || !mostrarOutros || typeof selected.mesa !== 'number') {
        setOthers([]);
        return;
      }

      try {
        const response = await fetch('/api/searchGuest?all=1');
        const payload = await response.json();
        const list = (payload.results || []).filter(
          (item) => item.id !== selected.id && item.mesa === selected.mesa
        );
        setOthers(list.slice(0, 10));
      } catch (requestError) {
        console.error(requestError);
        setOthers([]);
      }
    }

    loadOthers();
  }, [selected, mostrarOutros]);

  const emptyMessage = useMemo(() => {
    if (!debounced.trim() || loading) return '';
    if (results.length > 0) return '';
    return 'Nao encontramos esse nome. Verifique a grafia ou busque pelo nome do convite.';
  }, [debounced, loading, results.length]);

  return (
    <>
      <Head>
        <title>Busca de Mesa</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <PageTitle
            kicker="Descubra sua mesa"
            title="Busca de Mesa"
            subtitle="Digite seu nome para encontrar rapidamente onde voce vai sentar."
          />

          <section className="mx-auto max-w-2xl romantic-panel p-5 sm:p-7">
            <label className="form-label" htmlFor="mesa-search">Nome do convidado</label>
            <input
              id="mesa-search"
              className="input-elegant mt-2 text-lg"
              placeholder="Ex: Maria Silva"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-wine/65">Busca inteligente por nome do convidado ou nome do convite.</p>
          </section>

          <div className="mx-auto mt-6 max-w-2xl space-y-4">
            {loading ? <LoadingSpinner label="Buscando convidado" /> : null}
            {error ? <div className="romantic-panel p-4 text-sm text-red-700">{error}</div> : null}

            {selected ? (
              <article className="romantic-panel p-5 sm:p-7">
                <div className="text-3xl">🎉</div>
                <h2 className="mt-2 text-2xl text-cocoa">Ola, {selected.nomeOriginal}!</h2>
                {typeof selected.mesa === 'number' ? (
                  <div className="mt-4 rounded-2xl border border-gold/40 bg-[#fff9eb] p-4">
                    <p className="text-sm text-wine/70">Voce esta na</p>
                    <p className="text-3xl font-semibold text-cocoa">Mesa {selected.mesa}</p>
                    <Link href={`/mapa?destaque=mesa-${selected.mesa}`} className="mt-3 inline-flex text-sm font-semibold text-wine hover:underline">
                      Ver no mapa do salao →
                    </Link>

                    <MiniMapPreview elementos={mapaElementos} mesaNumber={selected.mesa} />
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-wine/80">Sua mesa ainda nao foi definida. Procure a recepcao ao chegar.</p>
                )}

                <p className="mt-3 text-sm text-wine/80">Grupo: {selected.grupo || selected.nomeConvite || '-'}</p>

                {mostrarOutros && others.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-cocoa">Outros convidados da mesma mesa:</p>
                    <ul className="mt-2 text-sm text-wine/80">
                      {others.map((guest) => (
                        <li key={guest.id}>• {guest.nomeOriginal}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </article>
            ) : null}

            {emptyMessage ? (
              <div className="romantic-panel p-5 text-sm text-wine/80">
                <p>{emptyMessage}</p>
                <p className="mt-2">Contato de emergencia: {data?.site?.contato_emergencia || 'consulte a equipe do evento.'}</p>
              </div>
            ) : null}

            <GuestJourney
              currentPath="/mesa"
              compact
              title="Depois de encontrar sua mesa"
              subtitle="Confira o mapa do salao, o roteiro do dia e o cardapio para seguir pela festa sem se perder."
            />
          </div>
        </div>
      </main>
      <WeddingFooter />
    </>
  );
}
