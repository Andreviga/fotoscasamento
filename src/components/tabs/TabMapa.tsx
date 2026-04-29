'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppTab } from '@/components/TabBar';
import PageHeader from '@/components/PageHeader';
import {
  MAPA_ASPECT_RATIO,
  MAPA_CROP_DEFAULT,
  MAPA_CROP_VERSION,
  getMapaMediaFrameStyle,
  normalizeMapaCrop
} from '../../../lib/mapaConfig';

type TabMapaProps = {
  onNavigate: (tab: AppTab) => void;
  selectedTable?: number | null;
  onSelectTable?: (n: number | null) => void;
};

type MesaPosition = {
  n: number;
  nome: string;
  cx: number;
  cy: number;
  r: number;
  isNoivos?: boolean;
};

const TABLE_NAMES: Record<number, string> = {
  1: 'Amsterdã',
  2: 'Campos do Jordão',
  3: 'Colônia',
  4: 'Copenhague',
  5: 'Patagônia',
  6: 'Estocolmo',
  7: 'Giethoorn',
  8: 'Kefalonia',
  9: 'Las Vegas',
  10: 'Madrid',
  11: 'Milão',
  12: 'Paris',
  13: 'Roma',
  14: 'Salar de Uyuni',
  15: 'Santorini',
  16: 'Sarajevo',
  17: 'Split',
  18: 'Treze Tílias',
  19: 'Zurique',
  20: 'Sucre'
};

const DEFAULT_POSITIONS: MesaPosition[] = [
  { n: 6, nome: 'Estocolmo', cx: 14.5, cy: 33.0, r: 4.2 },
  { n: 17, nome: 'Split', cx: 24.0, cy: 33.0, r: 5.2 },
  { n: 10, nome: 'Madrid', cx: 34.5, cy: 29.5, r: 4.2 },
  { n: 9, nome: 'Las Vegas', cx: 45.0, cy: 29.5, r: 4.2 },
  { n: 11, nome: 'Milão', cx: 68.0, cy: 30.5, r: 5.2 },
  { n: 12, nome: 'Paris', cx: 79.5, cy: 30.5, r: 4.2 },
  { n: 3, nome: 'Colônia', cx: 19.0, cy: 44.0, r: 4.2 },
  { n: 2, nome: 'Campos do Jordão', cx: 30.5, cy: 44.5, r: 4.8 },
  { n: 18, nome: 'Treze Tílias', cx: 39.5, cy: 44.5, r: 4.8 },
  { n: 4, nome: 'Copenhague', cx: 57.0, cy: 41.5, r: 4.2 },
  { n: 7, nome: 'Giethoorn', cx: 69.5, cy: 41.5, r: 4.2 },
  { n: 15, nome: 'Santorini', cx: 20.5, cy: 57.5, r: 5.5 },
  { n: 0, nome: 'Noivos', cx: 38.5, cy: 58.5, r: 5.5, isNoivos: true },
  { n: 8, nome: 'Kefalonia', cx: 55.0, cy: 54.0, r: 4.2 },
  { n: 20, nome: 'Sucre', cx: 64.5, cy: 56.5, r: 4.2 },
  { n: 19, nome: 'Zurique', cx: 75.0, cy: 56.5, r: 4.2 },
  { n: 16, nome: 'Sarajevo', cx: 20.5, cy: 70.5, r: 5.5 },
  { n: 14, nome: 'Salar de Uyuni', cx: 55.0, cy: 67.5, r: 4.8 },
  { n: 5, nome: 'Patagônia', cx: 64.5, cy: 67.5, r: 4.2 },
  { n: 13, nome: 'Roma', cx: 75.5, cy: 70.5, r: 4.2 },
  { n: 1, nome: 'Amsterdã', cx: 20.5, cy: 83.0, r: 4.2 }
];

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function TabMapa({ onNavigate, selectedTable, onSelectTable }: TabMapaProps) {
  const [positions, setPositions] = useState<MesaPosition[]>(DEFAULT_POSITIONS);
  const [crop, setCrop] = useState(MAPA_CROP_DEFAULT);
  const [localSelected, setLocalSelected] = useState<number | null>(selectedTable ?? null);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; nomeOriginal: string; mesa: number | null }>>([]);
  const [searchError, setSearchError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch('/api/getConfig?docs=mapa');
        const payload = await res.json();
        const saved = payload?.config?.mapa?.posicoesMesas;
        const savedCrop = payload?.config?.mapa?.crop;
        const savedCropVersion = payload?.config?.mapa?.cropVersion;
        if (active && Array.isArray(saved) && saved.length > 0) {
          setPositions(saved as MesaPosition[]);
        }
        if (active) {
          const effectiveCrop = savedCropVersion === MAPA_CROP_VERSION ? savedCrop : MAPA_CROP_DEFAULT;
          setCrop(normalizeMapaCrop(effectiveCrop));
        }
      } catch {
        // Mantem defaults
      } finally {
        if (active) setLoadingPositions(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof selectedTable === 'number') {
      setLocalSelected(selectedTable);
    }
  }, [selectedTable]);

  useEffect(() => {
    const saved = sessionStorage.getItem('mapa-destaque');
    if (saved) {
      setLocalSelected(Number(saved));
      sessionStorage.removeItem('mapa-destaque');
    }
  }, []);

  useEffect(() => {
    if (!localSelected || !svgRef.current) return;
    const mesa = positions.find((m) => m.n === localSelected);
    if (!mesa) return;
    const container = svgRef.current.parentElement;
    if (!container) return;
    const containerH = container.clientHeight;
    const svgH = svgRef.current.clientHeight;
    const targetY = (mesa.cy / 122) * svgH - containerH / 2;
    container.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  }, [localSelected, positions]);

  useEffect(() => {
    let active = true;

    async function runSearch() {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        setSearchError('');
        return;
      }

      setSearchLoading(true);
      setSearchError('');
      try {
        const response = await fetch(`/api/searchGuest?q=${encodeURIComponent(debouncedSearch)}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || 'Falha na busca');
        }
        if (active) {
          setSearchResults(payload.results || []);
        }
      } catch (requestError) {
        if (active) {
          setSearchResults([]);
          setSearchError(requestError instanceof Error ? requestError.message : 'Falha na busca');
        }
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    }

    runSearch();
    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  function handleSelect(n: number) {
    const next = localSelected === n ? null : n;
    setLocalSelected(next);
    onSelectTable?.(next);
  }

  function highlightGuestTable(mesa: number) {
    setLocalSelected(mesa);
    onSelectTable?.(mesa);
    svgRef.current?.parentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const mediaFrameStyle = useMemo(() => getMapaMediaFrameStyle(crop), [crop]);
  const selectedGuest = searchResults[0] || null;
  const emptySearchMessage = useMemo(() => {
    if (!debouncedSearch.trim() || searchLoading) return '';
    if (searchResults.length > 0) return '';
    return 'Nao encontramos esse nome. Verifique a grafia ou busque pelo nome do convite.';
  }, [debouncedSearch, searchLoading, searchResults.length]);

  return (
    <section className="main" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4">
        <PageHeader title="Mapa do espaco" subtitle="Toque em uma mesa para detalhes" />

        <div className="romantic-panel p-4">
          <label className="form-label text-sm mb-2 block">Selecionar mesa</label>
          <div className="flex gap-2">
            <select
              className="input-elegant flex-1 text-sm py-2"
              value={localSelected ?? ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                setLocalSelected(val);
                onSelectTable?.(val);
              }}
            >
              <option value="">- Escolha uma mesa -</option>
              {positions.filter((m) => m.n > 0 && !m.isNoivos).map((m) => (
                <option key={m.n} value={m.n}>Mesa {m.n} - {m.nome}</option>
              ))}
            </select>
            {localSelected && (
              <button
                type="button"
                className="rounded-full border border-roseDeep/30 bg-white/60 px-3 text-sm text-roseDeep/70"
                onClick={() => {
                  setLocalSelected(null);
                  onSelectTable?.(null);
                }}
              >x</button>
            )}
          </div>
          {localSelected && localSelected > 0 && (
            <p className="mt-2 text-sm font-semibold text-gold">
              Mesa {localSelected} - {TABLE_NAMES[localSelected]}
            </p>
          )}
        </div>

        <div className="romantic-panel overflow-hidden">
          <div className="border-b border-roseDeep/10 px-4 py-2.5 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-roseDeep/60">Layout do salao</p>
            {localSelected && (
              <button type="button" className="text-xs font-semibold text-wine" onClick={() => onNavigate('mesa')}>
                &lt;- Voltar a busca
              </button>
            )}
          </div>

          <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100dvh - 22rem)', WebkitOverflowScrolling: 'touch' }}>
            {loadingPositions ? (
              <div className="flex justify-center items-center py-16">
                <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-gold" />
              </div>
            ) : (
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: String(MAPA_ASPECT_RATIO) }}>
                <img
                  src="/MAPA_COMPLETO_DO_SALAO_COM_OS_NOMES.png"
                  alt="Layout do salao"
                  className="absolute block"
                  style={{ ...mediaFrameStyle, opacity: 1 }}
                  draggable={false}
                />

                <svg
                  ref={svgRef}
                  viewBox="0 0 100 122"
                  className="absolute"
                  style={{ ...mediaFrameStyle, touchAction: 'pan-x pan-y pinch-zoom' }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Renderiza APENAS a mesa selecionada em cor verde quando encontrada */}
                  {localSelected && positions
                    .filter((mesa) => mesa.n === localSelected)
                    .map((mesa) => {
                      const isHighlighted = true;
                      const isNoivos = mesa.isNoivos;
                      const nomeLines = mesa.nome.split(' ');
                      const linha1 = nomeLines.slice(0, 2).join(' ');
                      const linha2 = nomeLines.length > 2 ? nomeLines.slice(2).join(' ') : null;

                      return (
                        <g
                          key={mesa.n}
                          style={{ cursor: 'default' }}
                        >
                          <circle
                            cx={mesa.cx}
                            cy={mesa.cy}
                            r={mesa.r + 2.5}
                            fill="none"
                            stroke="#1D9E75"
                            strokeWidth="0.5"
                            opacity="0.4"
                          />
                          <circle
                            cx={mesa.cx}
                            cy={mesa.cy}
                            r={mesa.r}
                            fill="rgba(29,158,117,0.88)"
                            stroke="#0F6E56"
                            strokeWidth="0.7"
                          />
                          <text
                            x={mesa.cx}
                            y={linha2 ? mesa.cy - 1.1 : mesa.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={mesa.r > 5 ? 2.1 : 1.75}
                            fontWeight="600"
                            fill="#ffffff"
                            fontFamily="DM Sans, sans-serif"
                            style={{ pointerEvents: 'none' }}
                          >
                            {linha1}
                          </text>
                          {linha2 && (
                            <text
                              x={mesa.cx}
                              y={mesa.cy + 1.5}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize={1.55}
                              fontWeight="600"
                              fill="#ffffff"
                              fontFamily="DM Sans, sans-serif"
                              style={{ pointerEvents: 'none' }}
                            >
                              {linha2}
                            </text>
                          )}
                          {mesa.n > 0 && (
                            <text
                              x={mesa.cx}
                              y={mesa.cy + mesa.r + 1.8}
                              textAnchor="middle"
                              fontSize={1.35}
                              fill="#0F6E56"
                              fontFamily="DM Sans, sans-serif"
                              style={{ pointerEvents: 'none' }}
                            >
                              Mesa {mesa.n}
                            </text>
                          )}
                        </g>
                      );
                    })}
                </svg>
              </div>
            )}
          </div>

          <div className="border-t border-roseDeep/10 px-4 py-2.5">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-wine/65">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-white border border-wine/30" />
                Convidados
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: 'rgba(196,164,100,0.35)', border: '1px solid #C4A464' }} />
                Noivos
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full bg-[#1D9E75]" />
                Sua mesa
              </span>
            </div>
          </div>
        </div>

        {localSelected && localSelected > 0 && !loadingPositions && (
          <div className="romantic-panel p-4 space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/60">Mesa selecionada</p>
            <p className="text-2xl text-cocoa">
              {TABLE_NAMES[localSelected]} - Mesa {localSelected}
            </p>
            <button
              type="button"
              className="btn btn--outline text-sm"
              onClick={() => onNavigate('mesa')}
            >
              Buscar convidados desta mesa
            </button>
          </div>
        )}

        <section className="romantic-panel p-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/60">Encontrar minha mesa</p>
            <h3 className="mt-1 text-xl text-cocoa">Busque seu nome sem sair do mapa</h3>
            <p className="mt-1 text-sm text-wine/75">Digite seu nome para localizar sua mesa e destacar no mapa acima.</p>
          </div>

          <div>
            <label className="form-label text-sm" htmlFor="tab-mapa-mesa-search">Nome do convidado</label>
            <input
              id="tab-mapa-mesa-search"
              className="input-elegant mt-2 text-base"
              placeholder="Ex: Maria Silva"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoComplete="off"
              inputMode="search"
            />
            <p className="mt-2 text-xs text-wine/65">Busca inteligente por nome do convidado ou nome do convite.</p>
          </div>

          <div className="space-y-3">
            {searchLoading ? (
              <div className="flex items-center gap-2 text-sm text-wine/70">
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gold" />
                Buscando convidado...
              </div>
            ) : null}

            {searchError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{searchError}</div>
            ) : null}

            {selectedGuest ? (
              <article className="rounded-2xl border border-gold/35 bg-[#fffaf1] p-4">
                <p className="text-lg text-cocoa">Ola, {selectedGuest.nomeOriginal}!</p>
                {typeof selectedGuest.mesa === 'number' ? (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-wine/75">Voce esta na <strong>Mesa {selectedGuest.mesa}</strong>.</p>
                    <button
                      type="button"
                      className="btn btn--primary text-sm"
                      onClick={() => highlightGuestTable(selectedGuest.mesa as number)}
                    >
                      Destacar essa mesa no mapa
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-wine/80">Sua mesa ainda nao foi definida. Procure a recepcao ao chegar.</p>
                )}
              </article>
            ) : null}

            {emptySearchMessage ? (
              <div className="rounded-2xl border border-roseDeep/15 bg-white/80 p-3 text-sm text-wine/80">{emptySearchMessage}</div>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}
