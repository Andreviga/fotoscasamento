'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppTab } from '@/components/TabBar';
import PageHeader from '@/components/PageHeader';

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
  1: 'Amsterda',
  2: 'Campos do Jordao',
  3: 'Colonia',
  4: 'Copenhague',
  5: 'Patagonia',
  6: 'Estocolmo',
  7: 'Giethoorn',
  8: 'Kefalonia',
  9: 'Las Vegas',
  10: 'Madrid',
  11: 'Milao',
  12: 'Paris',
  13: 'Roma',
  14: 'Salar de Uyuni',
  15: 'Santorini',
  16: 'Sarajevo',
  17: 'Split',
  18: 'Treze Tilias',
  19: 'Zurique',
  20: 'Sucre'
};

const DEFAULT_POSITIONS: MesaPosition[] = [
  { n: 6, nome: 'Estocolmo', cx: 14.5, cy: 33.0, r: 4.2 },
  { n: 17, nome: 'Split', cx: 24.0, cy: 33.0, r: 5.2 },
  { n: 10, nome: 'Madrid', cx: 34.5, cy: 29.5, r: 4.2 },
  { n: 9, nome: 'Las Vegas', cx: 45.0, cy: 29.5, r: 4.2 },
  { n: 11, nome: 'Milao', cx: 68.0, cy: 30.5, r: 5.2 },
  { n: 12, nome: 'Paris', cx: 79.5, cy: 30.5, r: 4.2 },
  { n: 3, nome: 'Colonia', cx: 19.0, cy: 44.0, r: 4.2 },
  { n: 2, nome: 'Campos do Jordao', cx: 30.5, cy: 44.5, r: 4.8 },
  { n: 18, nome: 'Treze Tilias', cx: 39.5, cy: 44.5, r: 4.8 },
  { n: 4, nome: 'Copenhague', cx: 57.0, cy: 41.5, r: 4.2 },
  { n: 7, nome: 'Giethoorn', cx: 69.5, cy: 41.5, r: 4.2 },
  { n: 15, nome: 'Santorini', cx: 20.5, cy: 57.5, r: 5.5 },
  { n: 0, nome: 'Noivos', cx: 38.5, cy: 58.5, r: 5.5, isNoivos: true },
  { n: 8, nome: 'Kefalonia', cx: 55.0, cy: 54.0, r: 4.2 },
  { n: 20, nome: 'Sucre', cx: 64.5, cy: 56.5, r: 4.2 },
  { n: 19, nome: 'Zurique', cx: 75.0, cy: 56.5, r: 4.2 },
  { n: 16, nome: 'Sarajevo', cx: 20.5, cy: 70.5, r: 5.5 },
  { n: 14, nome: 'Salar de Uyuni', cx: 55.0, cy: 67.5, r: 4.8 },
  { n: 5, nome: 'Patagonia', cx: 64.5, cy: 67.5, r: 4.2 },
  { n: 13, nome: 'Roma', cx: 75.5, cy: 70.5, r: 4.2 },
  { n: 1, nome: 'Amsterda', cx: 20.5, cy: 83.0, r: 4.2 }
];

export default function TabMapa({ onNavigate, selectedTable, onSelectTable }: TabMapaProps) {
  const [positions, setPositions] = useState<MesaPosition[]>(DEFAULT_POSITIONS);
  const [localSelected, setLocalSelected] = useState<number | null>(selectedTable ?? null);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch('/api/getConfig?docs=mapa');
        const payload = await res.json();
        const saved = payload?.config?.mapa?.posicoesMesas;
        if (active && Array.isArray(saved) && saved.length > 0) {
          setPositions(saved as MesaPosition[]);
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

  function handleSelect(n: number) {
    const next = localSelected === n ? null : n;
    setLocalSelected(next);
    onSelectTable?.(next);
  }

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
              <div className="relative w-full" style={{ paddingBottom: `${(1 / 0.82) * 100}%` }}>
                <img
                  src="/MAPA_COMPLETO_DO_SALAO_COM_OS_NOMES.png"
                  alt="Layout do salao"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: 0.58 }}
                  draggable={false}
                />

                <svg
                  ref={svgRef}
                  viewBox="0 0 100 122"
                  className="absolute inset-0 w-full h-full"
                  style={{ touchAction: 'pan-x pan-y pinch-zoom' }}
                  preserveAspectRatio="xMidYMid meet"
                >
                  {positions.map((mesa) => {
                    const isHighlighted = localSelected === mesa.n;
                    const isNoivos = mesa.isNoivos;

                    const fill = isHighlighted
                      ? 'rgba(29,158,117,0.88)'
                      : isNoivos
                      ? 'rgba(196,164,100,0.35)'
                      : 'rgba(255,255,255,0.82)';

                    const stroke = isHighlighted
                      ? '#0F6E56'
                      : isNoivos
                      ? '#C4A464'
                      : 'rgba(47,62,50,0.45)';

                    const textFill = isHighlighted ? '#ffffff' : '#22352c';
                    const nomeLines = mesa.nome.split(' ');
                    const linha1 = nomeLines.slice(0, 2).join(' ');
                    const linha2 = nomeLines.length > 2 ? nomeLines.slice(2).join(' ') : null;

                    return (
                      <g
                        key={mesa.n}
                        onClick={() => mesa.n > 0 && handleSelect(mesa.n)}
                        style={{ cursor: mesa.n > 0 ? 'pointer' : 'default' }}
                      >
                        {isHighlighted && (
                          <circle
                            cx={mesa.cx}
                            cy={mesa.cy}
                            r={mesa.r + 2.5}
                            fill="none"
                            stroke="#1D9E75"
                            strokeWidth="0.5"
                            opacity="0.4"
                          />
                        )}
                        <circle
                          cx={mesa.cx}
                          cy={mesa.cy}
                          r={mesa.r}
                          fill={fill}
                          stroke={stroke}
                          strokeWidth={isHighlighted ? 0.7 : 0.4}
                        />
                        <text
                          x={mesa.cx}
                          y={linha2 ? mesa.cy - 1.1 : mesa.cy}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={mesa.r > 5 ? 2.1 : 1.75}
                          fontWeight="600"
                          fill={textFill}
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
                            fill={textFill}
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
                            fill={isHighlighted ? '#0F6E56' : 'rgba(34,53,44,0.6)'}
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
      </div>
    </section>
  );
}
