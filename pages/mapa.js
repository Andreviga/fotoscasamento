import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const DEFAULT_LAYOUT_SETTINGS = {
  backgroundUrl: '/layout-salao.png',
  showBackground: true,
  opacity: 0.5
};

function normalizeLayoutSettings(layout) {
  return {
    ...DEFAULT_LAYOUT_SETTINGS,
    ...(layout || {}),
    backgroundUrl: layout?.backgroundUrl || DEFAULT_LAYOUT_SETTINGS.backgroundUrl
  };
}

const TYPE_COLORS = {
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

const EMPTY_ELEMENT = {
  id: '',
  tipo: 'outro',
  nome: '',
  x: 50,
  y: 50,
  largura: 8,
  altura: 6,
  rotacao: 0,
  capacidade: ''
};

function makeDefaultMapElementos() {
  const items = [];
  const startXLeft = 38;
  const startXRight = 58;

  for (let i = 0; i < 5; i += 1) {
    const y = 18 + i * 11;
    items.push({ id: `mesa-g-${i + 1}`, tipo: 'mesa_grande', nome: `Mesa ${i + 1}`, x: startXLeft, y, largura: 9, altura: 7, rotacao: 0, capacidade: 10 });
    items.push({ id: `mesa-g-${i + 6}`, tipo: 'mesa_grande', nome: `Mesa ${i + 6}`, x: startXRight, y, largura: 9, altura: 7, rotacao: 0, capacidade: 10 });
    items.push({ id: `mesa-p-${i + 1}`, tipo: 'mesa_pequena', nome: `Mesa P${i + 1}`, x: startXLeft - 12, y: y + 3, largura: 7, altura: 6, rotacao: 0, capacidade: 6 });
    items.push({ id: `mesa-p-${i + 6}`, tipo: 'mesa_pequena', nome: `Mesa P${i + 6}`, x: startXRight + 12, y: y + 3, largura: 7, altura: 6, rotacao: 0, capacidade: 6 });
  }

  return [
    ...items,
    { id: 'bar-principal', tipo: 'bar', nome: 'Bar Principal', x: 15, y: 8, largura: 12, altura: 7, rotacao: -12 },
    { id: 'buffet-1', tipo: 'buffet', nome: 'Buffet 1', x: 30, y: 25, largura: 10, altura: 6, rotacao: 0 },
    { id: 'buffet-2', tipo: 'buffet', nome: 'Buffet 2', x: 30, y: 55, largura: 10, altura: 6, rotacao: 0 },
    { id: 'dj-banda', tipo: 'dj', nome: 'DJ/Banda', x: 8, y: 40, largura: 10, altura: 7, rotacao: 0 },
    { id: 'mesa-bolo', tipo: 'bolo', nome: 'Mesa do Bolo', x: 68, y: 35, largura: 12, altura: 7, rotacao: 0 },
    { id: 'cafe', tipo: 'cafe', nome: 'Cafe', x: 80, y: 25, largura: 10, altura: 6, rotacao: 0 },
    { id: 'bem-casado', tipo: 'outro', nome: 'Bem Casado', x: 76, y: 35, largura: 11, altura: 6, rotacao: 0 },
    { id: 'bar-varanda', tipo: 'bar', nome: 'Bar Varanda', x: 38, y: 82, largura: 12, altura: 6, rotacao: 0 },
    { id: 'welcome-drink', tipo: 'outro', nome: 'Welcome Drink', x: 55, y: 88, largura: 14, altura: 6, rotacao: 0 },
    { id: 'agua-aromatizada', tipo: 'outro', nome: 'Agua Aromatizada', x: 72, y: 88, largura: 14, altura: 6, rotacao: 0 },
    { id: 'sofa-1', tipo: 'sofa', nome: 'Sofa/Poltrona 1', x: 35, y: 86, largura: 10, altura: 6, rotacao: 0 },
    { id: 'sofa-2', tipo: 'sofa', nome: 'Sofa/Poltrona 2', x: 45, y: 86, largura: 10, altura: 6, rotacao: 0 },
    { id: 'cozinha', tipo: 'outro', nome: 'Cozinha', x: 18, y: 75, largura: 12, altura: 7, rotacao: 0 },
    { id: 'banheiros', tipo: 'outro', nome: 'Banheiros', x: 28, y: 75, largura: 12, altura: 7, rotacao: 0 },
    { id: 'valet', tipo: 'outro', nome: 'Valet', x: 90, y: 40, largura: 8, altura: 7, rotacao: 0 },
    { id: 'cabine', tipo: 'outro', nome: 'Cabine', x: 90, y: 85, largura: 8, altura: 7, rotacao: 0 },
    { id: 'bistro-1', tipo: 'bistro', nome: 'Bistro 1', x: 20, y: 18, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-2', tipo: 'bistro', nome: 'Bistro 2', x: 24, y: 30, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-3', tipo: 'bistro', nome: 'Bistro 3', x: 22, y: 48, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-4', tipo: 'bistro', nome: 'Bistro 4', x: 22, y: 62, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-5', tipo: 'bistro', nome: 'Bistro 5', x: 74, y: 58, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-6', tipo: 'bistro', nome: 'Bistro 6', x: 82, y: 50, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-7', tipo: 'bistro', nome: 'Bistro 7', x: 81, y: 14, largura: 5, altura: 5, rotacao: 0 },
    { id: 'planta-1', tipo: 'planta', nome: 'Planta 1', x: 6, y: 10, largura: 4, altura: 4, rotacao: 0 },
    { id: 'planta-2', tipo: 'planta', nome: 'Planta 2', x: 94, y: 12, largura: 4, altura: 4, rotacao: 0 },
    { id: 'planta-3', tipo: 'planta', nome: 'Planta 3', x: 94, y: 72, largura: 4, altura: 4, rotacao: 0 }
  ];
}

function getMesaNumber(elemento) {
  if (typeof elemento.mesaNumero === 'number') {
    return elemento.mesaNumero;
  }

  const name = String(elemento.nome || '').toLowerCase();
  const directMatch = name.match(/mesa\s*[a-z_-]*\s*(\d+)/i);
  if (directMatch) {
    return Number(directMatch[1]);
  }

  const idText = String(elemento.id || '').toLowerCase();
  const idMatch = idText.match(/mesa[-_\s]*[a-z_-]*[-_\s]*(\d+)/i);
  if (idMatch) {
    return Number(idMatch[1]);
  }

  return null;
}

function clamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export default function MapaPage() {
  const router = useRouter();
  const { loading, data } = useConfig(['mapa', 'site']);
  const [elementos, setElementos] = useState([]);
  const [layoutSettings, setLayoutSettings] = useState(DEFAULT_LAYOUT_SETTINGS);
  const [selectedId, setSelectedId] = useState('');
  const [highlightedFromQueryId, setHighlightedFromQueryId] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [guestByMesa, setGuestByMesa] = useState({});

  const mapRef = useRef(null);
  const dragRef = useRef(null);

  const isAdminQuery = String(router.query.admin || '') === 'true';
  const [adminEnabled, setAdminEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = localStorage.getItem('adminToken');
    setAdminEnabled(isAdminQuery && Boolean(token));
  }, [isAdminQuery]);

  useEffect(() => {
    const configElements = data?.mapa?.elementos;
    const configLayout = data?.mapa?.layout;

    if (Array.isArray(configElements) && configElements.length > 0) {
      setElementos(configElements);
      setSelectedId(configElements[0].id);
      setLayoutSettings(normalizeLayoutSettings(configLayout));
      return;
    }

    if (!loading) {
      const defaults = makeDefaultMapElementos();
      setElementos(defaults);
      setSelectedId(defaults[0].id);
      setLayoutSettings(normalizeLayoutSettings());
    }
  }, [data, loading]);

  useEffect(() => {
    async function loadGuests() {
      try {
        const response = await fetch('/api/searchGuest?all=1');
        const payload = await response.json();
        const grouped = {};

        (payload.results || []).forEach((guest) => {
          if (typeof guest.mesa !== 'number') {
            return;
          }

          if (!grouped[guest.mesa]) {
            grouped[guest.mesa] = [];
          }

          grouped[guest.mesa].push(guest.nomeOriginal);
        });

        setGuestByMesa(grouped);
      } catch (error) {
        console.error(error);
      }
    }

    loadGuests();
  }, []);

  useEffect(() => {
    const highlight = String(router.query.destaque || '').toLowerCase();
    if (!highlight || !highlight.startsWith('mesa-')) {
      setHighlightedFromQueryId('');
      return;
    }

    const num = Number(highlight.replace('mesa-', ''));
    if (!num) {
      setHighlightedFromQueryId('');
      return;
    }

    const target = elementos.find((item) => getMesaNumber(item) === num);
    if (target) {
      setSelectedId(target.id);
      setHighlightedFromQueryId(target.id);
    } else {
      setHighlightedFromQueryId('');
    }
  }, [router.query.destaque, elementos]);

  useEffect(() => {
    function onPointerMove(event) {
      const active = dragRef.current;
      if (!active || !adminEnabled || !mapRef.current) {
        return;
      }

      const rect = mapRef.current.getBoundingClientRect();
      const dx = ((event.clientX - active.startX) / rect.width) * 100;
      const dy = ((event.clientY - active.startY) / rect.height) * 100;

      setElementos((prev) =>
        prev.map((item) => {
          if (item.id !== active.id) {
            return item;
          }

          return {
            ...item,
            x: clamp(active.originX + dx, 2, 98),
            y: clamp(active.originY + dy, 2, 96)
          };
        })
      );
    }

    function onPointerUp() {
      dragRef.current = null;
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [adminEnabled]);

  const selected = useMemo(() => {
    return elementos.find((item) => item.id === selectedId) || null;
  }, [elementos, selectedId]);

  const selectedMesaGuests = useMemo(() => {
    if (!selected) return [];
    const mesaNumber = getMesaNumber(selected);
    if (!mesaNumber) return [];
    return guestByMesa[mesaNumber] || [];
  }, [selected, guestByMesa]);

  function updateSelected(patch) {
    if (!selectedId) return;

    setElementos((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, ...patch } : item))
    );
  }

  function startDrag(event, item) {
    if (!adminEnabled) return;

    dragRef.current = {
      id: item.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: item.x,
      originY: item.y
    };
  }

  function addElemento() {
    const id = `novo-${Date.now()}`;
    const next = {
      ...EMPTY_ELEMENT,
      id,
      nome: 'Novo elemento'
    };

    setElementos((prev) => [...prev, next]);
    setSelectedId(id);
  }

  function removeElemento() {
    if (!selectedId) return;
    const filtered = elementos.filter((item) => item.id !== selectedId);
    setElementos(filtered);
    setSelectedId(filtered[0]?.id || '');
  }

  async function saveLayout() {
    if (!adminEnabled) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setMessage('Token admin ausente');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ docId: 'mapa', data: { elementos, layout: layoutSettings } })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao salvar mapa');
      }

      setMessage('Layout salvo com sucesso');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  function resetDefaults() {
    const defaults = makeDefaultMapElementos();
    setElementos(defaults);
    setSelectedId(defaults[0].id);
    setLayoutSettings(normalizeLayoutSettings());
  }

  function nudgeSelected(dx, dy) {
    if (!selected) return;
    updateSelected({
      x: clamp(Number(selected.x || 0) + dx, 2, 98),
      y: clamp(Number(selected.y || 0) + dy, 2, 96)
    });
  }

  return (
    <>
      <Head>
        <title>Mapa do Salão — André & Nathália</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <PageTitle
            kicker="Visual"
            title="Mapa do Salão"
            subtitle="Use o layout real do salão para se orientar e clique nas mesas para ver detalhes."
          />

          <div className="mb-5 rounded-3xl border border-gold/35 bg-[#fff8ea] px-5 py-4 text-sm text-wine/80 shadow-sm">
            <p>
              Este mapa usa a imagem do layout do salão como base visual para facilitar o posicionamento das mesas e a sua orientação.
            </p>
            <p className="mt-2 text-xs text-wine/60">Dica: use dois dedos para dar zoom no mapa.</p>
          </div>

          {loading ? <LoadingSpinner label="Carregando mapa" /> : null}

          {!loading ? (
            <div className="space-y-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <section
                  ref={mapRef}
                  className="relative overflow-hidden rounded-3xl border border-roseDeep/20 bg-[#fdf9ef] shadow-[0_20px_50px_rgba(34,53,44,0.08)]"
                  style={{ aspectRatio: '16 / 12', minHeight: '520px' }}
                >
                  {layoutSettings.showBackground ? (
                    <img
                      alt="Layout do salão"
                      src={layoutSettings.backgroundUrl || DEFAULT_LAYOUT_SETTINGS.backgroundUrl}
                      className="absolute inset-0 h-full w-full pointer-events-none object-cover"
                      style={{ opacity: Number(layoutSettings.opacity ?? DEFAULT_LAYOUT_SETTINGS.opacity) }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,250,239,0.2),rgba(255,250,239,0.48))]" />
                  {elementos.map((item) => {
                    const isSelected = item.id === selectedId;
                    const isHighlightedByQuery = item.id === highlightedFromQueryId;
                    const color = item.cor || TYPE_COLORS[item.tipo] || TYPE_COLORS.outro;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        title={item.nome}
                        onClick={() => setSelectedId(item.id)}
                        onPointerDown={(event) => startDrag(event, item)}
                        className={`absolute flex items-center justify-center rounded-md border text-[10px] sm:text-xs font-semibold shadow-sm ${
                          isHighlightedByQuery
                            ? 'ring-2 ring-wine'
                            : isSelected
                            ? 'ring-2 ring-wine/70'
                            : ''
                        }`}
                        style={{
                          left: `${item.x}%`,
                          top: `${item.y}%`,
                          width: `${item.largura}%`,
                          height: `${item.altura}%`,
                          transform: `translate(-50%, -50%) rotate(${item.rotacao || 0}deg)`,
                          background: isHighlightedByQuery ? '#0f4f3d' : color,
                          color: isHighlightedByQuery ? '#fbfaf7' : '#2c2416',
                          borderColor: isHighlightedByQuery ? 'rgba(15, 79, 61, 0.9)' : 'rgba(44, 36, 22, 0.18)',
                          touchAction: 'none'
                        }}
                      >
                        <span className="pointer-events-none max-w-full truncate px-1">{item.nome}</span>
                      </button>
                    );
                  })}
                </section>

                <div className="lg:hidden mt-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {elementos.map((item) => {
                    const color = item.cor || TYPE_COLORS[item.tipo] || TYPE_COLORS.outro;
                    const isChipSelected = item.id === selectedId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedId(item.id)}
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                          isChipSelected ? 'border-wine bg-wine text-white' : 'border-roseDeep/25 bg-white text-wine'
                        }`}
                        style={isChipSelected ? undefined : { borderLeftColor: color, borderLeftWidth: 3 }}
                      >
                        {item.nome}
                      </button>
                    );
                  })}
                </div>

                <aside className="romantic-panel p-4">
                <h2 className="text-xl text-cocoa">Detalhes</h2>
                {selected ? (
                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-wine">{selected.nome}</p>
                      <p className="text-wine/70">Tipo: {selected.tipo}</p>
                      {selected.id === highlightedFromQueryId ? (
                        <p className="mt-1 inline-flex rounded-full border border-wine/25 bg-wine/10 px-2 py-0.5 text-xs font-semibold text-wine">
                          Mesa encontrada na busca
                        </p>
                      ) : null}
                    </div>

                    {selectedMesaGuests.length > 0 ? (
                      <div>
                        <p className="font-semibold text-cocoa">Convidados nesta mesa:</p>
                        <ul className="mt-1 space-y-1 text-wine/80">
                          {selectedMesaGuests.slice(0, 8).map((guest) => (
                            <li key={guest}>• {guest}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-wine/70">Sem convidados mapeados para esta mesa.</p>
                    )}

                    {typeof getMesaNumber(selected) === 'number' ? (
                      <Link href={`/mesa?q=${encodeURIComponent(selected.nome || `Mesa ${getMesaNumber(selected)}`)}`} className="inline-flex text-sm font-semibold text-wine hover:underline">
                        Ver busca da mesa relacionada →
                      </Link>
                    ) : null}

                    {adminEnabled ? (
                      <div className="space-y-3 border-t border-roseDeep/20 pt-3">
                        <div className="rounded-2xl border border-roseDeep/15 bg-white/70 p-3 space-y-2">
                          <p className="text-sm font-semibold text-cocoa">Base do layout</p>
                          <label className="flex items-center gap-2 text-sm text-wine">
                            <input type="checkbox" checked={Boolean(layoutSettings.showBackground)} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, showBackground: e.target.checked }))} />
                            Mostrar imagem do salão no fundo
                          </label>
                          <label className="block">
                            <span className="form-label">Opacidade da imagem</span>
                            <input type="range" min="0" max="0.9" step="0.05" value={layoutSettings.opacity ?? DEFAULT_LAYOUT_SETTINGS.opacity} onChange={(e) => setLayoutSettings((prev) => ({ ...prev, opacity: Number(e.target.value) }))} className="w-full" />
                            <p className="mt-1 text-xs text-wine/60">Atual: {Math.round(Number(layoutSettings.opacity ?? DEFAULT_LAYOUT_SETTINGS.opacity) * 100)}%</p>
                          </label>
                        </div>

                        <label className="block">
                          <span className="form-label">Nome</span>
                          <input className="input-elegant" value={selected.nome || ''} onChange={(e) => updateSelected({ nome: e.target.value })} />
                        </label>
                        <label className="block">
                          <span className="form-label">Tipo</span>
                          <select className="input-elegant" value={selected.tipo || 'outro'} onChange={(e) => updateSelected({ tipo: e.target.value })}>
                            {Object.keys(TYPE_COLORS).map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          <label className="block">
                            <span className="form-label">X</span>
                            <input type="number" step="0.5" className="input-elegant" value={selected.x ?? 0} onChange={(e) => updateSelected({ x: Number(e.target.value || 0) })} />
                          </label>
                          <label className="block">
                            <span className="form-label">Y</span>
                            <input type="number" step="0.5" className="input-elegant" value={selected.y ?? 0} onChange={(e) => updateSelected({ y: Number(e.target.value || 0) })} />
                          </label>
                          <label className="block">
                            <span className="form-label">Largura</span>
                            <input type="number" step="0.5" className="input-elegant" value={selected.largura ?? 0} onChange={(e) => updateSelected({ largura: Number(e.target.value || 0) })} />
                          </label>
                          <label className="block">
                            <span className="form-label">Altura</span>
                            <input type="number" step="0.5" className="input-elegant" value={selected.altura ?? 0} onChange={(e) => updateSelected({ altura: Number(e.target.value || 0) })} />
                          </label>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <button type="button" className="btn btn--outline" onClick={() => nudgeSelected(-0.5, 0)}>◀</button>
                          <button type="button" className="btn btn--outline" onClick={() => nudgeSelected(0, -0.5)}>▲</button>
                          <button type="button" className="btn btn--outline" onClick={() => nudgeSelected(0.5, 0)}>▶</button>
                          <button type="button" className="btn btn--outline col-start-2" onClick={() => nudgeSelected(0, 0.5)}>▼</button>
                        </div>

                        <label className="block">
                          <span className="form-label">Capacidade</span>
                          <input
                            type="number"
                            className="input-elegant"
                            value={selected.capacidade || ''}
                            onChange={(e) => updateSelected({ capacidade: e.target.value ? Number(e.target.value) : undefined })}
                          />
                        </label>
                        <label className="block">
                          <span className="form-label">Rotacao (graus)</span>
                          <input
                            type="number"
                            className="input-elegant"
                            value={selected.rotacao || 0}
                            onChange={(e) => updateSelected({ rotacao: Number(e.target.value || 0) })}
                          />
                        </label>

                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" className="btn btn--outline" onClick={addElemento}>Adicionar</button>
                          <button type="button" className="btn btn--outline" onClick={removeElemento}>Remover</button>
                          <button type="button" className="btn btn--outline" onClick={resetDefaults}>Resetar</button>
                          <button type="button" className="btn btn--primary" onClick={saveLayout} disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-wine/60">Modo público. Para editar, acesse /mapa?admin=true com sessão admin ativa.</p>
                    )}

                    {message ? <p className="text-xs text-wine/80">{message}</p> : null}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-wine/70">Selecione um item no mapa.</p>
                )}
                </aside>
              </div>

            </div>
          ) : null}
        </div>
      </main>
      <WeddingFooter />
    </>
  );
}
