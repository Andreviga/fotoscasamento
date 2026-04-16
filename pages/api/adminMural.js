import { assertAdmin } from '../../lib/adminAuth.js';
import { getAdminDb } from '../../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  if (!assertAdmin(req, res)) return;

  const adminDb = getAdminDb();

  // GET /api/adminMural — list all photos
  if (req.method === 'GET') {
    try {
      const snapshot = await adminDb
        .collection('mural')
        .orderBy('createdAtMs', 'desc')
        .get();

      const photos = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          guestName: data.guestName || data.nomeConvidado || 'Convidado',
          imageUrl: data.imageUrl || data.mediaUrl || '',
          createdAtMs: data.createdAtMs || 0,
        };
      });

      return res.status(200).json({ photos });
    } catch (error) {
      console.error('adminMural GET error:', error);
      return res.status(500).json({ error: 'Erro ao listar fotos do mural.' });
    }
  }

  // DELETE /api/adminMural — delete one or all photos
  if (req.method === 'DELETE') {
    const { id, deleteAll } = req.body ?? {};

    try {
      if (deleteAll === true) {
        const snapshot = await adminDb.collection('mural').get();
        const batch = adminDb.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        return res.status(200).json({ ok: true, deleted: snapshot.size });
      }

      if (id) {
        await adminDb.collection('mural').doc(String(id)).delete();
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ error: 'Forneça id ou deleteAll=true.' });
    } catch (error) {
      console.error('adminMural DELETE error:', error);
      return res.status(500).json({ error: 'Erro ao excluir foto(s) do mural.' });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
