import Link from 'next/link';

type GuestJourneyProps = {
  currentPath?: string;
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

const JOURNEY_LINKS = [
  {
    href: '/roteiro',
    label: 'Roteiro',
    title: 'Roteiro do dia',
    sublabel: 'Horarios e momentos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm13 8H4v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8z" />
      </svg>
    )
  },
  {
    href: '/mesa',
    label: 'Mesa',
    title: 'Descubra sua mesa',
    sublabel: 'Busca por nome',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.24 4.24a1 1 0 1 1-1.4 1.42l-4.25-4.25A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z" />
      </svg>
    )
  },
  {
    href: '/mapa',
    label: 'Mapa',
    title: 'Mapa do Salão',
    sublabel: 'Orientacao no espaco',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M9.6 4.2a1 1 0 0 1 .8 0l4.2 1.8 4-1.7A1 1 0 0 1 20 5.2v13.6a1 1 0 0 1-.6.92l-4.8 2a1 1 0 0 1-.8 0l-4.2-1.8-4 1.7A1 1 0 0 1 4 20.8V7.2a1 1 0 0 1 .6-.92zM10 6.5v11l4 1.7v-11l-4-1.7z" />
      </svg>
    )
  },
  {
    href: '/menu',
    label: 'Menu',
    title: 'Menu digital',
    sublabel: 'Pratos e bebidas',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v7a2 2 0 1 1-4 0V3a1 1 0 1 1 2 0v4h1V3a1 1 0 0 1 1-1zm8.5 0a1 1 0 0 1 .97 1.24L14.6 11H16a1 1 0 0 1 0 2h-1.75l-1.12 6.15a1 1 0 1 1-1.97-.36l2.9-16A1 1 0 0 1 15.5 2z" />
      </svg>
    )
  },
  {
    href: '/fotos',
    label: 'Instacasamento',
    title: 'Publique sua foto',
    sublabel: 'Filtros e upload',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M9 5a2 2 0 0 1 1.6-.8h2.8A2 2 0 0 1 15 5l.6 1H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3.4L9 5zm3 3.2A4.8 4.8 0 1 0 12 18a4.8 4.8 0 0 0 0-9.8z" />
      </svg>
    )
  },
  {
    href: '/mural',
    label: 'Mural',
    title: 'Mural ao vivo',
    sublabel: 'Fotos em tempo real',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8.8L4 21V6a2 2 0 0 1 2-2zm0 2v10l4-3.2h12V6H4z" />
      </svg>
    )
  },
  {
    href: '/etiqueta',
    label: 'Etiqueta',
    title: 'Etiqueta e dicas',
    sublabel: 'Guia rapido',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 2.2A4.8 4.8 0 0 0 7.2 9c0 2.9 3.2 7.6 4.8 9.7 1.6-2.1 4.8-6.8 4.8-9.7A4.8 4.8 0 0 0 12 4.2z" />
      </svg>
    )
  }
] as const;

export default function GuestJourney({
  currentPath = '',
  title = 'Tudo que os convidados precisam',
  subtitle = 'As paginas publicas abaixo formam o fluxo completo para acompanhar o casamento antes e durante a festa.',
  compact = false
}: GuestJourneyProps) {
  return (
    <section className="romantic-panel rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-roseDeep/70">Jornada do convidado</p>
          <h2 className="mt-2 text-3xl text-cocoa sm:text-4xl">{title}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-cocoa/75">{subtitle}</p>
      </div>

      <div className={`mt-5 grid grid-cols-2 gap-3 ${compact ? 'xl:grid-cols-3' : 'lg:grid-cols-3'}`}>
        {JOURNEY_LINKS.map((item, index) => {
          const active = item.href === currentPath;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group rounded-2xl border p-4 transition ${
                active
                  ? 'border-wine/35 bg-wine/10 text-cocoa'
                  : 'border-roseDeep/20 bg-white/85 text-cocoa hover:-translate-y-0.5 hover:border-gold/70 hover:bg-linen/60'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${active ? 'text-wine/75' : 'text-roseDeep/70'}`}>
                  Etapa {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${active ? 'bg-wine/15 text-wine' : 'bg-linen text-wine'}`}>
                  {item.icon}
                </span>
              </div>
              <h3 className="mt-2 text-lg text-cocoa sm:text-[1.5rem]">{item.title}</h3>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-roseDeep/80 sm:text-xs">{item.sublabel}</p>
              <p className={`mt-1 text-xs font-semibold ${active ? 'text-wine' : 'text-wine/90 group-hover:text-cocoa'}`}>{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}