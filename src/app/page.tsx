'use client';

import { useEffect, useMemo, useState } from 'react';
import TabBar, { type AppTab } from '@/components/TabBar';
import TabInfo from '@/components/tabs/TabInfo';
import TabMesa from '@/components/tabs/TabMesa';
import TabFotos from '@/components/tabs/TabFotos';
import TabMural from '@/components/tabs/TabMural';
import TabMais from '@/components/tabs/TabMais';

// PALETA: primary=#0f4f3d, background=#fbfaf7, muted=#cfdacd, foreground=#22352c
// FONTES: heading=var(--font-romance) (Cormorant Garamond), body=var(--font-clean) (DM Sans)
// FILTROS CLOUDINARY: [original, festa-pop, neon, sunset, algodao-doce, dream, pb-classico, noir, sepia, retro, cinema, polaroid]
// COLECAO FIRESTORE: mural (campos: guestName, mediaType, mediaUrl, messageText, filterId, publicId, deleteTokenHash, createdAt, createdAtMs)
// NOTA: src/lib/cloudinary.ts atualmente possui 4 presets; fluxo produtivo de 12 filtros esta consolidado em pages/fotos.js.

const VALID_TABS: AppTab[] = ['info', 'mesa', 'fotos', 'mural', 'mais'];

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
    return <TabMais onNavigate={handleTabChange} />;
  }, [activeTab, fotosMounted]);

  return (
    <div className="min-h-screen pb-16 sm:pb-20">
      <main>{currentTabContent}</main>
      <TabBar active={activeTab} onChange={handleTabChange} />
    </div>
  );
}
