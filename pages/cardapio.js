import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import GuestJourney from '../components/GuestJourney';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

export default function CardapioPage() {
  const { loading, error, data } = useConfig(['site', 'cardapio']);
  const heroTitle = data?.cardapio?.heroTitle || 'Cardapio Digital da Festa';
  const heroSubtitle = data?.cardapio?.heroSubtitle || 'Uma selecao pensada com carinho para tornar essa noite ainda mais inesquecivel.';
  const menuSections = Array.isArray(data?.cardapio?.secoes) ? data.cardapio.secoes : [];
  return (
    <>
      <Head>
        <title>Cardápio Digital ✿ André & Nathália</title>
        <meta
          name="description"
          content="Cardápio digital da noite com entradas, pratos principais, sobremesas e bebidas."
        />
      </Head>

      <WeddingHeader />

      <main className="main" id="cardapio">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <section className="menu-hero page-section">
            <div className="section-header">
              <span className="section-kicker">André & Nathália</span>
              <h1>{heroTitle}</h1>
              <p className="section-subtitle">
                {heroSubtitle}
              </p>
            </div>
          </section>

          {loading ? <LoadingSpinner label="Carregando cardapio" /> : null}
          {!loading && error ? <div className="romantic-panel p-5 text-sm text-red-700">{error}</div> : null}

          {!loading && !error ? (
            <section className="menu-sections page-section">
              {menuSections.map((section) => (
                <article key={section.id || section.title} className="menu-card">
                  <header className="menu-card__header">
                    <h2>{section.title}</h2>
                    <p>{section.subtitle}</p>
                  </header>

                  <ul className="menu-list">
                    {(section.items || []).map((item) => (
                      <li key={`${section.id || section.title}-${item.name}`} className="menu-list__item">
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          ) : null}

          <div className="mt-8">
            <GuestJourney
              currentPath="/cardapio"
              compact
              title="Continue pelo guia da festa"
              subtitle="Do cardapio voce pode seguir para sua mesa, ver o mapa do salao ou publicar uma foto no mural."
            />
          </div>
        </div>
      </main>

      <WeddingFooter />
    </>
  );
}