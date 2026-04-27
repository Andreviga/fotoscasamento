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
  mesaNome?: string;
  grupo?: string;
  nomeConvite?: string;
};

type MesaGroup = {
  mesa: number;
  mesaNome: string;
  convidados: string[];
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
  const [allGuests, setAllGuests] = useState<GuestResult[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debounced = useDebouncedValue(query, 300);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let active = true;

    async function loadAllGuests() {
      try {
        const response = await fetch('/api/searchGuest?all=1');
        const payload = await response.json();
        if (!active || !response.ok) return;
        setAllGuests(Array.isArray(payload?.results) ? payload.results : []);
      } catch {
        if (active) {
          setAllGuests([]);
        }
      }
    }

    void loadAllGuests();
    return () => {
      active = false;
    };
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

  const selectedMesaGuests = useMemo(() => {
    if (!selected || typeof selected.mesa !== 'number') {
      return [];
    }

    return allGuests
      .filter((guest) => guest.mesa === selected.mesa)
      .map((guest) => guest.nomeOriginal)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [selected, allGuests]);

  const mesas = useMemo<MesaGroup[]>(() => {
    const grouped = new Map<number, MesaGroup>();

    allGuests.forEach((guest) => {
      if (typeof guest.mesa !== 'number') return;

      const current = grouped.get(guest.mesa) || {
        mesa: guest.mesa,
        mesaNome: guest.mesaNome || guest.grupo || guest.nomeConvite || `Mesa ${guest.mesa}`,
        convidados: []
      };

      if (guest.nomeOriginal && !current.convidados.includes(guest.nomeOriginal)) {
        current.convidados.push(guest.nomeOriginal);
      }

      grouped.set(guest.mesa, current);
    });

    return Array.from(grouped.values())
      .sort((a, b) => a.mesa - b.mesa)
      .map((mesa) => ({
        ...mesa,
        convidados: mesa.convidados.sort((a, b) => a.localeCompare(b, 'pt-BR'))
      }));
  }, [allGuests]);

  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4 sm:space-y-5">
        <header className="romantic-panel bg-[linear-gradient(180deg,rgba(253,251,247,0.98),rgba(250,246,240,0.92))] p-5 text-center sm:p-7">
          <p className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/70 text-xl text-wine sm:h-16 sm:w-16">A&amp;N</p>
          <div className="mx-auto mt-3 h-px w-32 bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
          <h1 className="mt-3 text-4xl text-cocoa sm:text-5xl">Encontre Sua Mesa</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-roseDeep/80">Busca de convidados</p>
          <div className="mx-auto mt-4 max-w-xl">
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-roseDeep/75">🔎</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Digite seu nome..."
                className="input-elegant pl-12 text-base sm:text-lg"
                autoFocus
              />
            </div>
            <p className="mt-2 text-xs text-cocoa/65">Busque pelo nome completo ou pelo nome usado no convite.</p>
          </div>
        </header>

        {loading ? (
          <div className="romantic-panel flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
          </div>
        ) : null}

        {!loading && query.trim() && selected ? (
          <article className="romantic-panel border-gold/40 bg-[linear-gradient(180deg,rgba(255,252,245,0.98),rgba(250,246,240,0.95))] p-5 sm:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-roseDeep/70">Convidado localizado</p>
            <h2 className="mt-1 text-2xl text-cocoa sm:text-3xl">{selected.nomeOriginal}</h2>
            <div className="mt-3 h-px w-32 bg-gradient-to-r from-transparent via-gold/80 to-transparent" />
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <p className="font-serifRomance text-5xl text-gold sm:text-6xl">{typeof selected.mesa === 'number' ? selected.mesa : '--'}</p>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/70">Mesa</p>
                <p className="text-base text-cocoa">{selected.mesaNome || selected.grupo || selected.nomeConvite || '-'}</p>
              </div>
            </div>

            {selectedMesaGuests.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-roseDeep/20 bg-white/70 p-4">
                <p className="text-sm font-semibold text-cocoa">Convidados nesta mesa</p>
                <p className="mt-0.5 text-xs text-cocoa/65">{selectedMesaGuests.length} pessoas alocadas</p>
                <div className="mt-2 grid gap-1.5 text-sm text-cocoa/85 sm:grid-cols-2">
                  {selectedMesaGuests.map((guest) => (
                    <p key={guest}>• {guest}</p>
                  ))}
                </div>
              </div>
            ) : null}

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

        {!loading && query.trim() && results.length > 1 ? (
          <div className="romantic-panel p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/70">Sugestoes parecidas</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {results.slice(1).map((item) => (
                <div key={item.id} className="rounded-xl border border-roseDeep/20 bg-white/70 p-3">
                  <p className="font-medium text-cocoa">{item.nomeOriginal}</p>
                  <p className="text-xs text-cocoa/70">
                    Mesa {typeof item.mesa === 'number' ? item.mesa : '--'} · {item.mesaNome || item.grupo || item.nomeConvite || '-'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!loading && query.trim() && results.length === 0 ? (
          <div className="romantic-panel p-5 text-sm text-cocoa/75">
            <p>Nome não encontrado.</p>
            <p className="mt-1">Tente buscar pelo nome do convite ou verifique a grafia.</p>
          </div>
        ) : null}

        {!loading && !query.trim() ? (
          <div className="romantic-panel p-5 text-sm text-cocoa/75">
            <p>Digite seu nome para localizar sua mesa.</p>
            <p className="mt-1">As mesas e convidados já estão organizados abaixo para consulta rápida.</p>
          </div>
        ) : null}

        <section className="romantic-panel overflow-hidden">
          <header className="border-b border-roseDeep/15 bg-white/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/70">Painel de mesas</p>
            <h3 className="text-xl text-cocoa">Distribuição de convidados</h3>
          </header>
          <div className="grid gap-3 p-3 sm:grid-cols-2">
            {mesas.map((mesa) => (
              <details key={mesa.mesa} className="rounded-2xl border border-roseDeep/20 bg-white/75 p-3" open={mesa.mesa <= 2}>
                <summary className="cursor-pointer list-none">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serifRomance text-2xl text-gold">Mesa {mesa.mesa}</p>
                    <span className="rounded-full border border-roseDeep/20 px-2 py-1 text-[11px] text-cocoa/75">{mesa.convidados.length} convidados</span>
                  </div>
                  <p className="text-sm uppercase tracking-[0.08em] text-cocoa/75">{mesa.mesaNome}</p>
                </summary>
                <div className="mt-2 space-y-1 text-sm text-cocoa/85">
                  {mesa.convidados.map((nome) => (
                    <p key={`${mesa.mesa}-${nome}`}>• {nome}</p>
                  ))}
                </div>
              </details>
            ))}
            {mesas.length === 0 ? (
              <div className="rounded-2xl border border-roseDeep/20 bg-white/75 p-4 text-sm text-cocoa/75">
                Mesas indisponíveis no momento.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
