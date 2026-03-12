import Link from 'next/link';

const quickLinks = [
  {
    href: '/fotos',
    title: 'Cabine de Fotos',
    description: 'Capture a foto, escolha o filtro e publique no mural do casamento.'
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
          <p className="text-sm uppercase tracking-[0.3em] text-wine/70">André & Nathália</p>
          <h1 className="text-5xl leading-none sm:text-7xl">Cabine Digital & Mural ao Vivo</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-wine/75 sm:text-base">
            Acesse rapidamente as experiências principais do casamento e use o menu extra quando precisar consultar o cardápio da festa.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="romantic-panel group p-6 transition hover:-translate-y-0.5 hover:bg-white">
              <p className="text-xs uppercase tracking-[0.25em] text-wine/55">Rota pronta</p>
              <h2 className="mt-3 text-3xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-wine/72">{item.description}</p>
              <span className="mt-5 inline-flex text-sm font-semibold text-wine group-hover:text-cocoa">Abrir agora</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
