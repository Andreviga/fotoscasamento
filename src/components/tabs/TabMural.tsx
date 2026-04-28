'use client';

import type { AppTab } from '@/components/TabBar';
import PageHeader from '@/components/PageHeader';

type TabMuralProps = {
  onNavigate: (tab: AppTab) => void;
};

export default function TabMural(_: TabMuralProps) {
  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4 sm:space-y-5">
        <PageHeader title="Mural de recados" subtitle="As fotos aparecem em tempo real" />

        <div className="romantic-panel overflow-hidden border border-gold/30 bg-white/80 p-2 sm:p-3">
          <iframe
            src="/mural?embedded=1"
            className="w-full rounded-[20px] border-0"
            style={{ height: 'calc(100dvh - 13.5rem)' }}
            title="Mural ao vivo"
          />
        </div>
      </div>
    </section>
  );
}
