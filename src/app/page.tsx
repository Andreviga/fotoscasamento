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
    <main className="romantic-shell pb-10">
      <div className="hero-haze" />

      <section className="gift-inspired-wrap mx-auto w-full max-w-[1100px] space-y-5 sm:space-y-7">
        <header className="gift-hero-panel text-center">
          <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full border border-gold/70 bg-white text-2xl tracking-[0.14em] text-wine shadow-[0_10px_24px_rgba(34,53,44,0.08)] sm:h-24 sm:w-24 sm:text-3xl">
            A &amp; N
          </div>
          <h1 className="text-[clamp(2.2rem,8vw,4.5rem)] leading-none">André &amp; Nathália</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.32em] text-wine/70 sm:text-sm">3 de maio de 2026</p>
          <div className="gift-divider mx-auto mt-4" />

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-wine/80 sm:text-base">
            Um único lugar para acompanhar o cronograma, localizar a mesa, se orientar no salão, consultar o cardápio e publicar lembranças ao vivo.
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-wine/75">Feito com carinho para nossos convidados.</p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:mx-auto sm:max-w-[520px] sm:grid-cols-2">
            <Link href="/mesa" className="btn btn--primary w-full">
              Encontrar minha mesa
            </Link>
            <Link href="/roteiro" className="btn btn--outline w-full">
              Ver roteiro do dia
            </Link>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.45fr_0.9fr]">
          <div className="rounded-[18px] border border-[#e8e3d7] bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] sm:p-5">
            <div className="mb-4 text-center sm:text-left">
              <p className="text-xs uppercase tracking-[0.24em] text-wine/55">Acesso rápido</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Tudo à mão em poucos toques</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {quickAccess.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group rounded-[14px] border border-[#e8e3d7] bg-[#fffdfa] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:border-gold/80"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f1e8] text-wine transition group-hover:bg-[#eee5d5]">
                    {item.icon}
                  </div>
                  <h3 className="mt-3 text-xl text-cocoa">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-wine/80">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-[18px] border border-[#e8e3d7] bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)] sm:p-5">
            <h2 className="text-3xl sm:text-[2rem]">Lista de presentes</h2>
            <p className="mt-2 text-sm leading-7 text-wine/80">A página oficial de presentes está no site principal do casal.</p>
            <a
              href="https://andrenathalia03052026.site/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center rounded-[12px] border border-gold/60 bg-[#f7f1e3] px-4 py-3 text-sm font-semibold text-cocoa transition hover:bg-[#efe5d1]"
            >
              Abrir lista de presentes
            </a>

            <div className="mt-5 rounded-[14px] border border-[#eadfca] bg-[#faf7f0] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-wine/60">Fluxo recomendado</p>
              <p className="mt-2 text-sm leading-7 text-wine/80">
                Roteiro, Mesa, Mapa, Cardápio, Instacasamento, Mural e Etiqueta para aproveitar cada momento sem perder nada.
              </p>
            </div>
          </aside>
        </section>

        <GuestJourney
          currentPath="/"
          subtitle="Navegação clara e consistente para os convidados acessarem tudo antes e durante a festa."
        />
      </section>
    </main>
  );
}
