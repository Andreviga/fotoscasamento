import { getAdminDb } from './firebaseAdmin';

const DEFAULT_SITE = {
  titulo_site: 'Casamento André & Nathália',
  nome_noivos: 'André & Nathália',
  data_casamento: '03 de maio de 2026',
  local_cerimonia: 'Cerimônia - a confirmar',
  local_recepcao: 'Recepção - a confirmar',
  info_data: '03 de maio de 2026 — Domingo',
  info_local: 'Espaço Vdara — Sítio São Jorge, São Bernardo do Campo',
  info_horario: 'Festa: 16h · Cerimônia: 18h (pontual)',
  info_traje: 'Esporte fino. Evite branco, creme ou tons da noiva.',
  info_estacionamento: 'Verifique a orientação da equipe no local.',
  mensagem_boas_vindas: 'Sejam bem-vindos ao nosso grande dia. Que alegria ter você aqui!',
  hashtag: '#CasamentoAndreENathalia',
  pix_key: '',
  contato_emergencia: ''
};

const DEFAULT_APPEARANCE = {
  paleta: 'dourado_branco',
  logo_url: '',
  mostrar_outros_na_mesa: true,
  paletas: {
    dourado_branco: {
      primario: '#C9A96E',
      secundario: '#F5EDD6',
      fundo: '#FDFAF5',
      texto: '#2C2416',
      destaque: '#8B6914'
    },
    rosa_champagne: {
      primario: '#D8A7B1',
      secundario: '#F5E8E5',
      fundo: '#FEF8F7',
      texto: '#3C2A2E',
      destaque: '#B36A7A'
    },
    azul_prata: {
      primario: '#2F496E',
      secundario: '#DCE1E8',
      fundo: '#F7F9FC',
      texto: '#1E2530',
      destaque: '#8A96A8'
    }
  }
};

const DEFAULT_ROTEIRO = {
  itens: [
    { horario: '16:00', titulo: 'Chegada e Welcome Drink', descricao: 'Os convidados chegam e são recebidos com drinks de boas-vindas na varanda.', icone: '🥂', destaque: false },
    { horario: '17:30', titulo: 'Abertura das portas do salão', descricao: 'Convidados são convidados a se acomodar nas mesas.', icone: '🚪', destaque: false },
    { horario: '18:00', titulo: 'Entrada dos padrinhos', descricao: 'Cortejo dos padrinhos ao som da trilha escolhida.', icone: '🎻', destaque: true },
    { horario: '18:15', titulo: 'Entrada dos pais dos noivos', descricao: 'Momento especial com a família.', icone: '💛', destaque: true },
    { horario: '18:30', titulo: 'Entrada da noiva', descricao: 'O grande momento: entrada de Nathalia.', icone: '👰', destaque: true },
    { horario: '18:35', titulo: 'Cerimônia', descricao: 'Celebração do casamento civil e/ou religioso.', icone: '⛪', destaque: true },
    { horario: '19:00', titulo: 'Troca de alianças', descricao: 'O momento mais aguardado.', icone: '💍', destaque: true },
    { horario: '19:10', titulo: 'Primeiro beijo como casados', descricao: 'Celebrem com os noivos!', icone: '🎉', destaque: true },
    { horario: '19:15', titulo: 'Saída dos noivos e fotos', descricao: 'Sessão de fotos com família e padrinhos.', icone: '📸', destaque: false },
    { horario: '19:30', titulo: 'Abertura do buffet', descricao: 'Convidados são convidados a servir-se.', icone: '🍽️', destaque: false },
    { horario: '20:00', titulo: 'Brinde', descricao: 'Discurso dos padrinhos e brinde com espumante.', icone: '🥂', destaque: true },
    { horario: '20:30', titulo: 'Abertura da pista de dança', descricao: 'DJ/Banda dá início à festa.', icone: '🎶', destaque: true },
    { horario: '21:00', titulo: 'Hora do bolo', descricao: 'Corte do bolo pelos noivos.', icone: '🎂', destaque: true },
    { horario: '21:15', titulo: 'Bouquet da noiva', descricao: 'Arremesso do buquê.', icone: '💐', destaque: true },
    { horario: '23:00', titulo: 'Encerramento', descricao: 'Últimas músicas e despedida.', icone: '✨', destaque: false }
  ]
};

const DEFAULT_ETIQUETA = {
  secoes: [
    {
      titulo: 'Traje',
      icone: '👗',
      conteudo: 'Traje esporte fino. Pedimos gentilmente que as convidadas evitem vestidos brancos, creme ou na cor da noiva.'
    },
    {
      titulo: 'Cerimônia',
      icone: '🔕',
      conteudo: 'Solicitamos que durante a cerimônia os celulares fiquem no modo silencioso. Aguarde a noiva entrar antes de se sentar e evite passar na frente do fotógrafo e videomaker.'
    },
    {
      titulo: 'Presente',
      icone: '🎁',
      conteudo: 'Sua presença já é o nosso presente. Caso queira nos presentear, preferimos contribuições para nossa lista de casamento ou PIX.'
    },
    {
      titulo: 'Criancas',
      icone: '🧸',
      conteudo: 'Conteúdo configurável pelo admin.'
    },
    {
      titulo: 'Fotos e Redes Sociais',
      icone: '📱',
      conteudo: 'Adoramos ver as fotos de vocês. Usem nossa hashtag para compartilharmos os melhores momentos. Link do photobooth: /fotos'
    },
    {
      titulo: 'Estacionamento e Acesso',
      icone: '🚗',
      conteudo: 'Conteúdo configurável pelo admin.'
    }
  ]
};

const DEFAULT_MENU = {
  heroTitle: 'Menu & Bebidas',
  heroSubtitle: 'Bebidas do buffet e Bar Energy com as seleções da noite.',
  secoes: [
    {
      id: 'coquetel-frio',
      group: 'cardapio',
      title: 'Coquetel frio',
      subtitle: '',
      items: [
        { name: 'Blinis com salmão', description: '' },
        { name: 'Conne siciliano', description: '' },
        { name: 'Polenta com pesto e linguiça artesanal', description: '' }
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
        { name: 'Panceta sensação', description: '' },
        { name: 'Queijo coalho com mel de laranjeira', description: '' },
        { name: 'Ouriço de queijo', description: '' },
        { name: 'Damasco brulee', description: '' },
        { name: 'Wantan de camarão', description: '' }
      ]
    },
    {
      id: 'finger-foods',
      group: 'cardapio',
      title: 'Finger foods',
      subtitle: '',
      items: [
        { name: 'Camarão com creme de queijo e palmito', description: '' },
        { name: 'Mignon na fonduta de queijo', description: '' }
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
        { name: 'Batata rústica na páprica e alecrim', description: '' },
        { name: 'Penne ao molho trufado', description: '' },
        { name: 'Cupim ao demi-glace de alecrim', description: '' }
      ]
    },
    {
      id: 'sobremesa',
      group: 'cardapio',
      title: 'Sobremesa',
      subtitle: '',
      items: [
        { name: 'Cocada cremosa com abacaxi e fitas de coco', description: '' },
        { name: 'Bolo de doce de leite com nozes', description: '' }
      ]
    },
    {
      id: 'lanchinho-encerramento',
      group: 'cardapio',
      title: 'Lanchinho & encerramento',
      subtitle: '',
      items: [
        { name: 'Mini hamburguinho', description: '' },
        { name: 'Café, chá e palmier', description: '' },
        { name: 'Tirinhas de laranja', description: '' },
        { name: 'Balas de coco', description: '' }
      ]
    },
    {
      id: 'nao-alcoolicas-buffet',
      group: 'bebidas-buffet',
      title: 'Não alcoólicas',
      subtitle: '',
      items: [
        { name: 'Água com e sem gás', description: '' },
        { name: 'Água aromatizada na cerimônia', description: '' },
        { name: 'Sucos de uva e laranja', description: '' },
        { name: 'Refrigerantes normais e diet - Coca e Guaraná', description: '' }
      ]
    },
    {
      id: 'cervejas',
      group: 'bebidas-buffet',
      title: 'Cervejas',
      subtitle: '',
      items: [
        { name: 'Original', description: '' },
        { name: 'Brahma Zero', description: '' }
      ]
    },
    {
      id: 'bar-buffet',
      group: 'bebidas-buffet',
      title: 'Bar',
      subtitle: '',
      items: [
        { name: 'Bartender Energy', description: '' }
      ]
    },
    {
      id: 'encerramento-buffet',
      group: 'bebidas-buffet',
      title: 'Encerramento',
      subtitle: '',
      items: [
        { name: 'Café', description: '' },
        { name: 'Chá', description: '' },
        { name: 'Palmier', description: '' },
        { name: 'Tirinhas de laranja', description: '' },
        { name: 'Balas de coco', description: '' }
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
        { name: 'Sexy on The Beach', description: 'vodka, suco de pêssego, suco de laranja e groselha' }
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
        { name: 'Smoothie', description: 'melancia, suco de pêssego e groselha' }
      ]
    },
    {
      id: 'caipirinhas',
      group: 'bar-energy',
      title: 'Caipirinhas',
      subtitle: 'Frutas: morango, melancia, abacaxi, limão e uva',
      items: [
        { name: 'Caipirinha', description: 'cachaça com frutas' },
        { name: 'Saquerinha', description: 'saquê com frutas' },
        { name: 'Caipiroska', description: 'vodka com frutas' }
      ]
    },
    {
      id: 'especiarias-gourmet',
      group: 'bar-energy',
      title: 'Especiarias gourmet',
      subtitle: '',
      items: [
        { name: 'Pimenta rosa, gengibre, hortelã e cravo-da-índia', description: 'As especiarias são usadas para dar um toque suave e específico à caipirinha, deixando o sabor mais exótico ao paladar.' }
      ]
    },
    {
      id: 'caipirinhas-gourmet',
      group: 'bar-energy',
      title: 'Caipirinhas gourmet',
      subtitle: '',
      items: [
        { name: 'Combinações especiais', description: 'Além de servirmos as caipirinhas tradicionais à base de cachaça, vodka e saquê, deixaremos à disposição dos convidados combinações com diversas frutas, especiarias e bebidas. Temos uma infinidade de possibilidades para criarmos sabores inusitados e experiências únicas.' }
      ]
    },
    {
      id: 'assinatura',
      group: 'bar-energy',
      title: 'Bar Energy',
      subtitle: 'Coquetelaria autoral para brindar a nossa noite',
      items: []
    }
  ]
};

const DEFAULT_MAP_LAYOUT = {
  backgroundUrl: '/layout-salao.png',
  showBackground: true,
  opacity: 0.5
};

const DEFAULT_NOTIFICACOES = {
  enabled: false,
  onlyEventDay: true,
  schedules: [
    {
      id: 'notif-1',
      active: true,
      time: '16:30',
      title: 'Casamento André & Nathália',
      message: 'Nos vemos hoje! Confira seu lugar na aba Mesa.',
      targetTab: 'mesa'
    },
    {
      id: 'notif-2',
      active: true,
      time: '18:00',
      title: 'Cerimônia vai começar',
      message: 'A cerimônia está para começar. Aproveite cada momento ✨',
      targetTab: 'roteiro'
    }
  ]
};

function buildTables() {
  const items = [];
  const startXLeft = 38;
  const startXRight = 58;

  for (let i = 0; i < 5; i += 1) {
    const y = 18 + i * 11;
    items.push({ id: `mesa-g-${i + 1}`, tipo: 'mesa_grande', nome: `Mesa G${i + 1}`, x: startXLeft, y, largura: 9, altura: 7, rotacao: 0, capacidade: 10 });
    items.push({ id: `mesa-g-${i + 6}`, tipo: 'mesa_grande', nome: `Mesa G${i + 6}`, x: startXRight, y, largura: 9, altura: 7, rotacao: 0, capacidade: 10 });
    items.push({ id: `mesa-p-${i + 1}`, tipo: 'mesa_pequena', nome: `Mesa P${i + 1}`, x: startXLeft - 12, y: y + 3, largura: 7, altura: 6, rotacao: 0, capacidade: 6 });
    items.push({ id: `mesa-p-${i + 6}`, tipo: 'mesa_pequena', nome: `Mesa P${i + 6}`, x: startXRight + 12, y: y + 3, largura: 7, altura: 6, rotacao: 0, capacidade: 6 });
  }

  return items;
}

export function getDefaultMapaElementos() {
  return [
    ...buildTables(),
    { id: 'bar-principal', tipo: 'bar', nome: 'Bar Principal', x: 15, y: 8, largura: 12, altura: 7, rotacao: -12 },
    { id: 'buffet-1', tipo: 'buffet', nome: 'Buffet 1', x: 30, y: 25, largura: 10, altura: 6, rotacao: 0 },
    { id: 'buffet-2', tipo: 'buffet', nome: 'Buffet 2', x: 30, y: 55, largura: 10, altura: 6, rotacao: 0 },
    { id: 'dj-banda', tipo: 'dj', nome: 'DJ/Banda', x: 8, y: 40, largura: 10, altura: 7, rotacao: 0 },
    { id: 'mesa-bolo', tipo: 'bolo', nome: 'Mesa do Bolo', x: 68, y: 35, largura: 12, altura: 7, rotacao: 0 },
    { id: 'cafe', tipo: 'cafe', nome: 'Café', x: 80, y: 25, largura: 10, altura: 6, rotacao: 0 },
    { id: 'bem-casado', tipo: 'outro', nome: 'Bem Casado', x: 76, y: 35, largura: 11, altura: 6, rotacao: 0 },
    { id: 'bar-varanda', tipo: 'bar', nome: 'Bar Varanda', x: 38, y: 82, largura: 12, altura: 6, rotacao: 0 },
    { id: 'welcome-drink', tipo: 'outro', nome: 'Welcome Drink', x: 55, y: 88, largura: 14, altura: 6, rotacao: 0 },
    { id: 'agua-aromatizada', tipo: 'outro', nome: 'Agua Aromatizada', x: 72, y: 88, largura: 14, altura: 6, rotacao: 0 },
    { id: 'sofa-1', tipo: 'sofa', nome: 'Sofa/Poltrona 1', x: 35, y: 86, largura: 10, altura: 6, rotacao: 0 },
    { id: 'sofa-2', tipo: 'sofa', nome: 'Sofa/Poltrona 2', x: 45, y: 86, largura: 10, altura: 6, rotacao: 0 },
    { id: 'cozinha', tipo: 'outro', nome: 'Cozinha', x: 18, y: 75, largura: 12, altura: 7, rotacao: 0 },
    { id: 'banheiros', tipo: 'outro', nome: 'Banheiros', x: 28, y: 75, largura: 12, altura: 7, rotacao: 0 },
    { id: 'valet', tipo: 'outro', nome: 'Valet', x: 90, y: 40, largura: 8, altura: 7, rotacao: 0 },
    { id: 'cabine', tipo: 'outro', nome: 'Cabine', x: 90, y: 85, largura: 8, altura: 7, rotacao: 0 },
    { id: 'bistro-1', tipo: 'bistro', nome: 'Bistro 1', x: 20, y: 18, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-2', tipo: 'bistro', nome: 'Bistro 2', x: 24, y: 30, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-3', tipo: 'bistro', nome: 'Bistro 3', x: 22, y: 48, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-4', tipo: 'bistro', nome: 'Bistro 4', x: 22, y: 62, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-5', tipo: 'bistro', nome: 'Bistro 5', x: 74, y: 58, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-6', tipo: 'bistro', nome: 'Bistro 6', x: 82, y: 50, largura: 5, altura: 5, rotacao: 0 },
    { id: 'bistro-7', tipo: 'bistro', nome: 'Bistro 7', x: 81, y: 14, largura: 5, altura: 5, rotacao: 0 },
    { id: 'planta-1', tipo: 'planta', nome: 'Planta 1', x: 6, y: 10, largura: 4, altura: 4, rotacao: 0 },
    { id: 'planta-2', tipo: 'planta', nome: 'Planta 2', x: 94, y: 12, largura: 4, altura: 4, rotacao: 0 },
    { id: 'planta-3', tipo: 'planta', nome: 'Planta 3', x: 94, y: 72, largura: 4, altura: 4, rotacao: 0 }
  ];
}

const DEFAULTS = {
  site: DEFAULT_SITE,
  aparencia: DEFAULT_APPEARANCE,
  roteiro: DEFAULT_ROTEIRO,
  etiqueta: DEFAULT_ETIQUETA,
  menu: DEFAULT_MENU,
  mapa: {
    elementos: getDefaultMapaElementos(),
    layout: DEFAULT_MAP_LAYOUT
  },
  notificacoes: DEFAULT_NOTIFICACOES
};

export const CONFIG_DOC_IDS = Object.keys(DEFAULTS);

export function getDefaultConfigDoc(docId) {
  return DEFAULTS[docId] || {};
}

export async function ensureConfigDefaults(docIds = CONFIG_DOC_IDS) {
  const result = {
    created: [],
    updated: [],
    skipped: []
  };

  const adminDb = getAdminDb();
  const refs = docIds.map((docId) => adminDb.collection('config').doc(docId));
  const snapshots = await adminDb.getAll(...refs);

  const writes = [];
  snapshots.forEach((snapshot, index) => {
    const docId = docIds[index];

    if (!snapshot.exists) {
      writes.push(refs[index].set(getDefaultConfigDoc(docId)));
      result.created.push(docId);
    } else {
      result.skipped.push(docId);
    }
  });

  if (writes.length > 0) {
    await Promise.all(writes);
  }

  return result;
}

export async function seedAllConfigDefaults(force = false, docIds = CONFIG_DOC_IDS) {
  const adminDb = getAdminDb();
  const result = {
    created: [],
    updated: [],
    skipped: []
  };

  const refs = docIds.map((docId) => adminDb.collection('config').doc(docId));
  const snapshots = await adminDb.getAll(...refs);

  const writes = [];
  snapshots.forEach((snapshot, index) => {
    const docId = docIds[index];

    if (!snapshot.exists) {
      writes.push(refs[index].set(getDefaultConfigDoc(docId)));
      result.created.push(docId);
      return;
    }

    if (force) {
      writes.push(refs[index].set(getDefaultConfigDoc(docId), { merge: false }));
      result.updated.push(docId);
      return;
    }

    result.skipped.push(docId);
  });

  if (writes.length > 0) {
    await Promise.all(writes);
  }

  return result;
}
