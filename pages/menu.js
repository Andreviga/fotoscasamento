import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const MENU_FALLBACK = {
  heroTitle: 'Cardapio & Bebidas',
  heroSubtitle: 'Menu Bellagio, bebidas do buffet e Bar Energy com as selecoes da noite',
  secoes: [
    {
      id: 'coquetel-frio',
      group: 'cardapio',
      title: 'Coquetel frio',
      subtitle: '',
      items: [
        { name: 'Blinis com salmao', description: '' },
        { name: 'Conne siciliano', description: '' },
        { name: 'Polenta com pesto e linguica artesanal', description: '' },
      ]
    },
    {
      id: 'coquetel-quente',
      group: 'cardapio',
      title: 'Coquetel quente',
      subtitle: '',
      items: [
        { name: 'Pastelzinho com caldo de cana', description: '' },
        { name: 'Coxinha a la creme', description: '' },
        { name: 'Panceta sensacao', description: '' },
        { name: 'Queijo coalho com mel de laranjeira', description: '' },
        { name: 'Ourico de queijo', description: '' },
        { name: 'Damasco brulee', description: '' },
        { name: 'Wantan de camarao', description: '' },
      ]
    },
    {
      id: 'finger-foods',
      group: 'cardapio',
      title: 'Finger foods',
      subtitle: '',
      items: [
        { name: 'Camarao com creme de queijo e palmito', description: '' },
        { name: 'Mignon na fonduta de queijo', description: '' },
      ]
    },
    {
      id: 'jantar',
      group: 'cardapio',
      title: 'Jantar',
      subtitle: '',
      items: [
        { name: 'Verdes nobres, bacon crispy e croutons', description: '' },
        { name: 'Molho de mostarda e mel', description: '' },
        { name: 'Arroz com crispy de alho-poro', description: '' },
        { name: 'Batata rustica na paprika e alecrim', description: '' },
        { name: 'Penne ao molho tartufato', description: '' },
        { name: 'Cupim ao demi-glace de alecrim', description: '' },
      ]
    },
    {
      id: 'sobremesa',
      group: 'cardapio',
      title: 'Sobremesa',
      subtitle: '',
      items: [
        { name: 'Cocada cremosa com abacaxi e fitas de coco', description: '' },
        { name: 'Bolo de doce de leite com nozes', description: '' },
      ]
    },
    {
      id: 'lanchinho-encerramento',
      group: 'cardapio',
      title: 'Lanchinho & encerramento',
      subtitle: '',
      items: [
        { name: 'Mini hamburguinho', description: '' },
        { name: 'Cafe, cha e palmier', description: '' },
        { name: 'Tirinhas de laranja', description: '' },
        { name: 'Balas de coco', description: '' },
      ]
    },
    {
      id: 'nao-alcoolicas-buffet',
      group: 'bebidas-buffet',
      title: 'Nao alcoolicas',
      subtitle: '',
      items: [
        { name: 'Agua com e sem gas', description: '' },
        { name: 'Agua aromatizada na cerimonia', description: '' },
        { name: 'Sucos de uva e laranja', description: '' },
        { name: 'Refrigerantes normais e diet - Coca e Guarana', description: '' },
      ]
    },
    {
      id: 'cervejas',
      group: 'bebidas-buffet',
      title: 'Cervejas',
      subtitle: '',
      items: [
        { name: 'Original', description: '' },
        { name: 'Brahma Zero', description: '' },
      ]
    },
    {
      id: 'bar-buffet',
      group: 'bebidas-buffet',
      title: 'Bar',
      subtitle: '',
      items: [
        { name: 'Bartender Energy', description: '' },
      ]
    },
    {
      id: 'encerramento-buffet',
      group: 'bebidas-buffet',
      title: 'Encerramento',
      subtitle: '',
      items: [
        { name: 'Cafe', description: '' },
        { name: 'Cha', description: '' },
        { name: 'Palmier', description: '' },
        { name: 'Tirinhas de laranja', description: '' },
        { name: 'Balas de coco', description: '' },
      ]
    },
    {
      id: 'alcoolicos',
      group: 'bar-energy',
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
      group: 'bar-energy',
      title: 'Caipirinhas',
      subtitle: 'Frutas: morango, melancia, abacaxi, limão e uva',
      items: [
        { name: 'Caipirinha', description: 'cachaça com frutas' },
        { name: 'Saquerinha', description: 'saké com frutas' },
        { name: 'Caipiroska', description: 'vodka com frutas' },
      ]
    },
    {
      id: 'especiarias-gourmet',
      group: 'bar-energy',
      title: 'Especiarias gourmet',
      subtitle: '',
      items: [
        { name: 'Pimenta rosa, gengibre, hortelã e cravo-da-índia', description: 'As especiarias são usadas para dar um toque suave e específico à caipirinha, deixando o sabor mais exótico ao paladar.' },
      ]
    },
    {
      id: 'caipirinhas-gourmet',
      group: 'bar-energy',
      title: 'Caipirinhas gourmet',
      subtitle: '',
      items: [
        { name: 'Combinações especiais', description: 'Além de servirmos as caipirinhas tradicionais à base de cachaça, vodka e sakê, deixaremos à disposição dos convidados combinações com diversas frutas, especiarias e bebidas. Temos uma infinidade de possibilidades para criarmos sabores inusitados e experiências únicas.' },
      ]
    },
    {
      id: 'nao-alcoolicos',
      group: 'bar-energy',
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
      id: 'assinatura',
      group: 'bar-energy',
      title: 'Bar Energy',
      subtitle: 'Coquetelaria autoral para brindar a nossa noite',
      items: []
    }
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
  const GROUP_META = {
    cardapio: {
      eyebrow: '01',
      title: 'Cardápio',
      subtitle: 'Menu Bellagio'
    },
    'bebidas-buffet': {
      eyebrow: '02',
      title: 'Bebidas',
      subtitle: 'Bebidas do buffet e cerimônia'
    },
    'bar-energy': {
      eyebrow: '03',
      title: 'Bar Energy',
      subtitle: 'Drinks e coquetelaria da noite'
    }
  };
  const groupedSections = menuSections.reduce((acc, section) => {
    const key = section.group || 'outros';
    const lastGroup = acc[acc.length - 1];

    if (!lastGroup || lastGroup.key !== key) {
      acc.push({ key, sections: [section] });
      return acc;
    }

    lastGroup.sections.push(section);
    return acc;
  }, []);

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
              <p className="menu-hero__monogram">A <span>&amp;</span> N</p>
              <div className="menu-hero__divider" aria-hidden="true" />
              <p className="menu-hero__names">André <span>&amp;</span> Nathália</p>
              <div className="menu-hero__divider" aria-hidden="true" />
              <p className="menu-hero__title">{heroTitle}</p>
              <p className="menu-hero__subtitle">{heroSubtitle}</p>
              <p className="menu-hero__signature">Com carinho, preparado para a nossa noite</p>
            </div>
          </section>

          {loading ? <LoadingSpinner label="Carregando menu" /> : null}
          {!loading && error ? <div className="romantic-panel p-5 text-sm text-red-700">{error}</div> : null}

          {!loading && !error ? (
            <section className="menu-papers page-section">
              {groupedSections.map((group) => {
                const meta = GROUP_META[group.key] || {
                  eyebrow: '00',
                  title: group.key,
                  subtitle: ''
                };

                return (
                  <article key={group.key} className="menu-paper">
                    <header className="menu-paper__header">
                      <p className="menu-paper__eyebrow">{meta.eyebrow}</p>
                      <div className="menu-paper__rule" aria-hidden="true" />
                      <h2>{meta.title}</h2>
                      {meta.subtitle ? <p className="menu-paper__subtitle">{meta.subtitle}</p> : null}
                    </header>

                    <div className={`menu-paper__grid ${group.key === 'bar-energy' ? 'menu-paper__grid--bar' : ''}`}>
                      {group.sections.map((section) => (
                        <section key={section.id || section.title} className="menu-block">
                          <header className="menu-block__header">
                            <h3>{section.title}</h3>
                            {section.subtitle ? <p>{section.subtitle}</p> : null}
                          </header>

                          {(section.items || []).length > 0 ? (
                            <ul className="menu-block__list">
                              {section.items.map((item) => (
                                <li key={`${section.id || section.title}-${item.name}`} className="menu-block__item">
                                  <div className="menu-block__item-title">{item.name}</div>
                                  {item.description ? <p className="menu-block__item-description">{item.description}</p> : null}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </section>
                      ))}
                    </div>

                    <footer className="menu-paper__footer">Com carinho, André & Nathália</footer>
                  </article>
                );
              })}
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