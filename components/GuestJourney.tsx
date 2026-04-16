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
    description: 'Veja a ordem dos momentos mais importantes da celebracao.'
  },
  {
    href: '/mesa',
    label: 'Mesa',
    title: 'Descubra sua mesa',
    description: 'Busque seu nome e encontre rapidamente onde sentar.'
  },
  {
    href: '/mapa',
    label: 'Mapa',
    title: 'Mapa do salao',
    description: 'Use o layout do espaco para se orientar durante a festa.'
  },
  {
    href: '/cardapio',
    label: 'Cardapio',
    title: 'Cardapio digital',
    description: 'Consulte pratos, drinks e opcoes da noite no celular.'
  },
  {
    href: '/fotos',
    label: 'Instacasamento',
    title: 'Publique sua foto',
    description: 'Capture foto ou video, escolha um filtro e envie ao mural.'
  },
  {
    href: '/mural',
    label: 'Mural',
    title: 'Mural ao vivo',
    description: 'Acompanhe as fotos e videos aparecendo em tempo real.'
  },
  {
    href: '/etiqueta',
    label: 'Etiqueta',
    title: 'Etiqueta e dicas',
    description: 'Consulte orientacoes rapidas para aproveitar melhor a festa.'
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
                <span className={`text-xs font-semibold sm:text-sm ${active ? 'text-wine' : 'text-wine group-hover:text-cocoa'}`}>
                  {item.label}
                </span>
              </div>
              <h3 className="mt-2 text-lg text-cocoa sm:text-[1.6rem]">{item.title}</h3>
              <p className={`mt-1 hidden text-sm leading-6 text-cocoa/75 sm:block ${active ? 'text-cocoa/80' : ''}`}>{item.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}