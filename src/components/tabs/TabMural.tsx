'use client';

import type { AppTab } from '@/components/TabBar';

type TabMuralProps = {
  onNavigate: (tab: AppTab) => void;
};

export default function TabMural(_: TabMuralProps) {
  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4 sm:space-y-5">
        <header className="romantic-panel text-center" style={{ background: 'linear-gradient(180deg,rgba(253,251,247,0.98),rgba(250,246,240,0.92))', padding: '2rem 1.5rem' }}>
          <p className="stationery-monogram">A&amp;N</p>
          <div className="stationery-rule" />
          <p className="mt-3 text-2xl text-cocoa" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>André &amp; Nathália</p>
          <h1 className="mt-1 text-4xl text-cocoa sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Mural Ao Vivo</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-roseDeep/80">As fotos aparecem em tempo real</p>
        </header>

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
