import Link from 'next/link';
// @ts-expect-error legacy JS component without local declaration file
import Header from '../../components/Header';
import Countdown from '../components/Countdown';
import MiniTimeline from '../components/MiniTimeline';
import TabBar from '../components/TabBar';

// PALETA EXTRAIDA DO PROJETO
// --color-primary:      #0f4f3d (wine)
// --color-secondary:    #c9b37e (gold)
// --color-background:   #fbfaf7 (ivory)
// --color-foreground:   #22352c (cocoa)
// --color-accent:       #6f8475 (roseDeep)
// --color-muted:        #cfdacd (rose)
// --font-heading:       var(--font-romance), Cormorant Garamond, serif
// --font-body:          var(--font-clean), DM Sans, sans-serif

const GRID_LINKS = [
  {
    href: '/roteiro',
    title: 'Roteiro do dia',
    subtitle: 'Horarios e momentos',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm13 8H4v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8z" />
      </svg>
    )
  },
  {
    href: '/mapa',
    title: 'Mapa do salao',
    subtitle: 'Orientacao no espaco',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M9.6 4.2a1 1 0 0 1 .8 0l4.2 1.8 4-1.7A1 1 0 0 1 20 5.2v13.6a1 1 0 0 1-.6.92l-4.8 2a1 1 0 0 1-.8 0l-4.2-1.8-4 1.7A1 1 0 0 1 4 20.8V7.2a1 1 0 0 1 .6-.92zM10 6.5v11l4 1.7v-11l-4-1.7z" />
      </svg>
    )
  },
  {
    href: '/fotos',
    title: 'Instacasamento',
    subtitle: 'Fotos com filtros',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M9 5a2 2 0 0 1 1.6-.8h2.8A2 2 0 0 1 15 5l.6 1H19a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3.4L9 5zm3 3.2A4.8 4.8 0 1 0 12 18a4.8 4.8 0 0 0 0-9.8z" />
      </svg>
    )
  },
  {
    href: '/mural',
    title: 'Mural ao vivo',
    subtitle: 'Fotos em tempo real',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8.8L4 21V6a2 2 0 0 1 2-2zm0 2v10l4-3.2h12V6H4z" />
      </svg>
    )
  }
];

const FOOTER_LINKS = [
  { href: '/roteiro', label: 'Roteiro' },
  { href: '/mesa', label: 'Mesa' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/cardapio', label: 'Cardapio' },
  { href: '/fotos', label: 'Fotos' }
];

export default function HomePage() {
  return (
    <>
      <div className="hidden sm:block">
        <Header />
      </div>

      <main className="main pb-24 sm:pb-10">
        <div className="hero-haze" />
        <section className="container relative z-10 space-y-4">
          <header className="romantic-panel bg-ivory p-5 text-center sm:p-8">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold text-2xl tracking-[0.12em] text-gold sm:h-24 sm:w-24 sm:text-3xl">
              A&amp;N
            </div>

            <h1 className="mt-4 text-4xl text-cocoa sm:text-5xl">André &amp; Nathália</h1>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-roseDeep/75 sm:text-sm">3 de maio de 2026</p>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-cocoa/85 sm:text-base">
              Um único lugar para acompanhar o cronograma, localizar a mesa, se orientar no salão, consultar o cardápio e publicar lembranças ao vivo.
            </p>

            <div className="mt-5">
              <Countdown targetDate="2026-05-03T17:00:00-03:00" />
            </div>

            <div className="mx-auto mt-6 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              <Link href="/mesa" className="btn btn--primary w-full" aria-label="Encontrar minha mesa">
                Encontrar minha mesa
              </Link>
              <Link href="/roteiro" className="btn btn--outline w-full border-gold text-gold" aria-label="Ver roteiro do dia">
                Ver roteiro do dia
              </Link>
            </div>
          </header>

          <Link
            href="/mesa"
            className="block rounded-3xl bg-gold p-5 text-cocoa shadow-soft transition hover:brightness-95"
            aria-label="Abrir busca de mesa"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em]">Encontrar minha mesa</p>
                <p className="mt-1 text-sm text-cocoa/80">Digite seu nome e descubra onde você está sentado</p>
              </div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cocoa/20 bg-ivory/55 text-xl">→</span>
            </div>
          </Link>

          <section className="rounded-2xl border border-roseDeep/20 bg-linen/70 px-4 py-3 text-center text-sm text-cocoa/85">
            <span className="font-semibold text-gold">◆</span> Festa: 17h · Cerimônia: 18h pontualmente · Chegue 20min antes
          </section>

          <section className="romantic-panel p-4 sm:p-6">
            <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
              {GRID_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-roseDeep/20 bg-white/85 p-4 transition hover:bg-linen/70"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linen text-wine">{item.icon}</span>
                  <h2 className="mt-2 text-lg text-cocoa">{item.title}</h2>
                  <p className="mt-1 text-xs uppercase tracking-[0.08em] text-roseDeep/80">{item.subtitle}</p>
                </Link>
              ))}
            </div>

            <div className="mt-4 text-center text-sm text-cocoa/80">
              <Link href="/cardapio" className="font-semibold text-wine hover:text-cocoa">Cardapio</Link>
              <span className="mx-2 text-gold/70">·</span>
              <Link href="/etiqueta" className="font-semibold text-wine hover:text-cocoa">Etiqueta</Link>
              <span className="mx-2 text-gold/70">·</span>
              <a
                href="https://andrenathalia03052026.site/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-wine hover:text-cocoa"
              >
                Lista de presentes
              </a>
            </div>
          </section>

          <MiniTimeline />

          <footer className="rounded-2xl border border-roseDeep/20 bg-white/80 px-4 py-5 text-center">
            <p className="text-sm text-cocoa">André &amp; Nathália · 03 de maio de 2026</p>
            <nav className="mt-3 flex flex-wrap items-center justify-center gap-2" aria-label="Atalhos finais">
              {FOOTER_LINKS.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-roseDeep/20 px-3 py-1 text-xs font-semibold text-wine hover:bg-linen/70">
                  {item.label}
                </Link>
              ))}
            </nav>
          </footer>
        </section>
      </main>

      <TabBar />
    </>
  );
}
