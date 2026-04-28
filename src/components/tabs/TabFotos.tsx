'use client';

import type { AppTab } from '@/components/TabBar';
import PageHeader from '@/components/PageHeader';

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
        <PageHeader title="Compartilhe suas fotos" subtitle="Registre memórias da festa" />

        <div className="romantic-panel overflow-hidden border border-gold/30 bg-white/80 p-2 sm:p-3">
          <iframe
            src="/fotos?embedded=1"
            className="w-full rounded-[20px] border-0"
            style={{ height: 'calc(100dvh - 13.5rem)' }}
            allow="camera; microphone"
            title="Instacasamento"
          />
        </div>

        <div className="romantic-panel border border-roseDeep/15 bg-white/75 p-3 text-center">
          <p className="text-xs text-wine/70">
            Se a câmera não abrir dentro da aba, use o modo em tela cheia.
          </p>
          <a
            href="/fotos"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center rounded-full border border-gold/40 bg-white px-4 py-2 text-xs font-semibold text-cocoa"
          >
            Abrir câmera em tela cheia
          </a>
        </div>
      </div>
    </section>
  );
}
