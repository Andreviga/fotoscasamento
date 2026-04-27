'use client';

export type AppTab = 'info' | 'mesa' | 'fotos' | 'mais' | 'mural';

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
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a1 1 0 001 1h4a1 1 0 001-1v-6" />
      </svg>
    )
  },
  {
    key: 'mesa',
    label: 'Mesa',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    )
  },
  {
    key: 'fotos',
    label: 'Fotos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    )
  },
  {
    key: 'mais',
    label: 'Info',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
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
      <div className="mx-auto grid h-16 max-w-3xl grid-cols-4">
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
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-cocoa' : 'text-roseDeep/55 hover:text-roseDeep'
              }`}
            >
              {isActive && (
                <span className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-gold" />
              )}
              {tab.icon}
              <span className={`text-[10px] font-semibold tracking-[0.08em] ${isActive ? 'text-cocoa' : 'text-roseDeep/55'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}