import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function MesaPage() {
  const { data } = useConfig(['site', 'aparencia']);
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
        <title>Minha Mesa — André & Nathália</title>
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
              autoFocus
              inputMode="search"
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

                    <div className="mt-4 overflow-hidden rounded-2xl border border-roseDeep/20 bg-white shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-roseDeep/15 px-3 py-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-wine/70">Mapa com mesa destacada</p>
                        <Link href={`/mapa?destaque=mesa-${selected.mesa}`} className="text-xs font-semibold text-wine hover:underline">
                          Abrir mapa completo →
                        </Link>
                      </div>
                      <iframe
                        title={`Mapa com mesa ${selected.mesa} destacada`}
                        src={`/mapa?destaque=mesa-${selected.mesa}`}
                        className="w-full border-0"
                        style={{ height: '320px' }}
                      />
                    </div>
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

          </div>
        </div>
      </main>
      <WeddingFooter />
    </>
  );
}
