import crypto from 'crypto';
import { getAdminDb } from '../../lib/firebaseAdmin.js';

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function normalizeText(value, maxLength = 200) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { documentId, deleteToken } = req.body ?? {};

    const safeDocumentId = normalizeText(documentId, 120);
    const safeDeleteToken = normalizeText(deleteToken, 160);

    if (!safeDocumentId || !safeDeleteToken) {
      return res.status(400).json({ error: 'Dados de exclusão inválidos.' });
    }

    const adminDb = getAdminDb();
    const docRef = adminDb.collection('mural').doc(safeDocumentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return res.status(404).json({ error: 'Mídia não encontrada.' });
    }

    const data = snapshot.data() ?? {};
    const expectedHash = normalizeText(data.deleteTokenHash, 200);

    if (!expectedHash) {
      return res.status(403).json({ error: 'Exclusão não autorizada para esta mídia.' });
    }

    const incomingHash = hashToken(safeDeleteToken);
    if (incomingHash !== expectedHash) {
      return res.status(403).json({ error: 'Apenas quem publicou pode excluir esta mídia.' });
    }

    await docRef.delete();

    return res.status(200).json({
      success: true,
      message: 'Mídia excluída com sucesso.'
    });
  } catch (error) {
    console.error('Erro ao excluir mídia:', error);
    return res.status(500).json({ error: 'Erro ao excluir mídia.', details: error?.message || String(error) });
  }
}
