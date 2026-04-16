import Link from 'next/link';
import GuestJourney from '../../components/GuestJourney';

const quickAccess = [
  {
    href: '/cardapio',
    title: 'Cardapio',
    description: 'Consulte pratos, bebidas e opcoes da noite.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v7a2 2 0 1 1-4 0V3a1 1 0 1 1 2 0v4h1V3a1 1 0 0 1 1-1zm8.5 0a1 1 0 0 1 .97 1.24L14.6 11H16a1 1 0 0 1 0 2h-1.75l-1.12 6.15a1 1 0 1 1-1.97-.36l2.9-16A1 1 0 0 1 15.5 2z"/>
      </svg>
    )
  },
  {
    href: '/fotos',
    title: 'Instacasamento',
    description: 'Publique fotos e videos com filtros em segundos.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path fill="currentColor" d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.2A2.8 2.8 0 1 0 12 15a2.8 2.8 0 0 0 0-5.6z"/>
        <path fill="currentColor" d="M7.2 3h9.6a4.2 4.2 0 0 1 4.2 4.2v9.6A4.2 4.2 0 0 1 16.8 21H7.2A4.2 4.2 0 0 1 3 16.8V7.2A4.2 4.2 0 0 1 7.2 3zm0 2.2A2 2 0 0 0 5.2 7.2v9.6a2 2 0 0 0 2 2h9.6a2 2 0 0 0 2-2V7.2a2 2 0 0 0-2-2H7.2z"/>
      </svg>
    )
  },
  {
    href: '/mural',
    title: 'Mural',
    description: 'Acompanhe lembrancas surgindo ao vivo durante a festa.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H8.8L4 21.5V6a2 2 0 0 1 2-2zm0 2v11l4-3.5h12V6H6z"/>
      </svg>
    )
  },
  {
    href: '/etiqueta',
    title: 'Etiqueta',
    description: 'Dicas curtas para curtir cada momento com leveza.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
        <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5.2-7 13-7 13S5 14.2 5 9a7 7 0 0 1 7-7zm0 2.2A4.8 4.8 0 0 0 7.2 9c0 2.9 3.2 7.6 4.8 9.7 1.6-2.1 4.8-6.8 4.8-9.7A4.8 4.8 0 0 0 12 4.2z"/>
      </svg>
    )
  }
];

export default function HomePage() {
  return (
    <main className="romantic-shell">
      <div className="hero-haze" />

      <section className="romantic-panel mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 sm:px-8 sm:py-10">
        <div className="relative overflow-hidden rounded-[30px] border border-[#e7e1d4] bg-white/85 p-6 sm:p-9">
          <div className="pointer-events-none absolute -left-8 -top-10 h-36 w-36 rounded-full bg-[#c9b37e]/15 blur-2xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-36 w-36 rounded-full bg-[#6f8475]/15 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4 text-center lg:max-w-3xl lg:text-left">
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold/70 bg-white/80 font-serifRomance text-3xl tracking-[0.14em] text-wine shadow-[0_14px_34px_rgba(34,53,44,0.08)] lg:mx-0">
                A &amp; N
              </div>
              <p className="text-sm uppercase tracking-[0.34em] text-wine/70">3 de maio de 2026</p>
              <h1 className="text-5xl leading-none text-cocoa sm:text-7xl">André &amp; Nathália</h1>
              <p className="max-w-2xl text-sm leading-7 text-wine/80 sm:text-base">
                Um único lugar para acompanhar o cronograma, localizar a mesa, se orientar no salão, consultar o cardápio e publicar lembranças ao vivo.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-1 lg:justify-start">
                <Link href="/mesa" className="btn btn--primary">
                  Encontrar minha mesa
                </Link>
                <Link href="/roteiro" className="btn btn--outline">
                  Ver roteiro do dia
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-roseDeep/15 bg-ivory/70 p-5 shadow-[0_14px_32px_rgba(34,53,44,0.06)] lg:w-[360px]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wine/55">Feito com carinho para nossos convidados</p>
              <p className="mt-3 text-sm leading-7 text-wine/80">
                Reunimos aqui os acessos essenciais do pré-festa ao último brinde, com navegação simples e rápida.
              </p>
              <div className="mt-4 rounded-2xl border border-[#d7cebc] bg-white/75 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wine/55">Lista de presentes</p>
                <p className="mt-2 text-sm leading-6 text-wine/80">A lista oficial está no nosso site principal.</p>
                <a
                  href="https://andrenathalia03052026.site/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center rounded-full border border-wine/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-wine transition hover:border-wine hover:bg-ivory"
                >
                  Ver lista de presentes
                </a>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-4 text-center md:text-left">
            <p className="text-xs uppercase tracking-[0.24em] text-wine/55">Acessos rápidos</p>
            <h2 className="mt-2 text-3xl sm:text-4xl">Tudo à mão em poucos toques</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickAccess.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[24px] border border-roseDeep/15 bg-white/85 p-5 shadow-[0_14px_30px_rgba(34,53,44,0.07)] transition hover:-translate-y-0.5 hover:border-gold/80 hover:bg-white"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4efe3] text-wine transition group-hover:bg-[#e9dec8]">
                {item.icon}
              </div>
              <h3 className="mt-4 text-2xl text-cocoa">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-wine/80">{item.description}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-wine group-hover:text-cocoa">Abrir agora</span>
            </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[26px] border border-[#e4ddce] bg-[#fffdfa]/90 p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-wine/55">Antes e durante a festa</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Fluxo recomendado para os convidados</h2>
            </div>
            <div className="inline-flex items-center rounded-full border border-[#d8cfbc] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-wine/70">
              Roteiro → Mesa → Mapa → Cardápio → Instacasamento → Mural → Etiqueta
            </div>
          </div>
        </section>

        <GuestJourney currentPath="/" />
      </section>
    </main>
  );
}
