'use client';

import { useEffect, useRef, useState } from 'react';
import type { AppTab } from '@/components/TabBar';
import PageHeader from '@/components/PageHeader';
import { getMapIcon, getMapType, MAP_LEGEND_ITEMS } from '../../../lib/mapIcons';

type TabMapaProps = {
  onNavigate: (tab: AppTab) => void;
  selectedTable?: number | null;
  onSelectTable?: (n: number | null) => void;
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
  20: 'Sucre',
};

// Short display names for SVG (max ~11 chars fits inside label area)
const TABLE_SHORT: Record<number, string[]> = {
  1:  ['Amsterdã'],
  2:  ['Campos do', 'Jordão'],
  3:  ['Colônia'],
  4:  ['Copen-', 'hague'],
  5:  ['Patagônia'],
  6:  ['Estocolmo'],
  7:  ['Giethoorn'],
  8:  ['Kefalonia'],
  9:  ['Las Vegas'],
  10: ['Madrid'],
  11: ['Milão'],
  12: ['Paris'],
  13: ['Roma'],
  14: ['Salar de', 'Uyuni'],
  15: ['Santorini'],
  16: ['Sarajevo'],
  17: ['Split'],
  18: ['Treze', 'Tílias'],
  19: ['Zurique'],
  20: ['Sucre'],
};

// viewBox="0 0 520 750" — cx/cy in SVG units
const TABLE_POSITIONS = [
  { n: 1,  cx: 60,  cy: 130 },
  { n: 2,  cx: 165, cy: 130 },
  { n: 3,  cx: 355, cy: 130 },
  { n: 4,  cx: 460, cy: 130 },
  { n: 5,  cx: 60,  cy: 225 },
  { n: 6,  cx: 165, cy: 225 },
  { n: 7,  cx: 355, cy: 225 },
  { n: 8,  cx: 460, cy: 225 },
  { n: 9,  cx: 60,  cy: 315 },
  { n: 10, cx: 165, cy: 315 },
  { n: 11, cx: 355, cy: 315 },
  { n: 12, cx: 460, cy: 315 },
  { n: 13, cx: 60,  cy: 415 },
  { n: 14, cx: 460, cy: 415 },
  { n: 15, cx: 60,  cy: 520 },
  { n: 16, cx: 460, cy: 520 },
  { n: 17, cx: 155, cy: 640 },
  { n: 18, cx: 225, cy: 640 },
  { n: 19, cx: 295, cy: 640 },
  { n: 20, cx: 365, cy: 640 },
];

const MAP_POINTS = [
  { id: 'point-bar', label: 'Bar', x: 68, y: 66, type: 'bar' },
  { id: 'point-noivos', label: 'Cerimônia', x: 260, y: 66, type: 'cerimonia' },
  { id: 'point-buffet', label: 'Buffet', x: 452, y: 66, type: 'buffet' },
  { id: 'point-pista', label: 'Pista', x: 260, y: 500, type: 'pista' },
  { id: 'point-fotos', label: 'Fotos', x: 410, y: 548, type: 'fotos' },
  { id: 'point-banheiros-e', label: 'Banheiros', x: 62, y: 650, type: 'banheiro' },
  { id: 'point-banheiros-d', label: 'Banheiros', x: 458, y: 650, type: 'banheiro' },
  { id: 'point-estacionamento', label: 'Estacionamento', x: 138, y: 722, type: 'estacionamento' },
  { id: 'point-entrada', label: 'Entrada', x: 260, y: 722, type: 'entrada' }
];

const VENUE_ADDRESS = 'R. das Araribás, 25 - Bairro dos Casa, São Bernardo do Campo - SP, 09840-210';
const VENUE_NAME = 'Espaço Vdara — Sítio São Jorge';
const GMAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Espa%C3%A7o+Vdara+S%C3%ADtio+S%C3%A3o+Jorge+S%C3%A3o+Bernardo+do+Campo';
const WAZE_URL = 'https://waze.com/ul?q=Espa%C3%A7o+Vdara+S%C3%A3o+Bernardo+do+Campo';

function copyAddress() {
  if (typeof navigator !== 'undefined') {
    void navigator.clipboard.writeText(`${VENUE_NAME} — ${VENUE_ADDRESS}`);
  }
}

export default function TabMapa({ onNavigate, selectedTable, onSelectTable }: TabMapaProps) {
  const [localSelected, setLocalSelected] = useState<number | null>(selectedTable ?? null);
  const [copied, setCopied] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Sync external selectedTable (from mesa search)
  useEffect(() => {
    if (typeof selectedTable === 'number') {
      setLocalSelected(selectedTable);
    }
  }, [selectedTable]);

  // Scroll map to selected table
  useEffect(() => {
    if (!localSelected || !mapRef.current) return;
    const t = TABLE_POSITIONS.find((p) => p.n === localSelected);
    if (!t) return;
    const svgH = 750;
    const containerH = mapRef.current.offsetHeight;
    const scale = mapRef.current.offsetWidth / 520;
    const targetY = t.cy * scale - containerH / 2;
    mapRef.current.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  }, [localSelected]);

  function handleSelectTable(n: number) {
    const next = localSelected === n ? null : n;
    setLocalSelected(next);
    onSelectTable?.(next);
  }

  function handleCopy() {
    copyAddress();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeTable = localSelected;

  return (
    <section className="main" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-5">

        {/* Header */}
        <PageHeader title="Mapa do espaço" subtitle="Planta do salão · Espaço Vdara" />

        {/* Table selector */}
        <div className="romantic-panel p-4">
          <label htmlFor="table-select" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-roseDeep/70">
            Selecionar mesa
          </label>
          <div className="flex gap-2">
            <select
              id="table-select"
              className="input-elegant flex-1 py-2 text-sm"
              value={activeTable ?? ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                setLocalSelected(val);
                onSelectTable?.(val);
              }}
            >
              <option value="">— Escolha uma mesa —</option>
              {TABLE_POSITIONS.map((t) => (
                <option key={t.n} value={t.n}>
                  Mesa {t.n} · {TABLE_NAMES[t.n]}
                </option>
              ))}
            </select>
            {activeTable ? (
              <button
                type="button"
                aria-label="Limpar seleção"
                className="rounded-full border border-roseDeep/30 bg-white/60 px-3 text-sm text-roseDeep/70 transition hover:bg-white"
                onClick={() => { setLocalSelected(null); onSelectTable?.(null); }}
              >
                ✕
              </button>
            ) : null}
          </div>

          {activeTable ? (
            <p className="mt-2 text-center text-sm font-semibold text-gold">
              Mesa {activeTable} — {TABLE_NAMES[activeTable]}
            </p>
          ) : null}
        </div>

        {/* Floor Map SVG */}
        <div
          className="romantic-panel overflow-hidden"
          style={{ background: 'linear-gradient(180deg,#fdfbf7,#faf6f0)' }}
        >
          <div className="border-b border-roseDeep/10 px-4 py-2.5 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.14em] text-roseDeep/60">Planta esquemática do salão</p>
            {activeTable && (
              <button
                type="button"
                className="text-xs font-semibold text-wine"
                onClick={() => onNavigate('mesa')}
              >
                ← Voltar para busca
              </button>
            )}
          </div>

          <div
            ref={mapRef}
            className="overflow-y-auto overflow-x-hidden"
            style={{ maxHeight: 'calc(100dvh - 22rem)', WebkitOverflowScrolling: 'touch' }}
          >
            <div className="relative">
              <svg
                viewBox="0 0 520 750"
                width="100%"
                aria-label="Mapa esquemático do salão"
                role="img"
                style={{ display: 'block', minWidth: 280 }}
              >
              {/* Room outline */}
              <rect x="4" y="4" width="512" height="742" rx="14"
                fill="#fdfbf7" stroke="rgba(196,164,100,0.45)" strokeWidth="1.5" />

              {/* Vertical center divider line (decorative) */}
              <line x1="260" y1="95" x2="260" y2="395" stroke="rgba(196,164,100,0.15)" strokeWidth="1" strokeDasharray="4 4" />

              {/* === ZONE FILLS === */}
              {/* Bar */}
              <rect x="8" y="8" width="120" height="82" rx="8"
                fill="rgba(196,164,100,0.10)" stroke="rgba(196,164,100,0.30)" strokeWidth="1" />
              <text x="68" y="38" textAnchor="middle" fontSize="9" fontWeight="600"
                fill="rgba(196,164,100,0.85)" fontFamily="DM Sans,sans-serif" letterSpacing="1.5">BAR</text>
              <text x="68" y="53" textAnchor="middle" fontSize="7.5"
                fill="rgba(74,74,74,0.6)" fontFamily="DM Sans,sans-serif">Drinks &amp; Caipirinhas</text>

              {/* Mesa dos Noivos */}
              <rect x="178" y="8" width="164" height="82" rx="10"
                fill="rgba(47,62,50,0.08)" stroke="rgba(47,62,50,0.25)" strokeWidth="1.2" />
              <text x="260" y="36" textAnchor="middle" fontSize="8" fontWeight="700"
                fill="rgba(47,62,50,0.75)" fontFamily="DM Sans,sans-serif" letterSpacing="1.5">MESA DOS NOIVOS</text>
              <text x="260" y="70" textAnchor="middle" fontSize="7.5"
                fill="rgba(47,62,50,0.5)" fontFamily="DM Sans,sans-serif">André &amp; Nathália</text>

              {/* Buffet */}
              <rect x="392" y="8" width="120" height="82" rx="8"
                fill="rgba(196,164,100,0.10)" stroke="rgba(196,164,100,0.30)" strokeWidth="1" />
              <text x="452" y="38" textAnchor="middle" fontSize="9" fontWeight="600"
                fill="rgba(196,164,100,0.85)" fontFamily="DM Sans,sans-serif" letterSpacing="1.5">BUFFET</text>
              <text x="452" y="53" textAnchor="middle" fontSize="7.5"
                fill="rgba(74,74,74,0.6)" fontFamily="DM Sans,sans-serif">Jantar</text>

              {/* Pista de dança */}
              <rect x="128" y="415" width="264" height="155" rx="20"
                fill="rgba(196,164,100,0.08)" stroke="rgba(196,164,100,0.35)" strokeWidth="1.5"
                strokeDasharray="5 3" />
              <text x="260" y="480" textAnchor="middle" fontSize="9" fontWeight="600"
                fill="rgba(196,164,100,0.80)" fontFamily="DM Sans,sans-serif" letterSpacing="2">PISTA DE DANÇA</text>

              {/* Banheiros */}
              <rect x="8" y="598" width="108" height="88" rx="8"
                fill="rgba(47,62,50,0.05)" stroke="rgba(47,62,50,0.18)" strokeWidth="1" />
              <text x="62" y="630" textAnchor="middle" fontSize="8" fontWeight="600"
                fill="rgba(47,62,50,0.55)" fontFamily="DM Sans,sans-serif" letterSpacing="1">BANHEIROS</text>

              <rect x="404" y="598" width="108" height="88" rx="8"
                fill="rgba(47,62,50,0.05)" stroke="rgba(47,62,50,0.18)" strokeWidth="1" />
              <text x="458" y="630" textAnchor="middle" fontSize="8" fontWeight="600"
                fill="rgba(47,62,50,0.55)" fontFamily="DM Sans,sans-serif" letterSpacing="1">BANHEIROS</text>

              {/* Entrada */}
              <rect x="168" y="700" width="184" height="38" rx="8"
                fill="rgba(196,164,100,0.15)" stroke="rgba(196,164,100,0.45)" strokeWidth="1.2" />
              <text x="260" y="720" textAnchor="middle" fontSize="9" fontWeight="700"
                fill="rgba(47,62,50,0.75)" fontFamily="DM Sans,sans-serif" letterSpacing="2">↑ ENTRADA</text>
              <text x="260" y="733" textAnchor="middle" fontSize="7"
                fill="rgba(74,74,74,0.55)" fontFamily="DM Sans,sans-serif">Convidados</text>

              {/* === TABLES === */}
              {TABLE_POSITIONS.map((t) => {
                const isSelected = activeTable === t.n;
                const lines = TABLE_SHORT[t.n] ?? [TABLE_NAMES[t.n] ?? ''];
                const R = 26;
                const textStartY = t.cy + R + 11;

                return (
                  <g
                    key={t.n}
                    onClick={() => handleSelectTable(t.n)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-label={`Mesa ${t.n} — ${TABLE_NAMES[t.n]}`}
                    aria-pressed={isSelected}
                  >
                    {/* Pulse ring (selected) */}
                    {isSelected && (
                      <circle
                        cx={t.cx} cy={t.cy} r={R + 10}
                        fill="none"
                        stroke="#C4A464"
                        strokeWidth="2"
                        opacity="0.5"
                        className="animate-ping"
                        style={{ transformOrigin: `${t.cx}px ${t.cy}px` }}
                      />
                    )}

                    {/* Shadow for selected */}
                    {isSelected && (
                      <circle cx={t.cx + 1} cy={t.cy + 2} r={R}
                        fill="rgba(47,62,50,0.18)" />
                    )}

                    {/* Table circle */}
                    <circle
                      cx={t.cx} cy={t.cy} r={R}
                      fill={isSelected ? '#2F3E32' : '#FDFBF7'}
                      stroke={isSelected ? '#C4A464' : 'rgba(196,164,100,0.55)'}
                      strokeWidth={isSelected ? 2 : 1.5}
                    />

                    {/* Table number */}
                    <text
                      x={t.cx} y={t.cy + 5}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="700"
                      fill={isSelected ? '#C4A464' : '#2F3E32'}
                      fontFamily="Cormorant Garamond, Georgia, serif"
                    >
                      {t.n}
                    </text>

                    {/* Table name below circle (1 or 2 lines) */}
                    {lines.length === 1 ? (
                      <text
                        x={t.cx} y={textStartY}
                        textAnchor="middle"
                        fontSize="7"
                        fill={isSelected ? '#C4A464' : 'rgba(47,62,50,0.65)'}
                        fontFamily="DM Sans, sans-serif"
                      >
                        {lines[0]}
                      </text>
                    ) : (
                      <text
                        x={t.cx} y={textStartY}
                        textAnchor="middle"
                        fontSize="7"
                        fill={isSelected ? '#C4A464' : 'rgba(47,62,50,0.65)'}
                        fontFamily="DM Sans, sans-serif"
                      >
                        <tspan x={t.cx} dy="0">{lines[0]}</tspan>
                        <tspan x={t.cx} dy="9">{lines[1]}</tspan>
                      </text>
                    )}
                  </g>
                );
              })}
              </svg>

              <div className="pointer-events-none absolute inset-0">
                {MAP_POINTS.map((point) => {
                  const mapItem = { type: point.type, title: point.label, label: point.label, id: point.id };
                  const Icon = getMapIcon(mapItem);
                  const markerType = getMapType(mapItem);

                  return (
                    <div
                      key={point.id}
                      className={`map-marker map-marker--${markerType} absolute`}
                      style={{
                        left: `${(point.x / 520) * 100}%`,
                        top: `${(point.y / 750) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Icon className="map-marker-icon" strokeWidth={1.8} />
                      <span>{point.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="border-t border-roseDeep/10 px-4 py-2.5">
            <p className="mb-1.5 text-[10px] uppercase tracking-[0.12em] text-roseDeep/50">Legenda</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {MAP_LEGEND_ITEMS.map((item) => {
                const mapItem = { type: item.type, label: item.label };
                const Icon = getMapIcon(mapItem);
                const markerType = getMapType(mapItem);

                return (
                  <span key={item.type} className={`map-marker map-marker--${markerType} map-marker--legend`}>
                    <Icon className="map-marker-icon" strokeWidth={1.8} />
                    {item.label}
                  </span>
                );
              })}
              <span className="map-marker map-marker--mesa map-marker--legend border-wine/35 bg-wine/10 text-wine">
                Sua mesa
              </span>
              
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="romantic-panel overflow-hidden">
          <div className="bg-[rgba(47,62,50,0.04)] px-5 py-4 border-b border-roseDeep/10">
            <p className="text-xs uppercase tracking-[0.18em] text-roseDeep/60">Como chegar</p>
            <h2 className="mt-1 text-2xl text-cocoa">Espaço Vdara</h2>
            <p className="mt-0.5 text-sm text-roseDeep/75">Sítio São Jorge · São Bernardo do Campo</p>
          </div>

          <div className="p-5 space-y-4">
            {/* Address card */}
            <div className="rounded-2xl border border-roseDeep/15 bg-white/60 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-roseDeep/55 mb-1">Endereço</p>
              <p className="text-sm font-medium text-cocoa">{VENUE_ADDRESS}</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <a
                href={GMAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir rota no Google Maps"
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-roseDeep/20 bg-white/70 py-4 text-xs font-semibold text-cocoa transition hover:border-gold/50 hover:bg-white active:scale-95"
              >
                <span className="text-2xl">🗺</span>
                Google Maps
              </a>
              <a
                href={WAZE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir rota no Waze"
                className="flex flex-col items-center gap-1.5 rounded-2xl border border-roseDeep/20 bg-white/70 py-4 text-xs font-semibold text-cocoa transition hover:border-gold/50 hover:bg-white active:scale-95"
              >
                <span className="text-2xl">🚗</span>
                Waze
              </a>
              <button
                type="button"
                aria-label="Copiar endereço"
                onClick={handleCopy}
                className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-roseDeep/20 bg-white/70 py-3 text-xs font-semibold text-cocoa transition hover:border-gold/50 hover:bg-white active:scale-95 sm:col-span-1 sm:flex-col sm:py-4"
              >
                <span className="text-xl">{copied ? '✅' : '📋'}</span>
                {copied ? 'Copiado!' : 'Copiar endereço'}
              </button>
            </div>

            {/* Notes */}
            <div className="space-y-2.5">
              {[
                { icon: '📍', text: 'Procure por "Espaço Vdara" ou "Sítio São Jorge". Confirme que a rota está levando para o Vdara, pois o local possui diferentes espaços.' },
                { icon: '⏰', text: 'Chegue com antecedência para estacionar com tranquilidade. A cerimônia inicia pontualmente às 18h.' },
                { icon: '🎟', text: 'Mostre o convite na entrada, se solicitado.' },
                { icon: '💬', text: 'Em caso de dúvida, procure a equipe de assessoria na recepção.' },
              ].map((note) => (
                <div key={note.icon} className="flex items-start gap-2.5 rounded-2xl border border-roseDeep/10 bg-white/50 px-3.5 py-3">
                  <span className="mt-0.5 shrink-0 text-base">{note.icon}</span>
                  <p className="text-xs leading-relaxed text-cocoa/75">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Google Maps embed */}
            <div className="overflow-hidden rounded-2xl border border-roseDeep/20" style={{ height: 220 }}>
              <iframe
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Espaço Vdara"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.7!2d-46.5506!3d-23.7132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce4281c11d1f8b%3A0x123456789!2sR.%20das%20Ararib%C3%A1s%2C%2025%20-%20Bairro%20dos%20Casa%2C%20S%C3%A3o%20Bernardo%20do%20Campo!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
