'use client';

import { useEffect, useMemo, useState } from 'react';
import TabBar, { type AppTab } from '@/components/TabBar';
import InstallPromptBanner from '@/components/InstallPromptBanner';
import TabInfo from '@/components/tabs/TabInfo';
import TabMesa from '@/components/tabs/TabMesa';
import TabFotos from '@/components/tabs/TabFotos';
import TabMural from '@/components/tabs/TabMural';
import TabMais from '@/components/tabs/TabMais';

const VALID_TABS: AppTab[] = ['info', 'mesa', 'fotos', 'mural', 'roteiro', 'mapa', 'menu', 'extra'];

const MAIS_SUBS = new Set<AppTab>(['roteiro', 'mapa', 'menu', 'extra']);

function getInitialTab(): AppTab {
  if (typeof window === 'undefined') {
    return 'info';
  }

  const hash = window.location.hash.replace('#', '') as AppTab;
  return VALID_TABS.includes(hash) ? hash : 'info';
}

export default function AppShellPage() {
  const [activeTab, setActiveTab] = useState<AppTab>(getInitialTab);
  const [fotosMounted, setFotosMounted] = useState(() => getInitialTab() === 'fotos');

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Ignore SW registration failure and keep app functional.
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let active = true;
    let timer: number | undefined;

    function sameMinute(a: Date, hhmm: string) {
      const [h, m] = String(hhmm || '').split(':').map(Number);
      if (!Number.isFinite(h) || !Number.isFinite(m)) return false;
      return a.getHours() === h && a.getMinutes() === m;
    }

    async function maybeDispatchNotifications() {
      if (!active || Notification.permission !== 'granted') return;

      try {
        const response = await fetch('/api/getConfig?docs=notificacoes', { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) return;

        const cfg = payload?.config?.notificacoes || {};
        if (!cfg?.enabled) return;

        const schedules = Array.isArray(cfg?.schedules) ? cfg.schedules : [];
        const now = new Date();

        if (cfg?.onlyEventDay) {
          const eventDate = '2026-05-03';
          const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
          if (today !== eventDate) return;
        }

        for (const item of schedules) {
          if (!item?.active || !sameMinute(now, item?.time)) continue;

          const key = `notif-fired:${item.id || item.time}:${now.toDateString()}`;
          if (window.localStorage.getItem(key)) continue;

          const title = String(item?.title || 'Casamento André & Nathália');
          const body = String(item?.message || 'Confira as novidades do evento.');
          const targetTab = String(item?.targetTab || 'info');
          const targetUrl = `/#${targetTab}`;

          try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration?.showNotification) {
              await registration.showNotification(title, {
                body,
                icon: '/icons/icon-192.svg',
                badge: '/icons/icon-192.svg',
                data: { url: targetUrl }
              });
            } else {
              // Fallback for browsers without SW notifications.
              // eslint-disable-next-line no-new
              new Notification(title, { body });
            }
            window.localStorage.setItem(key, '1');
          } catch {
            // Keep silent if browser blocks notification display.
          }
        }
      } catch {
        // Ignore fetch failures; will retry on next interval.
      }
    }

    void maybeDispatchNotifications();
    timer = window.setInterval(() => {
      void maybeDispatchNotifications();
    }, 30000);

    return () => {
      active = false;
      if (timer) window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    function onHashChange() {
      const hash = window.location.hash.replace('#', '') as AppTab;
      const next = VALID_TABS.includes(hash) ? hash : 'info';
      setActiveTab(next);
      if (next === 'fotos') {
        setFotosMounted(true);
      }
    }

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    if (tab === 'fotos') {
      setFotosMounted(true);
    }
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  };

  const currentTabContent = useMemo(() => {
    if (activeTab === 'info') {
      return <TabInfo onNavigate={handleTabChange} />;
    }
    if (activeTab === 'mesa') {
      return <TabMesa onNavigate={handleTabChange} />;
    }
    if (activeTab === 'fotos') {
      return <TabFotos onNavigate={handleTabChange} mounted={fotosMounted} />;
    }
    if (activeTab === 'mural') {
      return <TabMural onNavigate={handleTabChange} />;
    }
    if (MAIS_SUBS.has(activeTab)) {
      return (
        <TabMais
          key={activeTab}
          initialSub={activeTab as 'roteiro' | 'mapa' | 'menu' | 'extra'}
          hideChrome
          onNavigate={handleTabChange}
        />
      );
    }
    return null;
  }, [activeTab, fotosMounted]);

  return (
    <div className="min-h-screen pb-16 sm:pb-20">
      <InstallPromptBanner />
      <main>{currentTabContent}</main>
      <TabBar active={activeTab} onChange={handleTabChange} />
    </div>
  );
}
