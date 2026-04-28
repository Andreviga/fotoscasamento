'use client';

export type AppTab = 'info' | 'mesa' | 'fotos' | 'mural' | 'roteiro' | 'mapa' | 'menu' | 'extra';

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
    label: 'Início',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a1 1 0 001 1h4a1 1 0 001-1v-6" />
      </svg>
    )
  },
  {
    key: 'mesa',
    label: 'Mesa',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    )
  },
  {
    key: 'fotos',
    label: 'Fotos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    )
  },
  {
    key: 'mural',
    label: 'Mural',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    key: 'roteiro',
    label: 'Roteiro',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path strokeLinecap="round" d="M3 9h18M8 2v4M16 2v4M7 13h2M11 13h6M7 17h2M11 17h4" />
      </svg>
    )
  },
  {
    key: 'mapa',
    label: 'Mapa',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  },
  {
    key: 'menu',
    label: 'Menu',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 0-3 1.5-3 3v3h6V6c0-1.5-1.5-3-3-3zM9 9v12M15 9v12M6 12h12" />
      </svg>
    )
  },
  {
    key: 'extra',
    label: 'Mais',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 8h.01M12 11v5" />
      </svg>
    )
  }
];

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-ivory/96 pb-safe backdrop-blur-md"
      style={{ boxShadow: '0 -2px 20px rgba(47,62,50,0.08)' }}
      aria-label="Navegação principal"
      role="tablist"
    >
      <div className="flex h-16 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onChange(tab.key)}
              className={`relative flex min-w-[56px] flex-1 flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-cocoa' : 'text-roseDeep/55 hover:text-roseDeep'
              }`}
            >
              {isActive && (
                <span className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-gold" />
              )}
              {tab.icon}
              <span className={`text-[9px] font-semibold tracking-[0.06em] ${isActive ? 'text-cocoa' : 'text-roseDeep/55'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}