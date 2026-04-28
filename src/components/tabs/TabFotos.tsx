'use client';

import type { AppTab } from '@/components/TabBar';

type TabFotosProps = {
  onNavigate: (tab: AppTab) => void;
  mounted: boolean;
};

export default function TabFotos({ mounted }: TabFotosProps) {
  if (!mounted) {
    return (
      <section className="main">
        <div className="hero-haze" />
        <div className="container relative z-10 py-4">
          <div className="romantic-panel flex min-h-[48vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
              <p className="mt-4 text-sm text-cocoa/75">Preparando a camera...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4 sm:space-y-5">
        <header className="romantic-panel text-center" style={{ background: 'linear-gradient(180deg,rgba(253,251,247,0.98),rgba(250,246,240,0.92))', padding: '2rem 1.5rem' }}>
          <p className="stationery-monogram">A&amp;N</p>
          <div className="stationery-rule" />
          <p className="mt-3 text-2xl text-cocoa" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>André &amp; Nathália</p>
          <h1 className="mt-1 text-4xl text-cocoa sm:text-5xl" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Cabine de Fotos</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-roseDeep/80">Registre memórias da festa</p>
        </header>

        <div className="romantic-panel overflow-hidden border border-gold/30 bg-white/80 p-2 sm:p-3">
          <iframe
            src="/fotos?embedded=1"
            className="w-full rounded-[20px] border-0"
            style={{ height: 'calc(100dvh - 13.5rem)' }}
            allow="camera; microphone"
            title="Instacasamento"
          />
        </div>
      </div>
    </section>
  );
}
