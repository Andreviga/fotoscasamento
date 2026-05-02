'use client';

import { useEffect, useState } from 'react';
import type { AppTab } from '@/components/TabBar';
import MiniTimeline from '@/components/MiniTimeline';
import { initTestTime, getNow } from '@/lib/testTime';

type TabInfoProps = {
  onNavigate: (tab: AppTab) => void;
};

const EVENT_DAY_STR = '2026-05-03';
const CERIMONIA_HOUR = 18;
const CERIMONIA_MINUTE = 0;
const DELAY_ALERT_BUFFER_MINUTES = 30;
const DESTINATION_ADDRESS = 'R. das Araribás, 31 - Bairro dos Casa, São Bernardo do Campo - SP, 09840-210';
const DESTINATION_COORDS = { lat: -23.743138, lon: -46.5749888 };

type RoteiroItem = { horario: string; titulo: string };

const ROTEIRO_FALLBACK: RoteiroItem[] = [
  { horario: '16:00', titulo: 'Chegada e Welcome drink' },
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

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

type RouteApp = 'google' | 'waze';

function computeNextAtracao(items: RoteiroItem[]): NextAtracao {
  const now = getNow();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Parse as local midnight to avoid UTC-offset shifting the date
  const [ey, em, ed] = EVENT_DAY_STR.split('-').map(Number);
  const evMidnight = new Date(ey, em - 1, ed);

  const firstItem = items[0];
  const lastItem = items[items.length - 1];

  if (nowMidnight < evMidnight) {
    const daysUntil = Math.ceil((evMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24));
    return { status: 'before', titulo: 'A Festa', horario: firstItem?.horario ?? '16:00', minutesUntil: daysUntil * 1440 };
  }

  if (nowMidnight > evMidnight) {
    return { status: 'ended', titulo: lastItem?.titulo ?? 'Encerramento', horario: lastItem?.horario ?? '23:00' };
  }

  // Event day — find next item
  let current = lastItem;
  for (const item of items) {
    const [h, m] = item.horario.split(':').map(Number);
    const itemTime = new Date(ey, em - 1, ed, h, m, 0);
    if (itemTime > now) {
      const minutesUntil = Math.floor((itemTime.getTime() - now.getTime()) / 60000);
      return { status: 'next', titulo: item.titulo, horario: item.horario, minutesUntil };
    }
    // within 25 min window: mark as "now"
    const windowEnd = new Date(itemTime.getTime() + 25 * 60000);
    if (itemTime <= now && now < windowEnd) {
      return { status: 'now', titulo: item.titulo, horario: item.horario };
    }
    current = item;
  }

  return { status: 'ended', titulo: current?.titulo ?? 'Encerramento', horario: current?.horario ?? '23:00' };
}

export default function TabInfo({ onNavigate }: TabInfoProps) {
  const [roteiroItems, setRoteiroItems] = useState<RoteiroItem[]>(ROTEIRO_FALLBACK);
  const [atracao, setAtracao] = useState<NextAtracao>(() => computeNextAtracao(ROTEIRO_FALLBACK));
  const [siteInfo, setSiteInfo] = useState<Record<string, string>>({});
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState('');
  const [notifStatus, setNotifStatus] = useState('');
  const [routeStatus, setRouteStatus] = useState('');
  const [isRouting, setIsRouting] = useState(false);
  const [delayNotified, setDelayNotified] = useState(false);

  useEffect(() => {
    initTestTime();
    // Recalculate immediately after initTestTime
    setAtracao(computeNextAtracao(roteiroItems));
    // Then set interval for continuous updates
    const id = window.setInterval(() => setAtracao(computeNextAtracao(roteiroItems)), 30000);
    return () => window.clearInterval(id);
  }, [roteiroItems]);

  useEffect(() => {
    let mounted = true;

    async function fetchConfig() {
      try {
        const response = await fetch('/api/getConfig?docs=site,roteiro', { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) return;

        const site = payload?.config?.site;
        if (mounted && site && typeof site === 'object') {
          setSiteInfo(site as Record<string, string>);
        }

        const rawRoteiro = payload?.config?.roteiro?.itens;
        if (mounted && Array.isArray(rawRoteiro) && rawRoteiro.length > 0) {
          const items = rawRoteiro as RoteiroItem[];
          setRoteiroItems(items);
          setAtracao(computeNextAtracao(items));
        }
      } catch {
        // Keep defaults in UI when config API is unavailable.
      }
    }

    void fetchConfig();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  async function installApp() {
    if (!deferredInstallPrompt) {
      setInstallStatus('No iPhone (Safari), use Compartilhar > Adicionar à Tela de Início.');
      return;
    }

    await deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    setDeferredInstallPrompt(null);
    setInstallStatus(choice.outcome === 'accepted' ? 'App instalado com sucesso.' : 'Instalação cancelada.');
  }

  async function enableNotifications() {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotifStatus('Este navegador não suporta notificações.');
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch {
        // Continue and still request permission.
      }
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotifStatus('Notificações ativadas.');
      return;
    }

    setNotifStatus('Permissão de notificações negada.');
  }

  function getTrafficMultiplier() {
    const hour = new Date().getHours();
    const isRushHour = (hour >= 6 && hour < 9) || (hour >= 17 && hour < 21);
    return isRushHour ? 1.35 : 1.15;
  }

  async function estimateTravelMinutes(fromLat: number, fromLon: number) {
    try {
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${fromLon},${fromLat};${DESTINATION_COORDS.lon},${DESTINATION_COORDS.lat}?overview=false`;
      const res = await fetch(routeUrl, { cache: 'no-store' });
      const payload = await res.json();
      const rawMinutes = Number(payload?.routes?.[0]?.duration) / 60;
      if (Number.isFinite(rawMinutes) && rawMinutes > 0) {
        return Math.ceil(rawMinutes * getTrafficMultiplier());
      }
    } catch {
      // Fallback below when route API is unavailable.
    }

    const earthRadiusKm = 6371;
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(DESTINATION_COORDS.lat - fromLat);
    const dLon = toRad(DESTINATION_COORDS.lon - fromLon);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(fromLat)) * Math.cos(toRad(DESTINATION_COORDS.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = earthRadiusKm * c;
    const avgCitySpeedKmH = 28;
    const minutes = (distanceKm / avgCitySpeedKmH) * 60;
    return Math.max(5, Math.ceil(minutes * getTrafficMultiplier()));
  }

  function getCeremonyRemainingMinutes() {
    const now = getNow();
    const [ey, em, ed] = EVENT_DAY_STR.split('-').map(Number);
    const isEventDay =
      now.getFullYear() === ey &&
      now.getMonth() === em - 1 &&
      now.getDate() === ed;

    if (!isEventDay) {
      return null;
    }

    const ceremonyTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      CERIMONIA_HOUR,
      CERIMONIA_MINUTE,
      0
    );
    return Math.floor((ceremonyTime.getTime() - now.getTime()) / 60000);
  }

  async function maybeNotifyDelay(etaMinutes: number, remainingMinutes: number) {
    if (delayNotified) {
      return;
    }

    const slackMinutes = remainingMinutes - etaMinutes;
    const hasDelayRisk = slackMinutes <= DELAY_ALERT_BUFFER_MINUTES;

    if (!hasDelayRisk) {
      return;
    }

    const isLate = slackMinutes < 0;
    const alertBody = isLate
      ? `Com o trânsito atual, sua chegada estimada é em ${etaMinutes} min e você pode atrasar para a cerimônia.`
      : `Com o trânsito atual, sua margem até a cerimônia é de apenas ${slackMinutes} min. Saia agora para evitar atraso.`;

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Atenção ao horário', {
        body: alertBody,
      });
      setDelayNotified(true);
      return;
    }

    setRouteStatus(`Atenção: ${alertBody} Ative as notificações para receber alerta automático.`);
    setDelayNotified(true);
  }

  async function openDirections(app: RouteApp) {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setRouteStatus('Geolocalização não suportada neste navegador.');
      return;
    }

    setIsRouting(true);
    setRouteStatus('Buscando sua localização para traçar a rota...');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 60000,
        });
      });

      const originLat = position.coords.latitude;
      const originLon = position.coords.longitude;
      const etaMinutes = await estimateTravelMinutes(originLat, originLon);
      const remainingMinutes = getCeremonyRemainingMinutes();

      if (remainingMinutes !== null) {
        if (remainingMinutes <= 0) {
          setRouteStatus(`Rota pronta no ${app === 'google' ? 'Google Maps' : 'Waze'}. A cerimônia já começou.`);
        } else {
          setRouteStatus(
            `Rota pronta no ${app === 'google' ? 'Google Maps' : 'Waze'}. Tempo estimado: ${etaMinutes} min.`
          );
          await maybeNotifyDelay(etaMinutes, remainingMinutes);
        }
      } else {
        setRouteStatus(`Rota pronta no ${app === 'google' ? 'Google Maps' : 'Waze'}. Tempo estimado: ${etaMinutes} min.`);
      }

      const destinationQuery = encodeURIComponent(DESTINATION_ADDRESS);
      const googleUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLon}&destination=${destinationQuery}&travelmode=driving`;
      const wazeUrl = `https://waze.com/ul?ll=${DESTINATION_COORDS.lat},${DESTINATION_COORDS.lon}&navigate=yes`;
      const targetUrl = app === 'google' ? googleUrl : wazeUrl;

      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch {
      setRouteStatus('Não foi possível obter sua localização. Permita o acesso ao local para abrir a rota.');
    } finally {
      setIsRouting(false);
    }
  }

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
          <div className="mt-5 text-center">
            <a
              href="/api/giftLink"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-roseDeep/20 px-3 py-1 text-[11px] font-medium tracking-[0.08em] text-roseDeep/70 transition hover:border-gold/40 hover:text-cocoa"
            >
              Lista de presentes
            </a>
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
            onClick={() => void openDirections('google')}
            className="flex flex-col items-center gap-2 rounded-[24px] border border-gold/40 bg-white/70 py-5 text-sm font-semibold text-cocoa shadow-soft transition hover:bg-white active:scale-95"
          >
            <span className="text-2xl">🗺</span>
            Como chegar (Maps)
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

        <div className="rounded-2xl border border-gold/30 bg-white/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-roseDeep/55">Navegação até o local</p>
          <p className="mt-1 text-sm text-cocoa/80">
            Toque para abrir rota com sua localização atual: {DESTINATION_ADDRESS}.
          </p>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => void openDirections('google')}
              disabled={isRouting}
              className="btn btn--outline py-3 text-sm disabled:opacity-60"
            >
              📍 Abrir no Google Maps
            </button>
            <button
              type="button"
              onClick={() => void openDirections('waze')}
              disabled={isRouting}
              className="btn btn--outline py-3 text-sm disabled:opacity-60"
            >
              🚗 Abrir no Waze
            </button>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('mapa')}
            className="mt-3 text-xs font-semibold text-wine hover:underline"
          >
            Ver mapa interno do salão
          </button>
          {routeStatus ? <p className="mt-3 text-xs text-wine/70">{routeStatus}</p> : null}
        </div>

        {/* Quick info cards */}
        <div className="romantic-panel divide-y divide-roseDeep/10 overflow-hidden">
          {[
            { icon: '📅', label: 'Data', value: siteInfo.info_data || '03 de maio de 2026 — Domingo' },
            { icon: '📍', label: 'Local', value: siteInfo.info_local || 'Espaço Vdara — Sítio São Jorge, São Bernardo do Campo' },
            { icon: '⏰', label: 'Horário', value: siteInfo.info_horario || 'Festa: 16h · Cerimônia: 18h (pontual)' },
            { icon: '👔', label: 'Traje', value: siteInfo.info_traje || 'Esporte fino. Evite branco, creme ou tons da noiva.' },
            { icon: '🅿️', label: 'Estacionamento', value: siteInfo.info_estacionamento || 'Verifique a orientação da equipe no local.' },
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

        {/* Mini roteiro */}
        {roteiroItems.length > 0 && (
          <MiniTimeline items={roteiroItems} onNavigate={() => onNavigate('roteiro')} />
        )}

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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => void installApp()}
            className="btn btn--primary py-3.5 text-sm"
          >
            📲 Instalar aplicativo
          </button>
          <button
            type="button"
            onClick={() => void enableNotifications()}
            className="btn btn--outline py-3.5 text-sm"
          >
            🔔 Ativar notificações
          </button>
        </div>

        {installStatus ? <p className="text-center text-xs text-wine/65">{installStatus}</p> : null}
        {notifStatus ? <p className="text-center text-xs text-wine/65">{notifStatus}</p> : null}

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
