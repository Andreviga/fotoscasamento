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

        {/* Hero */}
        <div
          className="romantic-panel text-center"
          style={{
            background: 'linear-gradient(160deg,rgba(253,251,247,0.98) 0%,rgba(250,246,240,0.95) 100%)',
            padding: '2.5rem 1.5rem',
          }}
        >
          {/* Monogram */}
          <div
            className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/60 font-serifRomance text-xl text-gold sm:h-20 sm:w-20 sm:text-2xl"
            aria-hidden="true"
          >
            A&amp;N
          </div>

          <div className="mx-auto mt-3 h-px w-32 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <h1 className="mt-3 text-5xl text-cocoa sm:text-6xl">André &amp; Nathália</h1>
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
        </div>

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


type TabInfoProps = {
  onNavigate: (tab: AppTab) => void;
};

type EtiquetteItem = {
  icon: string;
  title: string;
  content: string;
};

type RoteiroItem = {
  horario?: string;
  titulo?: string;
  destaque?: boolean;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
};

const TARGET_DATE = '2026-05-03T17:00:00-03:00';

const FALLBACK_ETIQUETA: EtiquetteItem[] = [
  { icon: '👔', title: 'Traje', content: 'Esporte fino. Por favor, evite branco ou creme.' },
  { icon: '⏰', title: 'Horários', content: 'Festa: 17h · Cerimônia: 18h. Chegue 20min antes.' },
  { icon: '🔕', title: 'Cerimônia', content: 'Celular no silencioso. Aguarde a noiva entrar antes de sentar. Não passe na frente do fotógrafo.' },
  { icon: '📷', title: 'Fotos', content: 'Use #andreanathalia2026 nas redes. O photobooth está disponível no app.' },
  { icon: '🎁', title: 'Presente', content: 'Sua presença é o nosso presente. Se quiser nos presentear, consulte a lista.' },
  { icon: '👶', title: 'Crianças', content: '' },
  { icon: '🅿️', title: 'Estacionamento', content: '' }
];

function parseMinutes(horario?: string): number | null {
  if (!horario) return null;
  const match = horario.match(/(\d{1,2})\s*:\s*(\d{2})/);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  return hour * 60 + minute;
}

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

function formatUnit(value: number) {
  return String(value).padStart(2, '0');
}

function getEtiquetaItems(configEtiqueta: any): EtiquetteItem[] {
  const sections = Array.isArray(configEtiqueta?.secoes) ? configEtiqueta.secoes : [];

  if (sections.length === 0) {
    return FALLBACK_ETIQUETA;
  }

  const mapByTitle = new Map<string, string>();
  sections.forEach((section: any) => {
    const key = String(section?.titulo || '').toLowerCase().trim();
    if (key) {
      mapByTitle.set(key, String(section?.conteudo || '').trim());
    }
  });

  return FALLBACK_ETIQUETA.map((item) => {
    const exact = mapByTitle.get(item.title.toLowerCase());
    const partial = [...mapByTitle.entries()].find(([key]) => key.includes(item.title.toLowerCase()))?.[1];
    return {
      ...item,
      content: exact || partial || item.content
    };
  });
}

export default function TabInfo({ onNavigate }: TabInfoProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(computeTimeLeft);
  const [loading, setLoading] = useState(true);
  const [etiquetaItems, setEtiquetaItems] = useState<EtiquetteItem[]>(FALLBACK_ETIQUETA);
  const [roteiroItems, setRoteiroItems] = useState<RoteiroItem[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(computeTimeLeft());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const response = await fetch('/api/getConfig?docs=etiqueta,roteiro', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Config indisponível');
        }

        const payload = await response.json();
        if (!active) return;

        const etiqueta = getEtiquetaItems(payload?.config?.etiqueta);
        const roteiro = Array.isArray(payload?.config?.roteiro?.itens) ? payload.config.roteiro.itens : [];
        setEtiquetaItems(etiqueta);
        setRoteiroItems(roteiro);
      } catch {
        if (!active) return;
        setEtiquetaItems(FALLBACK_ETIQUETA);
        setRoteiroItems([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadConfig();

    return () => {
      active = false;
    };
  }, []);

  const upcomingRoteiro = useMemo(() => {
    if (!roteiroItems.length) {
      return [];
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const withMinutes = roteiroItems.map((item) => ({ ...item, _minutes: parseMinutes(item.horario) }));
    const nextIndex = withMinutes.findIndex((item) => typeof item._minutes === 'number' && (item._minutes as number) >= currentMinutes);

    if (nextIndex >= 0) {
      return withMinutes.slice(nextIndex, nextIndex + 4);
    }

    return withMinutes.slice(Math.max(0, withMinutes.length - 4));
  }, [roteiroItems]);

  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4">
        <header className="stationery-top">
          <div className="stationery-monogram h-16 w-16 text-xl tracking-[0.12em] text-gold sm:h-20 sm:w-20 sm:text-2xl">
            A&amp;N
          </div>
          <h1 className="mt-3 text-4xl text-cocoa sm:text-5xl">André &amp; Nathália</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-roseDeep/75">3 de maio de 2026</p>
          <div className="mx-auto mt-3 h-[1px] w-40 bg-gold/55" />

          <div aria-live="polite" className="mx-auto mt-4 max-w-xl rounded-2xl border border-roseDeep/20 bg-white/75 px-3 py-3">
            {timeLeft.started ? (
              <p className="font-serifRomance text-2xl text-wine">A festa começou! 🎉</p>
            ) : (
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {[
                  { label: 'dias', value: timeLeft.days },
                  { label: 'horas', value: timeLeft.hours },
                  { label: 'min', value: timeLeft.minutes },
                  { label: 'seg', value: timeLeft.seconds }
                ].map((unit, index) => (
                  <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                    <div className="text-center">
                      <p className="font-serifRomance text-2xl text-gold sm:text-3xl">{formatUnit(unit.value)}</p>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-roseDeep/75">{unit.label}</p>
                    </div>
                    {index < 3 ? <span className="text-gold/65">·</span> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        <section className="romantic-panel overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
            </div>
          ) : (
            <div className="divide-y divide-roseDeep/20">
              {etiquetaItems.map((item) => (
                <div key={item.title} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 text-xl text-gold">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-cocoa">{item.title}</p>
                    <p className="text-sm text-cocoa/70">{item.content || ' '}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="romantic-panel p-4 sm:p-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl text-cocoa">Próximos momentos</h2>
              <div className="mt-3 space-y-3">
                {upcomingRoteiro.map((item, index) => (
                  <div key={`${item.horario || 'hora'}-${index}`} className="grid grid-cols-[64px_18px_1fr] items-start gap-2">
                    <p className="text-xs font-mono font-semibold text-gold">{item.horario || '--:--'}</p>
                    <div className="relative flex justify-center pt-1">
                      <span className={`${item.destaque ? 'text-gold text-base' : 'text-roseDeep/65 text-sm'}`}>{item.destaque ? '★' : '●'}</span>
                      {index < upcomingRoteiro.length - 1 ? <span className="absolute left-1/2 top-5 h-6 -translate-x-1/2 border-l border-roseDeep/25" /> : null}
                    </div>
                    <p className="text-sm text-cocoa">{item.titulo || 'Momento especial'}</p>
                  </div>
                ))}
                {upcomingRoteiro.length === 0 ? <p className="text-sm text-cocoa/70">Roteiro será exibido aqui automaticamente.</p> : null}
              </div>
              <button type="button" onClick={() => onNavigate('mais')} className="mt-3 text-sm font-semibold text-wine">
                Ver roteiro completo →
              </button>
            </>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="btn btn--primary" onClick={() => onNavigate('mesa')}>
            Encontrar minha mesa
          </button>
          <button type="button" className="btn btn--outline" onClick={() => onNavigate('mais')}>
            Ver roteiro
          </button>
        </div>
      </div>
    </section>
  );
}
