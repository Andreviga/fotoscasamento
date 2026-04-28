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

// Dados completos das mesas – embutidos no cliente para garantir exibição mesmo sem API
const STATIC_TABLES = [
  { mesa: 1,  mesaNome: 'Amsterdã',       convidados: ['Marisa de Fátima Vigarani de Camargo','Claudio de Camargo','Wagner Vigarani de Camargo','Fabiana Vigarani de Camargo','Willian Alves Pereira','Yasmine Vigarani de Camargo Pereira'] },
  { mesa: 2,  mesaNome: 'Campos do Jordão', convidados: ['Andreia Moreira de Medeiros','Brasilio Leão de Medeiros','Sophia Moreira de Medeiros','Lucas Vasconcelos','João Moreira de Medeiros','Giovanna de Cássia Borocino'] },
  { mesa: 3,  mesaNome: 'Colônia',         convidados: ['Geny Ferreira','Benicia de Jesus Medeiros','Paulo Sérgio Barros','Andreia Dias Medeiros','Byron Medeiros','Pedro Dias Medeiros'] },
  { mesa: 4,  mesaNome: 'Copenhague',      convidados: ['Bruna Kaiani Moreira','Denis Wilson Santos de Sá','Nicole Gomes de Sá','Davi Patrick Gomes de Sá','Vinicius Moreira Santos de Sá','Rogério Moreira','Renata Sampaio'] },
  { mesa: 5,  mesaNome: 'Patagônia',       convidados: ['Camila Ferraz Laragnoit','Gustavo Mitsui','Glaucy Concórdia','Renato Concórdia','Julia Concórdia','Allan Ferreira','Giovana Gatto Palma'] },
  { mesa: 6,  mesaNome: 'Estocolmo',       convidados: ['Rafaella Cruaia','Anderson Borges','Jhenifer Ernandes','Gabriel Bernadone','Andreia Borges','Evangelista Cunha','Edvaldo Junior'] },
  { mesa: 7,  mesaNome: 'Giethoorn',       convidados: ['Rosangela Scarpa','Custódio Scarpa','Gabriela Scarpa','Leticia Scarpa','Vera Lúcia Pinheiro','Antônio Pinheiro'] },
  { mesa: 8,  mesaNome: 'Kefalonia',       convidados: ['Daniel Camargo Brindo da Cruz','Isabele Camargo Brindo da Cruz','Miguel Oliveira Brindo da Cruz','Rafael Oliveira Brindo da Cruz','Beatriz Sanches da Silva','Bárbara Ingrid Assis da Glória'] },
  { mesa: 9,  mesaNome: 'Las Vegas',       convidados: ['Luis Felipe Cimino','Bianca de Sousa Carvalho','Guilherme Siqueira','Eduarda Rodrigues Siqueira','Thiago Sousa','Camila Pinheiro'] },
  { mesa: 10, mesaNome: 'Madrid',          convidados: ['Alice Oliveira','Sthefani Leite Bispo da Silva','Mayara Brigida Magalhães Silveira','Lucas Pereira Gracindo','Tatiane Fernandes','Hernane Faria'] },
  { mesa: 11, mesaNome: 'Milão',           convidados: ['Gabriele Taiani Moreira','Willian Lucena Santos','Cecilia Moreira','Alice Moreira','Isadora Rafaeli Moreira','Jeferson Moreira','Janaina Sabioni','Maria Eduarda Moreira','Maria Valentina Moreira','Arthur Sabioni'] },
  { mesa: 12, mesaNome: 'Paris',           convidados: ['Bárbara Cristina Moreira','Erasmo Avelar','Luidy Moreira','Beatriz Marinho Marcondes','Thaynara Moreira','Carlos Eduardo Batista dos Reis Santos','Catia Ferreira','Caroline Silva Damasceno Brandão','Guilherme Moreira Brandão'] },
  { mesa: 13, mesaNome: 'Roma',            convidados: ['Camila Marcolino da Silva So','Borny Cristiano So','Alessandra Francisco de Melo Franco','Felipe de Melo Franco','Cristina Wolter Sabino','Ricardo Tamisari','Daniela Fonzar','Patrícia Fonzar','Rodrigo Antunes'] },
  { mesa: 14, mesaNome: 'Salar de Uyuni', convidados: ['Ivan Lecci La Rosa','Bianca Riva','Denis Araújo Luiz','Priscila Sousa Rosa','Braian de Almeida','Miguel Sousa Rosa Agostinho','Giulia Pietropaolo Guimarães','Joeli Rocha','Bruno Galvão Oliveira','Mayra Ampuero Davanço','Mariah Marques de Almeida'] },
  { mesa: 15, mesaNome: 'Santorini',       convidados: ['Felipe Fernandes','Tassia da Cruz Fernandes','Pamella Nagen','Henrique Tancredi','Filipe Gomes Moreira','Caroline dos Santos Pizzo','Marco Aurélio Delpoio','Thalissa Galvanin','Ely Guedes Sales','Rayssa Vaz'] },
  { mesa: 16, mesaNome: 'Sarajevo',        convidados: ['Pedro Ferreira','Janaína Borbely','Theo Ferreira Borbely','Guilherme Aizner','Brenda Saito','Leonardo Almudin de Oliveira','Rebecca Belasco','Felipe Taveira de Lima','Beatriz Aguiar','Gabriel Saragó','Cristielen Araújo Saragó','Mariana Saragó'] },
  { mesa: 17, mesaNome: 'Split',           convidados: ['Rosemeire Munhoz','Moisés Achcar','Joyce Munhoz','Guilherme Lucena','Rebecca Munhoz','Alexsandro Virgilio','Barbara Cristine Carvalho','Claudemir Munhoz da Silva','Bernardo Munhoz','Maria Eduarda Munhoz','Davi Munhoz','Arthur Munhoz'] },
  { mesa: 18, mesaNome: 'Treze Tílias',    convidados: ['Barbara Munhoz','Guilherme Pereira','Marli Munhoz','Cicero Antônio Gonçalves','Rafael Gonçalves','Julia Munhoz','Manuela Munhoz','Silvana Munhoz','Marco Antonio Pacheco'] },
  { mesa: 19, mesaNome: 'Zurique',         convidados: ['Alice Almeida','Sandra Oliveira','Paulo Oliveira','Tania Fernandes','Guilherme Fernandes','Barbara Maruyama','Regina Pinheiro','Marcelo Pinheiro','Mariana Pinheiro','Igor Silva'] },
  { mesa: 20, mesaNome: 'Sucre',           convidados: ['Cristiano Rodrigues','Josie Anny Marcopito Rodrigues','Carlos Alberto Penci','Valeria Penci','Regina Ferreira de Carvalho','José Soares Malta','Fernanda Masaracchia','Alexandre Masaracchia','Manuela Masaracchia'] },
];

/** Normaliza string: remove acentos, lowercase, trim */
function norm(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** Busca local tolerante a acentos e maiúsculas */
function localSearch(query: string): GuestResult[] {
  const q = norm(query);
  if (!q) return [];
  const out: GuestResult[] = [];
  for (const t of STATIC_TABLES) {
    for (const name of t.convidados) {
      if (norm(name).includes(q)) {
        out.push({ id: `local-${t.mesa}-${name}`, nomeOriginal: name, mesa: t.mesa, mesaNome: t.mesaNome, grupo: t.mesaNome, nomeConvite: t.mesaNome });
      }
    }
  }
  return out;
}

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
        if (active) { setResults([]); setLoading(false); }
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/searchGuest?q=${encodeURIComponent(debounced)}`);
        const payload = await response.json();
        if (!active) return;

        if (response.ok && Array.isArray(payload?.results) && payload.results.length > 0) {
          setResults(payload.results);
        } else {
          // fallback: busca local com normalização de acentos
          setResults(localSearch(debounced));
        }
      } catch {
        if (active) setResults(localSearch(debounced));
      } finally {
        if (active) setLoading(false);
      }
    }

    void searchGuest();
    return () => { active = false; };
  }, [debounced]);

  const selected = useMemo(() => results[0] || null, [results]);

  const selectedMesaGuests = useMemo(() => {
    if (!selected || typeof selected.mesa !== 'number') return [];
    const table = STATIC_TABLES.find((t) => t.mesa === selected.mesa);
    return table ? [...table.convidados].sort((a, b) => a.localeCompare(b, 'pt-BR')) : [];
  }, [selected]);

  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4 sm:space-y-5">
        <header className="romantic-panel bg-[linear-gradient(180deg,rgba(253,251,247,0.98),rgba(250,246,240,0.92))] p-5 text-center sm:p-7">
          <p className="stationery-monogram">A&amp;N</p>
          <div className="stationery-rule" />
          <h1 className="mt-3 text-4xl text-cocoa sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Encontre Sua Mesa</h1>
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
            <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-gold/90">
              Você está na mesa {selected.mesaNome || selected.mesa}
            </p>

            {selectedMesaGuests.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-roseDeep/20 bg-white/70 p-4">
                <p className="text-sm font-semibold text-cocoa">Convidados nesta mesa</p>
                <p className="mt-0.5 text-xs text-cocoa/65">{selectedMesaGuests.length} pessoas alocadas</p>
                <div className="mt-2 grid gap-1.5 text-sm text-cocoa/85 sm:grid-cols-2">
                  {selectedMesaGuests.map((guest) => (
                    <p key={guest} className={norm(guest) === norm(selected.nomeOriginal) ? 'font-semibold text-gold' : ''}>
                      • {guest}
                    </p>
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
            {STATIC_TABLES.map((mesa) => (
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
          </div>
        </section>
      </div>
    </section>
  );
}
