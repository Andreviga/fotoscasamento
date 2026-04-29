import Head from 'next/head';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MESA_POSITIONS_DEFAULT,
  MAPA_ASPECT_RATIO,
  MAPA_CROP_DEFAULT,
  MAPA_CROP_VERSION,
  getMapaMediaFrameStyle,
  normalizeMapaCrop
} from '../lib/mapaConfig';

const TABLE_NAMES = {
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

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default function MapaPage({ embedded = false }) {
  const router = useRouter();
  const isAdminQuery = router.query.admin === 'true';
  const isEmbedded = embedded;
  const [adminEnabled, setAdminEnabled] = useState(false);
  const [positions, setPositions] = useState(MESA_POSITIONS_DEFAULT);
  const [defaultPositions, setDefaultPositions] = useState(MESA_POSITIONS_DEFAULT);
  const [selectedN, setSelectedN] = useState(null);
  const [highlightedN, setHighlightedN] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(null);
  const [crop, setCrop] = useState(MAPA_CROP_DEFAULT);
  const [search, setSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const imgRef = useRef(null);
  const svgRef = useRef(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('adminToken');
    setAdminEnabled(isAdminQuery && Boolean(token));
  }, [isAdminQuery]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/getConfig?docs=mapa');
        const payload = await res.json();
        const saved = payload?.config?.mapa?.posicoesMesas;
        const savedCrop = payload?.config?.mapa?.crop;
        const savedCropVersion = payload?.config?.mapa?.cropVersion;
        if (Array.isArray(saved) && saved.length > 0) {
          setPositions(saved);
          setDefaultPositions(saved);
        }
        const effectiveCrop = savedCropVersion === MAPA_CROP_VERSION ? savedCrop : MAPA_CROP_DEFAULT;
        setCrop(normalizeMapaCrop(effectiveCrop));
      } catch {
        // Usa defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const d = String(router.query.destaque || '');
    if (d.startsWith('mesa-')) {
      const n = Number(d.replace('mesa-', ''));
      if (n) {
        setHighlightedN(n);
        setSelectedN(n);
      }
    }
  }, [router.query.destaque]);

  useEffect(() => {
    const saved = sessionStorage.getItem('mapa-destaque');
    if (saved) {
      const n = Number(saved);
      if (n) {
        setSelectedN(n);
        setHighlightedN(n);
      }
      sessionStorage.removeItem('mapa-destaque');
    }
  }, []);

  useEffect(() => {
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
        setSearchResults(payload.results || []);
      } catch (requestError) {
        setSearchResults([]);
        setSearchError(requestError.message);
      } finally {
        setSearchLoading(false);
      }
    }

    runSearch();
  }, [debouncedSearch]);

  const getRelativePos = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100
    };
  }, []);

  const onPointerDown = useCallback((e, mesa) => {
    if (!adminEnabled) return;
    e.preventDefault();
    const pos = getRelativePos(e);
    setDragging({ n: mesa.n, startX: pos.x, startY: pos.y, origCx: mesa.cx, origCy: mesa.cy });
    setSelectedN(mesa.n);
  }, [adminEnabled, getRelativePos]);

  useEffect(() => {
    if (!adminEnabled) return undefined;
    const onMove = (e) => {
      if (!dragging) return;
      const pos = getRelativePos(e);
      const dx = pos.x - dragging.startX;
      const dy = pos.y - dragging.startY;
      setPositions((prev) => prev.map((m) => (
        m.n === dragging.n
          ? {
              ...m,
              cx: Math.max(2, Math.min(98, dragging.origCx + dx)),
              cy: Math.max(2, Math.min(98, dragging.origCy + dy))
            }
          : m
      )));
    };
    const onUp = () => setDragging(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [adminEnabled, dragging, getRelativePos]);

  async function savePositions() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage('Sem token admin.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ docId: 'mapa', data: { posicoesMesas: positions, crop, cropVersion: MAPA_CROP_VERSION } })
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || 'Erro ao salvar');
      setDefaultPositions(positions);
      setMessage('Posicoes salvas com sucesso!');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  function resetPositions() {
    setPositions(defaultPositions);
    setMessage('Posicoes resetadas para o padrao salvo. Clique em Salvar para confirmar.');
  }

  function updateCrop(side, value) {
    setCrop((prev) => normalizeMapaCrop({ ...prev, [side]: value }));
  }

  function resetCrop() {
    setCrop(MAPA_CROP_DEFAULT);
    setMessage('Recorte visual resetado. Clique em Salvar para confirmar.');
  }

  function nudgeSelected(dx, dy) {
    if (!selectedN) return;
    setPositions((prev) => prev.map((m) => (
      m.n === selectedN
        ? { ...m, cx: Math.max(2, Math.min(98, m.cx + dx)), cy: Math.max(2, Math.min(98, m.cy + dy)) }
        : m
    )));
  }

  const selectedMesa = positions.find((m) => m.n === selectedN);
  const selectedGuest = searchResults[0] || null;
  const emptySearchMessage = useMemo(() => {
    if (!debouncedSearch.trim() || searchLoading) return '';
    if (searchResults.length > 0) return '';
    return 'Nao encontramos esse nome. Verifique a grafia ou busque pelo nome do convite.';
  }, [debouncedSearch, searchLoading, searchResults.length]);
  const mediaFrameStyle = useMemo(() => getMapaMediaFrameStyle(crop), [crop]);

  const highlightGuestTable = useCallback((mesa) => {
    if (typeof mesa !== 'number') return;
    setSelectedN(mesa);
    setHighlightedN(mesa);
    imgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <Head><title>Mapa do Salao - Andre e Nathalia</title></Head>
      {!isEmbedded && <WeddingHeader />}
      <main className={`main ${isEmbedded ? 'pt-3 pb-3' : ''}`}>
        {!isEmbedded && <div className="hero-haze" />}
        <div className="container relative z-10">
          {!isEmbedded && (
            <PageTitle
              kicker="Visual"
              title="Mapa do Salao"
              subtitle="Clique em uma mesa para ver os convidados. Use dois dedos para dar zoom."
            />
          )}

          {loading ? <LoadingSpinner label="Carregando mapa" /> : (
            <div className="space-y-4">
              <div className="romantic-panel overflow-hidden">
                <div
                  className="relative w-full overflow-hidden select-none"
                  style={{ aspectRatio: String(MAPA_ASPECT_RATIO) }}
                >
                  <img
                    ref={imgRef}
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
                    style={{ ...mediaFrameStyle, touchAction: adminEnabled ? 'none' : 'pan-x pan-y pinch-zoom' }}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Labels das areas do salao - apenas admin */}
                    {adminEnabled && (
                      <g opacity="0.45" fontFamily="DM Sans, sans-serif" fontSize="1.8" fontWeight="600" fill="#666">
                        <text x="12" y="25" textAnchor="start">BAR</text>
                        <text x="40" y="18" textAnchor="middle">BUFFET</text>
                        <text x="85" y="25" textAnchor="end">PISTA</text>
                        <text x="50" y="110" textAnchor="middle">ENTRADA</text>
                      </g>
                    )}

                    {/* Circulos das mesas - admin vê todos, publico ve apenas sua mesa selecionada */}
                    {(adminEnabled ? positions : positions.filter(m => m.n === selectedN)).map((mesa) => {
                      const isSelected = selectedN === mesa.n;
                      const isHighlighted = highlightedN === mesa.n;
                      const isNoivos = mesa.isNoivos;

                      const fill = isHighlighted || (!adminEnabled && isSelected)
                        ? 'rgba(29,158,117,0.88)'
                        : isSelected && adminEnabled
                        ? 'rgba(196,164,100,0.85)'
                        : isNoivos
                        ? 'rgba(196,164,100,0.35)'
                        : 'rgba(255,255,255,0.82)';

                      const stroke = isHighlighted || (!adminEnabled && isSelected)
                        ? '#0F6E56'
                        : isSelected && adminEnabled
                        ? '#C4A464'
                        : isNoivos
                        ? '#C4A464'
                        : 'rgba(47,62,50,0.5)';

                      const textFill = isHighlighted || (!adminEnabled && isSelected)
                        ? '#ffffff'
                        : isNoivos
                        ? '#3d2a0a'
                        : '#22352c';

                      const nomeLines = mesa.nome.split(' ');
                      const linha1 = nomeLines.slice(0, 2).join(' ');
                      const linha2 = nomeLines.length > 2 ? nomeLines.slice(2).join(' ') : null;
                      const fontSize = mesa.r > 5 ? 2.1 : 1.75;

                      return (
                        <g
                          key={mesa.n}
                          onClick={() => !adminEnabled && setSelectedN((prev) => (prev === mesa.n ? null : mesa.n))}
                          onPointerDown={(e) => adminEnabled && onPointerDown(e, mesa)}
                          style={{ cursor: adminEnabled ? 'grab' : (mesa.n > 0 ? 'pointer' : 'default') }}
                        >
                          {isHighlighted && (
                            <circle
                              cx={mesa.cx}
                              cy={mesa.cy}
                              r={mesa.r + 2.5}
                              fill="none"
                              stroke="#1D9E75"
                              strokeWidth="0.5"
                              opacity="0.45"
                            />
                          )}

                          <circle
                            cx={mesa.cx}
                            cy={mesa.cy}
                            r={mesa.r}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={isHighlighted || (isSelected && adminEnabled) ? 0.7 : 0.4}
                          />

                          <text
                            x={mesa.cx}
                            y={linha2 ? mesa.cy - 1.2 : mesa.cy}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={fontSize}
                            fontWeight={isHighlighted || isSelected ? '700' : '600'}
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
                              fontSize={fontSize - 0.2}
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
                              fontSize={1.4}
                              fill={isHighlighted ? '#0F6E56' : 'rgba(34,53,44,0.65)'}
                              fontFamily="DM Sans, sans-serif"
                              style={{ pointerEvents: 'none' }}
                            >
                              Mesa {mesa.n}
                            </text>
                          )}

                          {adminEnabled && isSelected && (
                            <text
                              x={mesa.cx + mesa.r + 0.5}
                              y={mesa.cy - mesa.r - 0.5}
                              fontSize={2.5}
                              fill="#C4A464"
                              style={{ pointerEvents: 'none', userSelect: 'none' }}
                            >
                              *
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {adminEnabled && (
                <div className="romantic-panel p-5 space-y-4 border-2 border-gold/40">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gold/80 font-semibold">Modo Admin - Calibracao de Mesas</p>
                      <p className="text-sm text-wine/75 mt-0.5">Arraste os circulos diretamente na imagem, ajuste o recorte visual e salve tudo em uma unica configuracao.</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button className="btn btn--outline text-sm" onClick={resetPositions}>Resetar padrao</button>
                      <button className="btn btn--outline text-sm" onClick={resetCrop}>Resetar recorte</button>
                      <button className="btn btn--primary text-sm" onClick={savePositions} disabled={saving}>
                        {saving ? 'Salvando...' : 'Salvar posicoes'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="form-label text-sm">Mesa selecionada</label>
                    <select
                      className="input-elegant mt-1"
                      value={selectedN ?? ''}
                      onChange={(e) => setSelectedN(e.target.value ? Number(e.target.value) : null)}
                    >
                      <option value="">- Selecione para ajuste fino -</option>
                      {positions.map((m) => (
                        <option key={m.n} value={m.n}>
                          {m.isNoivos ? 'Mesa dos Noivos' : `Mesa ${m.n} - ${m.nome}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-roseDeep/20 bg-white/60 p-4 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-cocoa">Recorte visual do mapa</p>
                      <p className="mt-1 text-xs text-wine/65">Esse recorte esconde bordas da imagem sem mudar as coordenadas salvas das mesas.</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ['top', 'Topo'],
                        ['right', 'Direita'],
                        ['bottom', 'Base'],
                        ['left', 'Esquerda']
                      ].map(([side, label]) => (
                        <label key={side} className="block">
                          <span className="text-xs text-wine/70">{label}: {crop[side]}%</span>
                          <div className="mt-2 flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="45"
                              step="1"
                              value={crop[side]}
                              onChange={(e) => updateCrop(side, Number(e.target.value))}
                              className="flex-1"
                            />
                            <input
                              type="number"
                              min="0"
                              max="45"
                              step="1"
                              className="input-elegant w-20 text-sm py-1"
                              value={crop[side]}
                              onChange={(e) => updateCrop(side, Number(e.target.value))}
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {selectedMesa && (
                    <div className="rounded-2xl border border-roseDeep/20 bg-white/60 p-4 space-y-3">
                      <p className="text-sm font-semibold text-cocoa">
                        {selectedMesa.isNoivos ? 'Mesa dos Noivos' : `Mesa ${selectedMesa.n} - ${selectedMesa.nome}`}
                        <span className="ml-2 text-xs text-wine/50 font-normal">
                          cx: {selectedMesa.cx.toFixed(1)}% cy: {selectedMesa.cy.toFixed(1)}% r: {selectedMesa.r}
                        </span>
                      </p>

                      <div className="grid grid-cols-3 gap-1 w-28">
                        <div />
                        <button className="btn btn--outline py-1 text-sm" onClick={() => nudgeSelected(0, -0.5)}>^</button>
                        <div />
                        <button className="btn btn--outline py-1 text-sm" onClick={() => nudgeSelected(-0.5, 0)}>{'<'}</button>
                        <div className="flex items-center justify-center text-xs text-wine/40">px</div>
                        <button className="btn btn--outline py-1 text-sm" onClick={() => nudgeSelected(0.5, 0)}>{'>'}</button>
                        <div />
                        <button className="btn btn--outline py-1 text-sm" onClick={() => nudgeSelected(0, 0.5)}>v</button>
                        <div />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="text-xs text-wine/70">Raio</label>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          step="0.1"
                          value={selectedMesa.r}
                          onChange={(e) => setPositions((prev) => prev.map((m) => (
                            m.n === selectedN ? { ...m, r: parseFloat(e.target.value) } : m
                          )))}
                          className="flex-1"
                        />
                        <span className="text-xs text-wine/70 w-8">{selectedMesa.r.toFixed(1)}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <label className="block">
                          <span className="text-xs text-wine/60">cx (%)</span>
                          <input
                            type="number"
                            step="0.1"
                            min="2"
                            max="98"
                            className="input-elegant text-sm py-1"
                            value={selectedMesa.cx.toFixed(1)}
                            onChange={(e) => setPositions((prev) => prev.map((m) => (
                              m.n === selectedN ? { ...m, cx: parseFloat(e.target.value) || m.cx } : m
                            )))}
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs text-wine/60">cy (%)</span>
                          <input
                            type="number"
                            step="0.1"
                            min="2"
                            max="98"
                            className="input-elegant text-sm py-1"
                            value={selectedMesa.cy.toFixed(1)}
                            onChange={(e) => setPositions((prev) => prev.map((m) => (
                              m.n === selectedN ? { ...m, cy: parseFloat(e.target.value) || m.cy } : m
                            )))}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {message && (
                    <p className={`text-sm ${message.includes('sucesso') ? 'text-emerald-700' : 'text-wine/80'}`}>
                      {message}
                    </p>
                  )}
                </div>
              )}

              <div className="romantic-panel px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-roseDeep/55 mb-2">Legenda</p>
                <div className="flex flex-wrap gap-3 text-xs text-wine/75">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full bg-white border border-wine/40" />
                    Mesa de convidados
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full border-2 border-[#C4A464]" style={{ background: 'rgba(196,164,100,0.35)' }} />
                    Mesa dos noivos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 rounded-full bg-[#1D9E75]" />
                    Sua mesa
                  </span>
                </div>
              </div>

              {!adminEnabled && selectedN && selectedN > 0 && (
                <div className="romantic-panel p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/60">Mesa selecionada</p>
                  <p className="text-2xl text-cocoa mt-1">
                    {TABLE_NAMES[selectedN]} - Mesa {selectedN}
                  </p>
                  <Link
                    href={`/mesa?q=${encodeURIComponent(TABLE_NAMES[selectedN] || '')}`}
                    className="text-sm font-semibold text-wine hover:underline mt-2 inline-block"
                  >
                    Buscar convidados desta mesa -&gt;
                  </Link>
                </div>
              )}

              {!adminEnabled && !isEmbedded && (
                <section className="romantic-panel p-5 sm:p-7">
                  <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-[0.16em] text-roseDeep/60">Encontrar minha mesa</p>
                    <h2 className="mt-2 text-2xl text-cocoa">Busque seu nome sem sair do mapa</h2>
                    <p className="mt-2 text-sm text-wine/75">
                      Digite seu nome para localizar sua mesa e destaca-la diretamente no mapa acima.
                    </p>

                    <label className="form-label mt-5 block" htmlFor="mapa-mesa-search">Nome do convidado</label>
                    <input
                      id="mapa-mesa-search"
                      className="input-elegant mt-2 text-lg"
                      placeholder="Ex: Maria Silva"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      autoComplete="off"
                      inputMode="search"
                    />
                    <p className="mt-2 text-xs text-wine/65">Busca inteligente por nome do convidado ou nome do convite.</p>
                  </div>

                  <div className="mt-6 max-w-2xl space-y-4">
                    {searchLoading ? <LoadingSpinner label="Buscando convidado" /> : null}
                    {searchError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{searchError}</div> : null}

                    {selectedGuest ? (
                      <article className="rounded-3xl border border-gold/30 bg-[#fffaf1] p-5 shadow-sm">
                        <div className="text-3xl">🎉</div>
                        <h3 className="mt-2 text-2xl text-cocoa">Ola, {selectedGuest.nomeOriginal}!</h3>
                        {typeof selectedGuest.mesa === 'number' ? (
                          <div className="mt-4 rounded-2xl border border-gold/40 bg-white p-4">
                            <p className="text-sm text-wine/70">Voce esta na</p>
                            <p className="text-3xl font-semibold text-cocoa">Mesa {selectedGuest.mesa}</p>
                            <p className="mt-1 text-sm text-wine/75">{TABLE_NAMES[selectedGuest.mesa] || 'Mesa localizada no mapa'}</p>
                            <button
                              type="button"
                              className="btn btn--primary mt-4"
                              onClick={() => highlightGuestTable(selectedGuest.mesa)}
                            >
                              Destacar essa mesa no mapa
                            </button>
                          </div>
                        ) : (
                          <p className="mt-3 text-sm text-wine/80">Sua mesa ainda nao foi definida. Procure a recepcao ao chegar.</p>
                        )}
                      </article>
                    ) : null}

                    {emptySearchMessage ? (
                      <div className="rounded-2xl border border-roseDeep/15 bg-white/80 p-5 text-sm text-wine/80">
                        {emptySearchMessage}
                      </div>
                    ) : null}
                  </div>
                </section>
              )}

              {!adminEnabled && !isEmbedded && (
                <div className="text-center">
                  <Link href="/mapa?admin=true" className="text-xs text-wine/40 hover:text-wine/60">
                    Modo admin
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      {!isEmbedded && <WeddingFooter />}
    </>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      embedded: context?.query?.embedded === '1',
    },
  };
}
