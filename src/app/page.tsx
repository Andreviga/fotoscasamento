'use client';

import { useEffect, useMemo, useState } from 'react';
import TabBar, { type AppTab } from '@/components/TabBar';
import TabInfo from '@/components/tabs/TabInfo';
import TabMesa from '@/components/tabs/TabMesa';
import TabMapa from '@/components/tabs/TabMapa';
import TabFotos from '@/components/tabs/TabFotos';
import TabMural from '@/components/tabs/TabMural';
import TabMais from '@/components/tabs/TabMais';

const VALID_TABS: AppTab[] = ['info', 'mesa', 'mapa', 'fotos', 'mais'];

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
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

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

  const handleSelectTable = (tableNum: number) => {
    setSelectedTable(tableNum);
    handleTabChange('mapa');
  };

  const currentTabContent = useMemo(() => {
    if (activeTab === 'info') {
      return <TabInfo onNavigate={handleTabChange} />;
    }
    if (activeTab === 'mesa') {
      return <TabMesa onNavigate={handleTabChange} onSelectTable={handleSelectTable} />;
    }
    if (activeTab === 'mapa') {
      return <TabMapa onNavigate={handleTabChange} selectedTable={selectedTable} onSelectTable={setSelectedTable} />;
    }
    if (activeTab === 'fotos') {
      return <TabFotos onNavigate={handleTabChange} mounted={fotosMounted} />;
    }
    if (activeTab === 'mural') {
      return <TabMural onNavigate={handleTabChange} />;
    }
    return <TabMais onNavigate={handleTabChange} />;
  }, [activeTab, fotosMounted, selectedTable]);

  return (
    <div className="min-h-screen pb-16 sm:pb-20">
      <main>{currentTabContent}</main>
      <TabBar active={activeTab} onChange={handleTabChange} />
    </div>
  );
}
