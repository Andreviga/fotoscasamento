import Head from 'next/head';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import GuestJourney from '../components/GuestJourney';

const MENU_SECTIONS = [
  {
    id: 'entradas',
    title: 'Entradas',
    subtitle: 'Para abrir a noite com leveza e sabor',
    items: [
      {
        name: 'Bruschetta de Tomate Confit e Manjericão',
        description: 'Pão artesanal tostado, tomate confit, azeite extra virgem e folhas frescas.'
      },
      {
        name: 'Mini Quiche de Alho-Poró',
        description: 'Massa amanteigada com recheio cremoso de alho-poró e queijo suave.'
      },
      {
        name: 'Ceviche Tropical',
        description: 'Peixe fresco marinado com limão, cebola roxa, manga e coentro.'
      }
    ]
  },
  {
    id: 'prato-principal',
    title: 'Prato Principal',
    subtitle: 'Escolhas preparadas para celebrar em grande estilo',
    items: [
      {
        name: 'Filé Mignon ao Molho de Vinho',
        description: 'Servido com risoto de parmesão e crocante de alho-poró.'
      },
      {
        name: 'Salmão Grelhado com Ervas',
        description: 'Acompanhado de purê de mandioquinha e legumes tostados.'
      },
      {
        name: 'Ravioli de Cogumelos (Vegetariano)',
        description: 'Massa fresca ao molho de manteiga de sálvia e nozes torradas.'
      }
    ]
  },
  {
    id: 'sobremesas',
    title: 'Sobremesas',
    subtitle: 'Doces memórias para fechar o jantar',
    items: [
      {
        name: 'Mousse de Chocolate Belga',
        description: 'Textura aerada com raspas de chocolate meio amargo.'
      },
      {
        name: 'Panna Cotta de Baunilha',
        description: 'Coberta com calda de frutas vermelhas e crocante de amêndoas.'
      },
      {
        name: 'Mini Tartelette de Limão Siciliano',
        description: 'Base crocante, creme cítrico e merengue maçaricado.'
      }
    ]
  },
  {
    id: 'cocktails',
    title: 'Bar de Cocktails',
    subtitle: 'Drinks autorais e clássicos para brindar',
    items: [
      {
        name: 'French 75',
        description: 'Gin, suco de limão, xarope de açúcar e espumante brut.'
      },
      {
        name: 'Moscow Mule da Casa',
        description: 'Vodka, espuma de gengibre, limão e toque de hortelã.'
      },
      {
        name: 'Negroni Sbagliato',
        description: 'Vermouth rosso, bitter e espumante para um final elegante.'
      }
    ]
  },
  {
    id: 'nao-alcoolicas',
    title: 'Bebidas Não Alcoólicas',
    subtitle: 'Opções refrescantes para todos os convidados',
    items: [
      {
        name: 'Águas Aromatizadas',
        description: 'Sabores de limão siciliano com alecrim e frutas vermelhas com hortelã.'
      },
      {
        name: 'Mocktail de Maracujá',
        description: 'Polpa natural, cítricos frescos e espuma leve de gengibre.'
      },
      {
        name: 'Sucos Naturais',
        description: 'Laranja, abacaxi com hortelã e melancia preparados na hora.'
      }
    ]
  }
];

export default function CardapioPage() {
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
        <div className="container">
          <section className="menu-hero">
            <div className="section-header">
              <span className="section-kicker">André & Nathália</span>
              <h1>Cardápio Digital da Festa</h1>
              <p className="section-subtitle">
                Uma seleção pensada com carinho para tornar essa noite ainda mais inesquecível.
              </p>
            </div>
          </section>

          <section className="menu-sections">
            {MENU_SECTIONS.map((section) => (
              <article key={section.id} className="menu-card">
                <header className="menu-card__header">
                  <h2>{section.title}</h2>
                  <p>{section.subtitle}</p>
                </header>

                <ul className="menu-list">
                  {section.items.map((item) => (
                    <li key={item.name} className="menu-list__item">
                      <h3>{item.name}</h3>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

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