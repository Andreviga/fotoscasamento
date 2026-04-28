'use client';

import { useEffect, useState } from 'react';
import type { AppTab } from '@/components/TabBar';

type TabInfoProps = {
  onNavigate: (tab: AppTab) => void;
};

const EVENT_DAY_STR = '2026-05-03';

const ROTEIRO_ITEMS = [
  { horario: '17:00', titulo: 'Chegada e welcome drink' },
  { horario: '17:30', titulo: 'Abertura do salão' },
  { horario: '18:00', titulo: 'Entrada dos padrinhos' },
  { horario: '18:15', titulo: 'Entrada dos pais dos noivos' },
  { horario: '18:30', titulo: 'Entrada da noiva' },
  { horario: '18:35', titulo: 'Cerimônia' },
  { horario: '19:00', titulo: 'Troca de alianças' },
  { horario: '19:10', titulo: 'Primeiro beijo' },
  { horario: '19:15', titulo: 'Fotos com família' },
  { horario: '19:30', titulo: 'Abertura do buffet' },
  { horario: '20:00', titulo: 'Brinde' },
  { horario: '20:30', titulo: 'Pista de dança' },
  { horario: '21:00', titulo: 'Corte do bolo' },
  { horario: '21:15', titulo: 'Bouquet da noiva' },
  { horario: '23:00', titulo: 'Encerramento' },
];

type NextAtracao = {
  status: 'before' | 'next' | 'now' | 'ended';
  titulo: string;
  horario: string;
  minutesUntil?: number;
};

function computeNextAtracao(): NextAtracao {
  const now = new Date();
  const evDay = new Date(EVENT_DAY_STR);
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const evMidnight = new Date(evDay.getFullYear(), evDay.getMonth(), evDay.getDate());

  if (nowMidnight < evMidnight) {
    const daysUntil = Math.ceil((evMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'before', titulo: 'A Festa', horario: '17:00', minutesUntil: daysUntil * 1440 };
  }

  if (nowMidnight > evMidnight) {
    return { status: 'ended', titulo: 'Encerramento', horario: '23:00' };
  }

  // Event day — find next item
  let lastItem = ROTEIRO_ITEMS[ROTEIRO_ITEMS.length - 1];
  for (const item of ROTEIRO_ITEMS) {
    const [h, m] = item.horario.split(':').map(Number);
    const itemTime = new Date(evDay.getFullYear(), evDay.getMonth(), evDay.getDate(), h, m, 0);
    if (itemTime > now) {
      const minutesUntil = Math.floor((itemTime.getTime() - now.getTime()) / 60000);
      return { status: 'next', titulo: item.titulo, horario: item.horario, minutesUntil };
    }
    // within 25 min window: mark as "now"
    const windowEnd = new Date(itemTime.getTime() + 25 * 60000);
    if (itemTime <= now && now < windowEnd) {
      return { status: 'now', titulo: item.titulo, horario: item.horario };
    }
    lastItem = item;
  }

  return { status: 'ended', titulo: lastItem.titulo, horario: lastItem.horario };
}

export default function TabInfo({ onNavigate }: TabInfoProps) {
  const [atracao, setAtracao] = useState<NextAtracao>(computeNextAtracao);

  useEffect(() => {
    const id = window.setInterval(() => setAtracao(computeNextAtracao()), 30000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="main" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-5">
        {/* Hero Header */}
        <header className="home-hero">
          <span className="wedding-monogram hero-monogram" aria-hidden="true">
            A <span className="wedding-amp">&amp;</span> N
          </span>
          <div className="wedding-rule" />
          <h1 className="wedding-names mt-2">
            André <span className="wedding-amp">&amp;</span> Nathália
          </h1>
          <div className="wedding-rule" />
          <p className="hero-date">03 de maio de 2026</p>
          <p className="hero-intro">
            Bem-vindos ao nosso casamento. Encontre sua mesa, veja as informações do local e compartilhe seus registros desse dia especial.
          </p>
          {/* Próxima Atração */}
          <div
            aria-live="polite"
            className="mx-auto mt-5 inline-block rounded-2xl border border-roseDeep/15 bg-white/60 px-5 py-3 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-roseDeep/55">Próxima Atração</p>
            {atracao.status === 'ended' ? (
              <p className="font-serifRomance text-2xl text-wine mt-1">Que noite incrível! ✿</p>
            ) : atracao.status === 'now' ? (
              <>
                <p className="font-serifRomance text-xl text-wine mt-1">{atracao.titulo}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">⏱ Acontecendo agora · {atracao.horario}</p>
              </>
            ) : atracao.status === 'before' ? (
              <>
                <p className="font-serifRomance text-xl text-cocoa mt-1">A Festa · 03 de maio</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  em {Math.floor((atracao.minutesUntil ?? 0) / 1440)} {Math.floor((atracao.minutesUntil ?? 0) / 1440) === 1 ? 'dia' : 'dias'}
                </p>
              </>
            ) : (
              <>
                <p className="font-serifRomance text-xl text-cocoa mt-1">{atracao.titulo}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  {atracao.horario}
                  {atracao.minutesUntil !== undefined && atracao.minutesUntil < 60
                    ? ` · em ${atracao.minutesUntil} min`
                    : atracao.minutesUntil !== undefined
                    ? ` · em ${Math.floor(atracao.minutesUntil / 60)}h${atracao.minutesUntil % 60 > 0 ? String(atracao.minutesUntil % 60).padStart(2,'0') : ''}`
                    : ''}
                </p>
              </>
            )}
          </div>

          <p className="wedding-signature mt-3" style={{ '--font-size': '19px' } as React.CSSProperties}>
            Com carinho, André <span className="wedding-amp">&amp;</span> Nathália
          </p>
        </header>

        {/* CTA Buttons */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            type="button"
            aria-label="Encontrar minha mesa"
            onClick={() => onNavigate('mesa')}
            className="flex flex-col items-center gap-2 rounded-[24px] bg-cocoa py-5 text-sm font-semibold text-ivory shadow-frame transition hover:bg-wine active:scale-95"
          >
            <span className="text-2xl">🔍</span>
            Encontrar minha mesa
          </button>
          <button
            type="button"
            aria-label="Como chegar"
            onClick={() => onNavigate('mapa')}
            className="flex flex-col items-center gap-2 rounded-[24px] border border-gold/40 bg-white/70 py-5 text-sm font-semibold text-cocoa shadow-soft transition hover:bg-white active:scale-95"
          >
            <span className="text-2xl">🗺</span>
            Como chegar
          </button>
          <button
            type="button"
            aria-label="Enviar fotos"
            onClick={() => onNavigate('fotos')}
            className="flex flex-col items-center gap-2 rounded-[24px] border border-gold/40 bg-white/70 py-5 text-sm font-semibold text-cocoa shadow-soft transition hover:bg-white active:scale-95"
          >
            <span className="text-2xl">📸</span>
            Enviar fotos
          </button>
        </div>

        {/* Quick info cards */}
        <div className="romantic-panel divide-y divide-roseDeep/10 overflow-hidden">
          {[
            { icon: '📅', label: 'Data', value: '03 de maio de 2026 — Domingo' },
            { icon: '📍', label: 'Local', value: 'Espaço Vdara — Sítio São Jorge, São Bernardo do Campo' },
            { icon: '⏰', label: 'Horário', value: 'Festa: 17h · Cerimônia: 18h (pontual)' },
            { icon: '👔', label: 'Traje', value: 'Esporte fino. Evite branco, creme ou tons da noiva.' },
            { icon: '🅿️', label: 'Estacionamento', value: 'Verifique a orientação da equipe no local.' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 px-4 py-3.5">
              <span className="mt-0.5 shrink-0 text-lg">{item.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-roseDeep/55">{item.label}</p>
                <p className="mt-0.5 text-sm text-cocoa/80">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary navigation */}
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('roteiro')}
            className="btn btn--outline py-3.5 text-sm"
          >
            📋 Roteiro
          </button>
          <button
            type="button"
            onClick={() => onNavigate('menu')}
            className="btn btn--outline py-3.5 text-sm"
          >
            🍽 Menu
          </button>
          <button
            type="button"
            onClick={() => onNavigate('mural')}
            className="btn btn--outline py-3.5 text-sm"
          >
            🖼 Mural
          </button>
        </div>

        {/* Footer stamp */}
        <div className="text-center pt-2 pb-1">
          <div className="bottom-brand">
            <span className="wedding-monogram bottom-monogram">
              A <span className="wedding-amp">&amp;</span> N
            </span>
            <span className="bottom-date">03.05.2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
