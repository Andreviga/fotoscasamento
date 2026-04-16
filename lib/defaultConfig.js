import { getAdminDb } from './firebaseAdmin';

const DEFAULT_SITE = {
  titulo_site: 'Casamento Andre & Nathalia',
  nome_noivos: 'Andre & Nathalia',
  data_casamento: '03 de maio de 2026',
  local_cerimonia: 'Cerimonia - a confirmar',
  local_recepcao: 'Recepcao - a confirmar',
  mensagem_boas_vindas: 'Sejam bem-vindos ao nosso grande dia. Que alegria ter voce aqui!',
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
    { horario: '17:00', titulo: 'Chegada e Welcome Drink', descricao: 'Os convidados chegam e sao recebidos com drinks de boas-vindas na varanda.', icone: '🥂', destaque: false },
    { horario: '17:30', titulo: 'Abertura das portas do salao', descricao: 'Convidados sao convidados a se acomodar nas mesas.', icone: '🚪', destaque: false },
    { horario: '18:00', titulo: 'Entrada dos padrinhos', descricao: 'Cortejo dos padrinhos ao som da trilha escolhida.', icone: '🎻', destaque: true },
    { horario: '18:15', titulo: 'Entrada dos pais dos noivos', descricao: 'Momento especial com a familia.', icone: '💛', destaque: true },
    { horario: '18:30', titulo: 'Entrada da noiva', descricao: 'O grande momento: entrada de Nathalia.', icone: '👰', destaque: true },
    { horario: '18:35', titulo: 'Cerimonia', descricao: 'Celebracao do casamento civil e/ou religioso.', icone: '⛪', destaque: true },
    { horario: '19:00', titulo: 'Troca de aliancas', descricao: 'O momento mais aguardado.', icone: '💍', destaque: true },
    { horario: '19:10', titulo: 'Primeiro beijo como casados', descricao: 'Celebrem com os noivos!', icone: '🎉', destaque: true },
    { horario: '19:15', titulo: 'Saida dos noivos e fotos', descricao: 'Sessao de fotos com familia e padrinhos.', icone: '📸', destaque: false },
    { horario: '19:30', titulo: 'Abertura do buffet', descricao: 'Convidados sao convidados a servir-se.', icone: '🍽️', destaque: false },
    { horario: '20:00', titulo: 'Brinde', descricao: 'Discurso dos padrinhos e brinde com espumante.', icone: '🥂', destaque: true },
    { horario: '20:30', titulo: 'Abertura da pista de danca', descricao: 'DJ/Banda da inicio a festa.', icone: '🎶', destaque: true },
    { horario: '21:00', titulo: 'Hora do bolo', descricao: 'Corte do bolo pelos noivos.', icone: '🎂', destaque: true },
    { horario: '21:15', titulo: 'Bouquet da noiva', descricao: 'Arremesso do buque.', icone: '💐', destaque: true },
    { horario: '23:00', titulo: 'Encerramento', descricao: 'Ultimas musicas e despedida.', icone: '✨', destaque: false }
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
      titulo: 'Cerimonia',
      icone: '🔕',
      conteudo: 'Solicitamos que durante a cerimonia os celulares fiquem no modo silencioso. Aguarde a noiva entrar antes de se sentar e evite passar na frente do fotografo e videomaker.'
    },
    {
      titulo: 'Presente',
      icone: '🎁',
      conteudo: 'Sua presenca ja e o nosso presente. Caso queira nos presentear, preferimos contribuicoes para nossa lista de casamento ou PIX.'
    },
    {
      titulo: 'Criancas',
      icone: '🧸',
      conteudo: 'Conteudo configuravel pelo admin.'
    },
    {
      titulo: 'Fotos e Redes Sociais',
      icone: '📱',
      conteudo: 'Adoramos ver as fotos de voces. Usem nossa hashtag para compartilharmos os melhores momentos. Link do photobooth: /fotos'
    },
    {
      titulo: 'Estacionamento e Acesso',
      icone: '🚗',
      conteudo: 'Conteudo configuravel pelo admin.'
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
    { id: 'cafe', tipo: 'cafe', nome: 'Cafe', x: 80, y: 25, largura: 10, altura: 6, rotacao: 0 },
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
  mapa: { elementos: getDefaultMapaElementos() }
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
