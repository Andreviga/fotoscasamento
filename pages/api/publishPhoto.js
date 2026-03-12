import { getAdminDb } from '../../lib/firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { cloudinaryUrl, filterLabel, guestName } = req.body;

    // Validações simples
    if (!cloudinaryUrl || !guestName) {
      return res.status(400).json({ error: 'URL da Cloudinary e nome do convidado são obrigatórios' });
    }

    if (guestName.trim().length === 0) {
      return res.status(400).json({ error: 'Por favor, insira seu nome' });
    }

    // Adicionar documento à coleção 'mural' no Firestore
    const adminDb = getAdminDb();
    const docRef = await adminDb.collection('mural').add({
      cloudinaryUrl,
      filter: filterLabel || 'Original',
      guestName: guestName.trim(),
      timestamp: FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      documentId: docRef.id,
      message: 'Foto publicada com sucesso no Mural ✿'
    });
  } catch (error) {
    console.error('Erro ao publicar foto:', error);
    return res.status(500).json({
      error: 'Erro ao publicar foto',
      details: error.message
    });
  }
}
