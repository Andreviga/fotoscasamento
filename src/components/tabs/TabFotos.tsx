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
    <iframe
      src="/fotos"
      className="w-full border-0"
      style={{ height: 'calc(100vh - 4rem)' }}
      allow="camera; microphone"
      title="Instacasamento"
    />
  );
}
