'use client';

import { useEffect, useMemo, useState } from 'react';
import type { AppTab } from '@/components/TabBar';

type TabMaisProps = {
  onNavigate: (tab: AppTab) => void;
};

type RoteiroItem = {
  horario?: string;
  titulo?: string;
  descricao?: string;
  destaque?: boolean;
};

type SubTab = 'roteiro' | 'mapa' | 'cardapio' | 'extra';

const ROTEIRO_FALLBACK: RoteiroItem[] = [
  { horario: '17:00', titulo: 'Chegada e welcome drink',     destaque: false },
  { horario: '17:30', titulo: 'Abertura do salão',           destaque: false },
  { horario: '18:00', titulo: 'Entrada dos padrinhos',       destaque: true  },
  { horario: '18:15', titulo: 'Entrada dos pais dos noivos', destaque: true  },
  { horario: '18:30', titulo: 'Entrada da noiva',            destaque: true  },
  { horario: '18:35', titulo: 'Cerimônia',                   destaque: true  },
  { horario: '19:00', titulo: 'Troca de alianças',           destaque: true  },
  { horario: '19:10', titulo: 'Primeiro beijo',              destaque: true  },
  { horario: '19:15', titulo: 'Fotos com família',           destaque: false },
  { horario: '19:30', titulo: 'Abertura do buffet',          destaque: false },
  { horario: '20:00', titulo: 'Brinde',                      destaque: true  },
  { horario: '20:30', titulo: 'Pista de dança',              destaque: true  },
  { horario: '21:00', titulo: 'Corte do bolo',               destaque: true  },
  { horario: '21:15', titulo: 'Bouquet da noiva',            destaque: true  },
  { horario: '23:00', titulo: 'Encerramento',                destaque: false },
];

const DIA_FESTA = new Date('2026-05-03');

function getHorarioAtual(items: RoteiroItem[]): string | null {
  const agora = new Date();
  if (agora < DIA_FESTA) return null;
  let current: string | null = null;
  for (const item of items) {
    const parts = (item.horario || '').split(':').map(Number);
    const h = parts[0];
    const m = parts[1];
    if (Number.isNaN(h) || Number.isNaN(m)) continue;
    const t = new Date(DIA_FESTA);
    t.setHours(h, m, 0);
    if (t <= agora) current = item.horario ?? null;
  }
  return current;
}

const SUB_TABS: { id: SubTab; label: string; icon: string }[] = [
  { id: 'roteiro',  label: 'Roteiro',  icon: '🗓' },
  { id: 'mapa',     label: 'Mapa',     icon: '🗺' },
  { id: 'cardapio', label: 'Cardápio', icon: '🍽' },
  { id: 'extra',    label: 'Mais',     icon: '✦'  },
];

export default function TabMais({ onNavigate }: TabMaisProps) {
  const [sub, setSub] = useState<SubTab>('roteiro');
  const [loadingRoteiro, setLoadingRoteiro] = useState(true);
  const [roteiroItems, setRoteiroItems] = useState<RoteiroItem[]>([]);
  const [mapaMounted, setMapaMounted] = useState(false);
  const [cardapioMounted, setCardapioMounted] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/getConfig?docs=roteiro', { cache: 'no-store' })
      .then((r) => r.json())
      .then((payload: any) => {
        if (!active) return;
        const raw = payload?.config?.roteiro?.itens;
        const items = Array.isArray(raw) && raw.length > 0 ? raw : ROTEIRO_FALLBACK;
        setRoteiroItems(items);
      })
      .catch(() => { if (active) setRoteiroItems(ROTEIRO_FALLBACK); })
      .finally(() => { if (active) setLoadingRoteiro(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (sub === 'mapa') setMapaMounted(true);
    if (sub === 'cardapio') setCardapioMounted(true);
  }, [sub]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const focus = window.sessionStorage.getItem('tab-mais-focus');
    if (focus === 'mapa') {
      setSub('mapa');
      window.sessionStorage.removeItem('tab-mais-focus');
    }
  }, []);

  const horarioAtual = useMemo(() => getHorarioAtual(roteiroItems), [roteiroItems]);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 4rem)' }}>
      {/* Sub-tab bar */}
      <div className="shrink-0 border-b border-roseDeep/15 bg-ivory/95 backdrop-blur">
        <div className="mx-auto flex max-w-lg">
          {SUB_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={sub === t.id}
              onClick={() => setSub(t.id)}
              className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                sub === t.id ? 'text-wine' : 'text-roseDeep/60'
              }`}
            >
              <span className="text-base leading-none">{t.icon}</span>
              {t.label}
              {sub === t.id && (
                <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-wine" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">

        {/* ROTEIRO */}
        <div className={sub === 'roteiro' ? 'block' : 'hidden'}>
          <div className="mx-auto max-w-lg px-4 pb-8 pt-4">
            <p className="mb-4 text-center text-xs uppercase tracking-[0.22em] text-roseDeep/60">
              03 · 05 · 2026
            </p>
            {loadingRoteiro ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
              </div>
            ) : (
              <ol className="relative border-l border-gold/30 pl-5">
                {roteiroItems.map((item, index) => {
                  const isAtual = horarioAtual === item.horario;
                  return (
                    <li key={`${item.horario}-${index}`} className="mb-5 last:mb-0">
                      <span
                        className={`absolute -left-[9px] mt-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 text-[9px] ${
                          isAtual
                            ? 'border-wine bg-wine text-ivory'
                            : item.destaque
                            ? 'border-gold bg-gold/20 text-gold'
                            : 'border-roseDeep/30 bg-linen text-roseDeep/50'
                        }`}
                        aria-hidden="true"
                      >
                        {isAtual ? '\u25B6' : item.destaque ? '\u2605' : '\u00B7'}
                      </span>
                      <div className={`rounded-xl border px-4 py-3 ${
                        isAtual
                          ? 'border-wine/40 bg-wine/5 shadow-sm'
                          : item.destaque
                          ? 'border-gold/30 bg-[#fffbf0]'
                          : 'border-roseDeep/15 bg-white/70'
                      }`}>
                        <p className={`font-mono text-xs font-semibold ${isAtual ? 'text-wine' : 'text-gold'}`}>
                          {item.horario || '--:--'}
                          {isAtual && <span className="ml-2 animate-pulse"> agora</span>}
                        </p>
                        <p className={`mt-0.5 text-sm font-semibold ${isAtual ? 'text-wine' : 'text-cocoa'}`}>
                          {item.titulo || 'Momento especial'}
                        </p>
                        {item.descricao ? (
                          <p className="mt-0.5 text-xs text-wine/65">{item.descricao}</p>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* MAPA */}
        <div className={sub === 'mapa' ? 'flex h-full flex-col' : 'hidden'}>
          {mapaMounted ? (
            <iframe
              src="/mapa"
              title="Mapa do Salão"
              className="w-full flex-1 border-0"
              style={{ height: 'calc(100dvh - 8rem)' }}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
            </div>
          )}
          <div className="shrink-0 border-t border-roseDeep/10 bg-ivory/90 px-4 py-2 text-center">
            <a href="/mapa" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-wine">
              Abrir mapa em tela cheia
            </a>
          </div>
        </div>

        {/* CARDAPIO */}
        <div className={sub === 'cardapio' ? 'flex h-full flex-col' : 'hidden'}>
          {cardapioMounted ? (
            <iframe
              src="/cardapio"
              title="Cardápio"
              className="w-full flex-1 border-0"
              style={{ height: 'calc(100dvh - 8rem)' }}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
            </div>
          )}
        </div>

        {/* EXTRA */}
        <div className={sub === 'extra' ? 'block' : 'hidden'}>
          <div className="mx-auto max-w-lg space-y-3 px-4 pb-8 pt-4">
            <a href="/etiqueta" className="flex items-center gap-4 rounded-2xl border border-roseDeep/20 bg-white/80 px-5 py-4 shadow-sm active:bg-linen">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xl">🎩</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cocoa">Etiqueta</p>
                <p className="text-xs text-wine/65">Traje, horários e orientações</p>
              </div>
              <span className="text-roseDeep/40">›</span>
            </a>
            <a
              href="https://andrenathalia03052026.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-roseDeep/20 bg-white/80 px-5 py-4 shadow-sm active:bg-linen"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xl">🎁</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cocoa">Lista de presentes</p>
                <p className="text-xs text-wine/65">Abrir em nova aba</p>
              </div>
              <span className="text-roseDeep/40">›</span>
            </a>
            <a href="/roteiro" className="flex items-center gap-4 rounded-2xl border border-roseDeep/20 bg-white/80 px-5 py-4 shadow-sm active:bg-linen">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xl">📋</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cocoa">Roteiro completo</p>
                <p className="text-xs text-wine/65">Versão detalhada em página própria</p>
              </div>
              <span className="text-roseDeep/40">›</span>
            </a>
            <a href="/cardapio" className="flex items-center gap-4 rounded-2xl border border-roseDeep/20 bg-white/80 px-5 py-4 shadow-sm active:bg-linen">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xl">🍽</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-cocoa">Cardápio da noite</p>
                <p className="text-xs text-wine/65">Entradas, pratos e bebidas</p>
              </div>
              <span className="text-roseDeep/40">›</span>
            </a>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('info')}
                className="w-full rounded-2xl border border-wine/30 bg-wine/5 py-3 text-sm font-semibold text-wine transition-colors active:bg-wine/10"
              >
                Voltar para a página inicial
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
