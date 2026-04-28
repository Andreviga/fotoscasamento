'use client';

import { useEffect, useState } from 'react';
import type { AppTab } from '@/components/TabBar';

type TabInfoProps = {
  onNavigate: (tab: AppTab) => void;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
};

const TARGET_DATE = '2026-05-03T17:00:00-03:00';

function computeTimeLeft(): TimeLeft {
  const target = new Date(TARGET_DATE).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    started: false
  };
}

function fmt(v: number) {
  return String(v).padStart(2, '0');
}

export default function TabInfo({ onNavigate }: TabInfoProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(computeTimeLeft);

  useEffect(() => {
    const id = window.setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="main" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-5">
        {/* Hero Header */}
        <header
          className="romantic-panel text-center"
          style={{
            background: 'linear-gradient(160deg,rgba(253,251,247,0.98) 0%,rgba(250,246,240,0.95) 100%)',
            padding: '2.5rem 1.5rem',
          }}
        >
          <p className="stationery-monogram" aria-hidden="true">A&amp;N</p>
          <div className="stationery-rule" />
          <h1 className="mt-3 text-5xl text-cocoa sm:text-6xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>André &amp; Nathália</h1>
          <p className="mt-1 text-sm uppercase tracking-[0.3em] text-roseDeep/65">03 de maio de 2026</p>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-cocoa/70">
            Bem-vindos ao nosso casamento. Encontre sua mesa, veja as informações do local e compartilhe seus registros desse dia especial.
          </p>
          {/* Countdown */}
          <div
            aria-live="polite"
            className="mx-auto mt-5 inline-block rounded-2xl border border-roseDeep/15 bg-white/60 px-5 py-3"
          >
            {timeLeft.started ? (
              <p className="font-serifRomance text-2xl text-wine">A festa começou! 🎉</p>
            ) : (
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {[
                  { label: 'dias', value: timeLeft.days },
                  { label: 'horas', value: timeLeft.hours },
                  { label: 'min', value: timeLeft.minutes },
                  { label: 'seg', value: timeLeft.seconds },
                ].map((unit, i) => (
                  <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
                    <div className="text-center">
                      <p className="font-serifRomance text-3xl text-gold sm:text-4xl">{fmt(unit.value)}</p>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-roseDeep/60">{unit.label}</p>
                    </div>
                    {i < 3 ? <span className="text-gold/50 text-lg">·</span> : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mx-auto mt-3 h-px w-32 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <p className="mt-3 text-xs italic text-roseDeep/55">Com carinho, André &amp; Nathália</p>
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
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.sessionStorage.setItem('tab-mais-focus', 'mapa');
              }
              onNavigate('mais');
            }}
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
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('mais')}
            className="btn btn--outline py-3.5 text-sm"
          >
            📋 Roteiro &amp; Menu
          </button>
          <button
            type="button"
            onClick={() => onNavigate('mural')}
            className="btn btn--outline py-3.5 text-sm"
          >
            🖼 Mural de fotos
          </button>
        </div>

        {/* Footer stamp */}
        <div className="text-center pt-2 pb-1">
          <p className="text-xs tracking-[0.18em] text-roseDeep/40 uppercase">A&amp;N · 03.05.2026</p>
        </div>
      </div>
    </section>
  );
}
