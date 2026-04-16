import Link from 'next/link';
import GuestJourney from '../../components/GuestJourney';

const quickLinks = [
  {
    href: '/roteiro',
    title: 'Roteiro',
    description: 'Veja a ordem dos momentos da celebracao e planeje sua chegada.'
  },
  {
    href: '/mesa',
    title: 'Mesa',
    description: 'Descubra onde voce vai sentar e encontre seu lugar mais rapido.'
  },
  {
    href: '/mapa',
    title: 'Mapa',
    description: 'Use o layout do salao para se orientar durante a festa.'
  }
];

const supportLinks = [
  { href: '/cardapio', label: 'Cardapio' },
  { href: '/fotos', label: 'Instacasamento' },
  { href: '/mural', label: 'Mural' },
  { href: '/etiqueta', label: 'Etiqueta' }
];

export default function HomePage() {
  return (
    <main className="romantic-shell">
      <div className="hero-haze" />

      <section className="romantic-panel mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 text-center lg:max-w-3xl lg:text-left">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold/70 bg-white/70 font-serifRomance text-3xl tracking-[0.14em] text-wine shadow-[0_14px_34px_rgba(34,53,44,0.08)] lg:mx-0">
              A &amp; N
            </div>
            <p className="text-sm uppercase tracking-[0.34em] text-wine/70">03 de maio de 2026</p>
            <h1 className="text-5xl leading-none text-cocoa sm:text-7xl">André &amp; Nathália</h1>
            <p className="max-w-2xl text-sm leading-7 text-wine/80 sm:text-base">
              Um unico lugar para os convidados acompanharem o cronograma, localizar a mesa, se orientar no salao, consultar o cardapio e publicar lembrancas no mural ao vivo.
            </p>

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/mesa" className="btn btn--primary">
                Encontrar minha mesa
              </Link>
              <Link href="/roteiro" className="btn btn--outline">
                Ver roteiro do dia
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-roseDeep/15 bg-white/70 p-4 shadow-[0_14px_32px_rgba(34,53,44,0.06)] lg:w-[320px]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine/55">Acessos rapidos</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {supportLinks.map((item) => (
                <Link key={item.href} href={item.href} className="chip hover:border-gold/70 hover:bg-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-wine/75">
              No dia da festa, o caminho mais util costuma ser: roteiro, mesa, mapa e depois Instacasamento.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="romantic-panel group p-6 transition hover:-translate-y-0.5 hover:border-gold/70 hover:bg-white"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-wine/55">Acesso rápido</p>
              <h2 className="mt-3 text-3xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-wine/76">{item.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-wine group-hover:text-cocoa">Abrir agora</span>
            </Link>
          ))}
        </div>

        <GuestJourney currentPath="/" />
      </section>
    </main>
  );
}
