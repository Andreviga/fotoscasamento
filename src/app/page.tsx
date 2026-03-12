import Link from 'next/link';

const quickLinks = [
  {
    href: '/fotos',
    title: 'Instacasamento',
    description: 'Capture foto ou vídeo, escolha o filtro e publique no mural do casamento.'
  },
  {
    href: '/mural',
    title: 'Mural ao Vivo',
    description: 'Tela em tempo real para exibir no telão durante a festa.'
  },
  {
    href: '/cardapio',
    title: 'Cardápio Digital',
    description: 'Um acesso extra para convidados consultarem o menu da noite no celular.'
  }
];

export default function HomePage() {
  return (
    <main className="romantic-shell flex items-center">
      <div className="hero-haze" />
      <section className="romantic-panel mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-10 sm:px-10 sm:py-12">
        <div className="space-y-4 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold/70 bg-white/70 font-serifRomance text-3xl tracking-[0.14em] text-wine shadow-[0_14px_34px_rgba(34,53,44,0.08)]">
            A &amp; N
          </div>
          <p className="text-sm uppercase tracking-[0.34em] text-wine/70">03 de maio de 2026</p>
          <h1 className="text-5xl leading-none text-cocoa sm:text-7xl">André &amp; Nathália</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-wine/80 sm:text-base">
            Instacasamento, mural ao vivo e cardápio da festa em um único lugar para os convidados.
          </p>
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
      </section>
    </main>
  );
}
