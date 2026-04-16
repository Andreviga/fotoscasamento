'use client';

export type AppTab = 'info' | 'mesa' | 'fotos' | 'mural' | 'mais';

type TabBarProps = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
};

type TabItem = {
  key: AppTab;
  label: string;
  icon: JSX.Element;
};

const TABS: TabItem[] = [
  {
    key: 'info',
    label: 'Info',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-1 2v6h2v-6h-2z" />
      </svg>
    )
  },
  {
    key: 'mesa',
    label: 'Mesa',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 2.2A4.8 4.8 0 0 0 7.2 9c0 2.9 3.2 7.6 4.8 9.7 1.6-2.1 4.8-6.8 4.8-9.7A4.8 4.8 0 0 0 12 4.2z" />
      </svg>
    )
  },
  {
    key: 'fotos',
    label: 'Fotos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M9 5a2 2 0 0 1 1.6-.8h2.8A2 2 0 0 1 15 5l.6 1H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3.4L9 5zm3 3.2A4.8 4.8 0 1 0 12 18a4.8 4.8 0 0 0 0-9.8z" />
      </svg>
    )
  },
  {
    key: 'mural',
    label: 'Mural',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
    )
  },
  {
    key: 'mais',
    label: 'Mais',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M6 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      </svg>
    )
  }
];

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-roseDeep/20 bg-ivory/95 pb-safe backdrop-blur"
      aria-label="Navegacao principal"
      role="tablist"
    >
      <div className="mx-auto grid h-16 max-w-3xl grid-cols-5">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          const isFotos = tab.key === 'fotos';

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Abrir aba ${tab.label}`}
              onClick={() => onChange(tab.key)}
              className="flex flex-col items-center justify-center gap-1"
            >
              {isFotos ? (
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${
                    isActive ? 'bg-wine text-ivory' : 'bg-gold text-cocoa'
                  }`}
                >
                  {tab.icon}
                </span>
              ) : (
                <span className={`${isActive ? 'text-gold' : 'text-roseDeep/75'}`}>{tab.icon}</span>
              )}
              <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${isActive ? 'text-gold' : 'text-roseDeep/75'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}