import { getConfigDocument, getManyConfigDocuments } from '../../lib/configStore';

const ALLOWED_DOCS = new Set(['site', 'aparencia', 'roteiro', 'etiqueta', 'cardapio', 'mapa']);

function parseDocs(value) {
  if (!value) {
    return ['site', 'aparencia', 'roteiro', 'etiqueta', 'cardapio', 'mapa'];
  }

  return String(value)
    .split(',')
    .map((doc) => doc.trim())
    .filter((doc) => ALLOWED_DOCS.has(doc));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  try {
    const docs = parseDocs(req.query.docs);

    if (docs.length === 0) {
      return res.status(400).json({ error: 'Nenhum documento valido solicitado' });
    }

    if (docs.length === 1) {
      const docId = docs[0];
      const data = await getConfigDocument(docId);
      return res.status(200).json({ config: { [docId]: data } });
    }

    const config = await getManyConfigDocuments(docs);
    return res.status(200).json({ config });
  } catch (error) {
    console.error('Erro em getConfig:', error);
    return res.status(500).json({ error: 'Falha ao carregar configuracoes' });
  }
}
