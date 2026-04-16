import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const CARDAPIO_FALLBACK = {
  heroTitle: 'Cardápio Digital da Festa',
  heroSubtitle: 'Uma seleção pensada com carinho para tornar essa noite ainda mais inesquecível.',
  secoes: [
    { id: 'recepcao', title: 'Recepção', subtitle: '', items: [{ name: 'Welcome drink', description: '' }, { name: 'Can apés de boas-vindas', description: '' }] },
    { id: 'jantar', title: 'Jantar', subtitle: '', items: [{ name: 'Buffet completo com opções quentes e frias', description: '' }, { name: 'Opções vegetarianas disponíveis', description: '' }] },
    { id: 'sobremesa', title: 'Sobremesa', subtitle: '', items: [{ name: 'Bolo dos noivos', description: '' }, { name: 'Bem-casados', description: '' }, { name: 'Mesa de doces', description: '' }] },
    { id: 'bebidas', title: 'Bebidas', subtitle: '', items: [{ name: 'Espumante para o brinde', description: '' }, { name: 'Vinhos', description: '' }, { name: 'Sucos naturais', description: '' }, { name: 'Refrigerantes', description: '' }, { name: 'Água', description: '' }] },
  ],
};

export default function CardapioPage() {
  const { loading, error, data } = useConfig(['site', 'cardapio']);
  const heroTitle = data?.cardapio?.heroTitle || CARDAPIO_FALLBACK.heroTitle;
  const heroSubtitle = data?.cardapio?.heroSubtitle || CARDAPIO_FALLBACK.heroSubtitle;
  const menuSections = Array.isArray(data?.cardapio?.secoes) && data.cardapio.secoes.length > 0
    ? data.cardapio.secoes
    : CARDAPIO_FALLBACK.secoes;
  return (
    <>
      <Head>
        <title>Cardápio — André & Nathália</title>
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
        </div>
      </main>

      <WeddingFooter />
    </>
  );
}