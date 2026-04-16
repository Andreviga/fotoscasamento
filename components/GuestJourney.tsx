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
    <section className="rounded-[28px] border border-roseDeep/15 bg-white/75 p-5 shadow-[0_18px_44px_rgba(34,53,44,0.08)] backdrop-blur-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wine/55">Jornada do convidado</p>
          <h2 className="mt-2 text-2xl text-cocoa sm:text-3xl">{title}</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-wine/75">{subtitle}</p>
      </div>

      <div className={`mt-5 grid gap-3 grid-cols-2 ${compact ? 'xl:grid-cols-3' : 'lg:grid-cols-3'}`}>
        {JOURNEY_LINKS.map((item, index) => {
          const active = item.href === currentPath;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group rounded-3xl border px-3 py-3 sm:px-4 sm:py-4 transition ${
                active
                  ? 'border-wine bg-wine text-white shadow-[0_18px_34px_rgba(15,79,61,0.18)]'
                  : 'border-roseDeep/15 bg-white/80 text-cocoa hover:-translate-y-0.5 hover:border-gold/70 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-[0.16em] ${active ? 'text-white/70' : 'text-wine/50'}`}>
                  Etapa {String(index + 1).padStart(2, '0')}
                </span>
                <span className={`text-xs sm:text-sm font-semibold ${active ? 'text-white' : 'text-wine group-hover:text-cocoa'}`}>
                  {item.label}
                </span>
              </div>
              <h3 className={`mt-2 text-base sm:text-xl ${active ? 'text-white' : 'text-cocoa'}`}>{item.title}</h3>
              <p className={`mt-1 hidden sm:block text-sm leading-6 ${active ? 'text-white/85' : 'text-wine/75'}`}>{item.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}