import { assertAdmin } from '../../lib/adminAuth';
import { saveConfigDocument } from '../../lib/configStore';

const ALLOWED_DOCS = new Set(['site', 'aparencia', 'roteiro', 'etiqueta', 'mapa']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  if (!assertAdmin(req, res)) {
    return;
  }

  try {
    const { docId, data } = req.body || {};

    if (!ALLOWED_DOCS.has(docId)) {
      return res.status(400).json({ error: 'Documento de config invalido' });
    }

    const saved = await saveConfigDocument(docId, data);
    return res.status(200).json({ success: true, docId, data: saved });
  } catch (error) {
    console.error('Erro em saveConfig:', error);
    return res.status(500).json({ error: 'Falha ao salvar configuracoes' });
  }
}
