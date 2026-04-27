import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const MENU_FALLBACK = {
  heroTitle: 'Bar Energy',
  heroSubtitle: '6 drinks alcoólicos, 4 drinks não alcoólicos e 5 tipos de frutas para caipirinha',
  secoes: [
    {
      id: 'alcoolicos',
      title: 'Drinks alcoólicos',
      subtitle: '',
      items: [
        { name: 'Gin Tônica', description: 'gin, água tônica, suco de limão e gelo' },
        { name: 'Poker Face', description: 'vodka, suco de abacaxi, licor de pêssego fino e flocos de gelo' },
        { name: 'Mojito', description: 'rum, limão, pétalas de hortelã e soda' },
        { name: 'Screw Driver', description: 'vodka, limão, suco de laranja e flocos de gelo' },
        { name: 'Piña Colada', description: 'rum, leite de coco, abacaxi e leite condensado' },
        { name: 'Sexy on The Beach', description: 'vodka, suco de pêssego, suco de laranja e groselha' },
      ]
    },
    {
      id: 'caipirinhas',
      title: 'Caipirinhas',
      subtitle: 'Frutas: morango, melancia, abacaxi, limão e uva',
      items: [
        { name: 'Caipirinha', description: 'cachaça com frutas' },
        { name: 'Saquerinha', description: 'saké com frutas' },
        { name: 'Caipiroska', description: 'vodka com frutas' },
      ]
    },
    {
      id: 'caipirinhas-gourmet',
      title: 'Caipirinhas gourmet',
      subtitle: 'Especiarias: pimenta rosa, gengibre, hortelã e cravo-da-índia',
      items: [
        { name: 'Combinações especiais', description: 'Além das caipirinhas tradicionais à base de cachaça, vodka e saké, deixaremos à disposição dos convidados combinações com diversas frutas, especiarias e bebidas, criando sabores inusitados e experiências únicas.' },
      ]
    },
    {
      id: 'nao-alcoolicos',
      title: 'Drinks não alcoólicos',
      subtitle: '',
      items: [
        { name: 'Mojito Fresh', description: 'pétalas de hortelã, suco de limão, açúcar e soda' },
        { name: 'Summer', description: 'frutas variadas, suco de laranja e groselha' },
        { name: 'Sunset On The Beach', description: 'suco de pêssego, suco de laranja e groselha' },
        { name: 'Smoothie', description: 'melancia, suco de pêssego e groselha' },
      ]
    },
    {
      id: 'marcas',
      title: 'Marcas',
      subtitle: '',
      items: [
        { name: 'Vodka', description: 'Smirnoff' },
        { name: 'Sakê', description: 'Saheki / Fuji / Sakai' },
        { name: 'Cachaça', description: 'Velho Barreiro' },
        { name: 'Rum', description: 'Montilla' },
        { name: 'Sucos', description: 'Sufresh / Maguary / Maratá' },
        { name: 'Gin', description: "Seager's" },
        { name: 'Água Tônica', description: 'Antarctica / Schweppes / Dillars Classic / Vital Gold' },
        { name: 'Licor/Xarope', description: 'Stock / Monin / Marie Brizard / Fórmula / Parcierir / Kally' },
      ]
    },
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