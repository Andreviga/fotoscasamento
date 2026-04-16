import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

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
  const [selectedId, setSelectedId] = useState('');
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
    if (Array.isArray(configElements) && configElements.length > 0) {
      setElementos(configElements);
      setSelectedId(configElements[0].id);
      return;
    }

    if (!loading) {
      const defaults = makeDefaultMapElementos();
      setElementos(defaults);
      setSelectedId(defaults[0].id);
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
      return;
    }

    const num = Number(highlight.replace('mesa-', ''));
    if (!num) return;

    const target = elementos.find((item) => getMesaNumber(item) === num);
    if (target) {
      setSelectedId(target.id);
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
        body: JSON.stringify({ docId: 'mapa', data: { elementos } })
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
  }

  return (
    <>
      <Head>
        <title>Mapa do Salao</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <PageTitle
            kicker="Visual"
            title="Mapa do Salao"
            subtitle="Passe o mouse para ver os elementos e clique nas mesas para detalhes."
          />

          {loading ? <LoadingSpinner label="Carregando mapa" /> : null}

          {!loading ? (
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
              <section
                ref={mapRef}
                className="relative overflow-hidden rounded-3xl border border-roseDeep/20 bg-[#fdf9ef]"
                style={{ aspectRatio: '16 / 10' }}
              >
                <div className="absolute inset-x-0 bottom-0 h-[21%] bg-[#f4e9d0] opacity-80" />
                {elementos.map((item) => {
                  const isSelected = item.id === selectedId;
                  const color = item.cor || TYPE_COLORS[item.tipo] || TYPE_COLORS.outro;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      title={item.nome}
                      onClick={() => setSelectedId(item.id)}
                      onPointerDown={(event) => startDrag(event, item)}
                      className={`absolute flex items-center justify-center rounded-md border text-[10px] sm:text-xs font-semibold text-[#2c2416] ${
                        isSelected ? 'ring-2 ring-wine/70' : ''
                      }`}
                      style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        width: `${item.largura}%`,
                        height: `${item.altura}%`,
                        transform: `translate(-50%, -50%) rotate(${item.rotacao || 0}deg)`,
                        background: color,
                        borderColor: 'rgba(44, 36, 22, 0.18)',
                        touchAction: 'none'
                      }}
                    >
                      <span className="pointer-events-none max-w-full truncate px-1">{item.nome}</span>
                    </button>
                  );
                })}
              </section>

              <aside className="romantic-panel p-4">
                <h2 className="text-xl text-cocoa">Detalhes</h2>
                {selected ? (
                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-wine">{selected.nome}</p>
                      <p className="text-wine/70">Tipo: {selected.tipo}</p>
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

                    {adminEnabled ? (
                      <div className="space-y-2 border-t border-roseDeep/20 pt-3">
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
                      <p className="text-xs text-wine/60">Modo publico. Para editar, acesse /mapa?admin=true com sessao admin ativa.</p>
                    )}

                    {message ? <p className="text-xs text-wine/80">{message}</p> : null}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-wine/70">Selecione um item no mapa.</p>
                )}
              </aside>
            </div>
          ) : null}
        </div>
      </main>
      <WeddingFooter />
    </>
  );
}
