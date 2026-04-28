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
          <span className="wedding-monogram">
            A <span className="wedding-amp">&amp;</span> N
          </span>
          <div className="wedding-rule" />
          <h1 className="wedding-names mt-2">
            André <span className="wedding-amp">&amp;</span> Nathália
          </h1>
          <div className="wedding-rule" />
          <p className="mt-1 text-sm uppercase tracking-[0.28em] text-roseDeep/70">Mural Ao Vivo</p>
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
