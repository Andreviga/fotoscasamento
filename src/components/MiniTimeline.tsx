'use client';

type TimelineItem = {
  horario?: string;
  titulo?: string;
  destaque?: boolean;
};

type MiniTimelineProps = {
  items: TimelineItem[];
  onNavigate: () => void;
};

export default function MiniTimeline({ items, onNavigate }: MiniTimelineProps) {
  const preview = items.slice(0, 4);

  if (preview.length === 0) {
    return null;
  }

  return (
    <section className="romantic-panel p-4 sm:p-6" aria-label="Mini timeline do dia">
      <h2 className="text-2xl sm:text-3xl">Primeiros momentos do dia</h2>
      <div className="mt-4 space-y-3">
        {preview.map((item, index) => {
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
        <button
          type="button"
          onClick={onNavigate}
          className="text-sm font-semibold text-wine hover:text-cocoa"
        >
          Ver roteiro completo →
        </button>
      </div>
    </section>
  );
}
