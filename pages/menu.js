import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const MENU_FALLBACK = {
  heroTitle: 'Menu da Celebração',
  heroSubtitle: 'Uma seleção pensada com carinho para tornar essa noite ainda mais inesquecível.',
  secoes: [
    { id: 'recepcao', title: 'Recepção', subtitle: 'Boas-vindas', items: [{ name: 'Welcome drink', description: '' }, { name: 'Canapés de boas-vindas', description: '' }] },
    { id: 'jantar', title: 'Jantar', subtitle: '', items: [{ name: 'Buffet completo com opções quentes e frias', description: '' }, { name: 'Opções vegetarianas disponíveis', description: '' }] },
    { id: 'sobremesa', title: 'Sobremesa', subtitle: '', items: [{ name: 'Bolo dos noivos', description: '' }, { name: 'Bem-casados', description: '' }, { name: 'Mesa de doces', description: '' }] },
    { id: 'bebidas', title: 'Bebidas', subtitle: '', items: [{ name: 'Espumante para o brinde', description: '' }, { name: 'Vinhos', description: '' }, { name: 'Sucos naturais', description: '' }, { name: 'Refrigerantes', description: '' }, { name: 'Água', description: '' }] },
  ],
};

export default function MenuPage() {
  const { loading, error, data } = useConfig(['site', 'menu']);
  const weddingDate = data?.site?.data_casamento || '03 de maio de 2026';
  const heroTitle = data?.menu?.heroTitle || MENU_FALLBACK.heroTitle;
  const heroSubtitle = data?.menu?.heroSubtitle || MENU_FALLBACK.heroSubtitle;
  const menuSections = Array.isArray(data?.menu?.secoes) && data.menu.secoes.length > 0
    ? data.menu.secoes
    : MENU_FALLBACK.secoes;
  return (
    <>
      <Head>
        <title>Menu — André & Nathália</title>
        <meta
          name="description"
          content="Menu digital da noite com entradas, pratos principais, sobremesas e bebidas."
        />
      </Head>

      <WeddingHeader />

      <main className="main" id="menu">
        <div className="hero-haze" />
        <div className="container relative z-10">
          <section className="menu-hero page-section">
            <div className="menu-hero--wedding">
              <p className="menu-hero__date">{weddingDate}</p>
              <div className="menu-hero__ornament" aria-hidden="true">✦ ✿ ✦</div>
              <div className="section-header">
                <span className="section-kicker">André & Nathália</span>
                <h1>{heroTitle}</h1>
                <p className="section-subtitle">
                  {heroSubtitle}
                </p>
              </div>
              <div className="menu-hero__divider" aria-hidden="true" />
              <p className="menu-hero__signature">Com carinho, preparado para a nossa noite</p>
            </div>
          </section>

          {loading ? <LoadingSpinner label="Carregando menu" /> : null}
          {!loading && error ? <div className="romantic-panel p-5 text-sm text-red-700">{error}</div> : null}

          {!loading && !error ? (
            <section className="menu-sections page-section">
              {menuSections.map((section, index) => (
                <article key={section.id || section.title} className="menu-card menu-card--wedding">
                  <header className="menu-card__header">
                    <p className="menu-card__course">Etapa {String(index + 1).padStart(2, '0')}</p>
                    <h2>{section.title}</h2>
                    {section.subtitle ? <p>{section.subtitle}</p> : null}
                  </header>

                  <ul className="menu-list">
                    {(section.items || []).map((item) => (
                      <li key={`${section.id || section.title}-${item.name}`} className="menu-list__item">
                        <div className="menu-list__item-title">{item.name}</div>
                        {item.description ? <p className="menu-list__item-description">{item.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </section>
          ) : null}

          {!loading ? (
            <div className="menu-note">
              <p>
                Em caso de restrições alimentares, avise a equipe de recepção.
              </p>
            </div>
          ) : null}
        </div>
      </main>

      <WeddingFooter />
    </>
  );
}