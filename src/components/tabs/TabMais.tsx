'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AppTab } from '@/components/TabBar';

type TabMaisProps = {
  onNavigate: (tab: AppTab) => void;
};

type RoteiroItem = {
  horario?: string;
  titulo?: string;
  destaque?: boolean;
};

export default function TabMais({ onNavigate }: TabMaisProps) {
  const [loading, setLoading] = useState(true);
  const [roteiroItems, setRoteiroItems] = useState<RoteiroItem[]>([]);
  const mapSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let active = true;

    async function loadRoteiro() {
      try {
        const response = await fetch('/api/getConfig?docs=roteiro', { cache: 'no-store' });
        const payload = await response.json();

        if (!active) return;

        const items = Array.isArray(payload?.config?.roteiro?.itens) ? payload.config.roteiro.itens : [];
        setRoteiroItems(items);
      } catch {
        if (!active) return;
        setRoteiroItems([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRoteiro();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const focus = window.sessionStorage.getItem('tab-mais-focus');
    if (focus === 'mapa') {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.sessionStorage.removeItem('tab-mais-focus');
    }
  }, []);

  const timeline = useMemo(() => roteiroItems, [roteiroItems]);

  return (
    <section className="main">
      <div className="hero-haze" />
      <div className="container relative z-10 space-y-4 py-4">
        <header className="romantic-panel p-4 sm:p-6">
          <h1 className="text-3xl text-cocoa sm:text-4xl">Mais opcoes</h1>
          <p className="mt-2 text-sm text-cocoa/75">Roteiro completo, mapa do salao, cardapio e links uteis em um unico lugar.</p>
        </header>

        <section className="romantic-panel p-4 sm:p-5">
          <h2 className="text-2xl text-cocoa">Roteiro do dia</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gold" />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {timeline.length > 0 ? (
                timeline.map((item, index) => (
                  <div key={`${item.horario || 'hora'}-${index}`} className="grid grid-cols-[68px_18px_1fr] items-start gap-2">
                    <p className="text-xs font-mono font-semibold text-gold">{item.horario || '--:--'}</p>
                    <span className={`pt-0.5 ${item.destaque ? 'text-gold' : 'text-roseDeep/70'}`}>{item.destaque ? '★' : '●'}</span>
                    <p className="text-sm text-cocoa">{item.titulo || 'Momento especial'}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-cocoa/70">Roteiro indisponivel no momento.</p>
              )}
            </div>
          )}
        </section>

        <section ref={mapSectionRef} className="romantic-panel p-4 sm:p-5">
          <h2 className="text-2xl text-cocoa">Mapa do salao</h2>
          <iframe src="/mapa" className="mt-3 w-full rounded-xl border border-roseDeep/20" style={{ height: '300px' }} title="Mapa do salao" />
          <a href="/mapa" target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-semibold text-wine">
            Abrir mapa completo →
          </a>
        </section>

        <section className="romantic-panel p-4 sm:p-5">
          <h2 className="text-2xl text-cocoa">Cardapio</h2>
          <iframe src="/cardapio" className="mt-3 w-full rounded-xl border border-roseDeep/20" style={{ height: '400px' }} title="Cardapio" />
        </section>

        <section className="romantic-panel p-4 sm:p-5">
          <h2 className="text-2xl text-cocoa">Lista de presentes</h2>
          <a
            href="https://andrenathalia03052026.site/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-sm font-semibold text-wine"
          >
            Abrir lista de presentes →
          </a>

          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a href="/etiqueta" target="_blank" rel="noreferrer" className="rounded-full border border-roseDeep/20 px-3 py-1 text-wine">
              /etiqueta
            </a>
            <a href="/roteiro" target="_blank" rel="noreferrer" className="rounded-full border border-roseDeep/20 px-3 py-1 text-wine">
              /roteiro
            </a>
          </div>

          <button type="button" className="btn btn--outline mt-4" onClick={() => onNavigate('info')}>
            Voltar para Info
          </button>
        </section>
      </div>
    </section>
  );
}
