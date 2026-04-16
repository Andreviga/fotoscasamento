'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppTab } from '@/components/TabBar';

type TabMesaProps = {
  onNavigate: (tab: AppTab) => void;
};

type GuestResult = {
  id: string;
  nomeOriginal: string;
  mesa?: number;
  grupo?: string;
  nomeConvite?: string;
};

function useDebouncedValue(value: string, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function TabMesa({ onNavigate }: TabMesaProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GuestResult[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debounced = useDebouncedValue(query, 300);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let active = true;

    async function searchGuest() {
      if (!debounced.trim()) {
        if (active) {
          setResults([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/searchGuest?q=${encodeURIComponent(debounced)}`);
        const payload = await response.json();
        if (!active) return;

        if (!response.ok) {
          setResults([]);
          return;
        }

        setResults(Array.isArray(payload?.results) ? payload.results : []);
      } catch {
        if (active) {
          setResults([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void searchGuest();
    return () => {
      active = false;
    };
  }, [debounced]);

  const selected = useMemo(() => results[0] || null, [results]);

  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4">
        <header className="romantic-panel p-4 sm:p-5">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-roseDeep/75">🔍</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Digite seu nome..."
              className="input-elegant pl-12 text-lg"
              autoFocus
            />
          </div>
        </header>

        {loading ? (
          <div className="romantic-panel flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
          </div>
        ) : null}

        {!loading && query.trim() && selected ? (
          <article className="rounded-xl border border-gold/40 bg-gold/10 p-5">
            <p className="text-2xl">🎉</p>
            <h2 className="mt-2 text-2xl text-cocoa">{selected.nomeOriginal}</h2>
            <p className="mt-1 font-serifRomance text-4xl text-gold">Mesa {typeof selected.mesa === 'number' ? selected.mesa : '--'}</p>
            <p className="mt-1 text-sm text-cocoa/70">{selected.grupo || selected.nomeConvite || '-'}</p>
            <button
              type="button"
              className="btn btn--outline mt-4"
              onClick={() => {
                if (typeof window !== 'undefined' && typeof selected.mesa === 'number') {
                  window.sessionStorage.setItem('tab-mais-focus', 'mapa');
                  window.sessionStorage.setItem('tab-mais-mesa', String(selected.mesa));
                }
                onNavigate('mais');
              }}
            >
              Ver mesa no mapa
            </button>
          </article>
        ) : null}

        {!loading && query.trim() && results.length === 0 ? (
          <div className="romantic-panel p-5 text-sm text-cocoa/75">
            <p>Nome nao encontrado.</p>
            <p className="mt-1">Tente buscar pelo nome do convite ou verifique a grafia.</p>
          </div>
        ) : null}

        {!loading && !query.trim() ? (
          <div className="romantic-panel p-5 text-sm text-cocoa/75">
            <p>Busque pelo seu nome completo</p>
            <p className="mt-1">ou pelo nome que esta no convite.</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
