'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type TimelineItem = {
  horario?: string;
  titulo?: string;
  destaque?: boolean;
};

type TimelineState = {
  items: TimelineItem[];
  loaded: boolean;
};

export default function MiniTimeline() {
  const [state, setState] = useState<TimelineState>({ items: [], loaded: false });

  useEffect(() => {
    let active = true;

    async function loadTimeline() {
      try {
        const response = await fetch('/api/getConfig?docs=roteiro', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Falha ao carregar roteiro');
        }

        const payload = await response.json();
        const raw = payload?.config?.roteiro?.itens;
        const items = Array.isArray(raw) ? raw.slice(0, 4) : [];

        if (active) {
          setState({ items, loaded: true });
        }
      } catch {
        if (active) {
          setState({ items: [], loaded: true });
        }
      }
    }

    loadTimeline();
    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(() => state.items, [state.items]);

  if (!state.loaded || items.length === 0) {
    return null;
  }

  return (
    <section className="romantic-panel p-4 sm:p-6" aria-label="Mini timeline do dia">
      <h2 className="text-2xl sm:text-3xl">Primeiros momentos do dia</h2>
      <div className="mt-4 space-y-3">
        {items.map((item, index) => {
          const highlight = Boolean(item.destaque);
          return (
            <div key={`${item.horario || 'hora'}-${index}`} className="grid grid-cols-[72px_18px_1fr] items-start gap-2">
              <p className="pt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-roseDeep/80">{item.horario || '--:--'}</p>
              <div className="flex justify-center pt-1">
                <span
                  className={`block rounded-full ${highlight ? 'h-3 w-3 bg-gold' : 'h-2 w-2 bg-roseDeep/50'}`}
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm text-cocoa">{item.titulo || 'Momento especial'}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <Link href="/roteiro" className="text-sm font-semibold text-wine hover:text-cocoa">
          Ver roteiro completo →
        </Link>
      </div>
    </section>
  );
}
