import { assertAdmin } from '../../lib/adminAuth';
import { getAdminDb } from '../../lib/firebaseAdmin';

function normalizeFilters(query) {
  return {
    grupo: String(query.grupo || '').trim().toLowerCase(),
    mesa: String(query.mesa || '').trim(),
    confirmado: String(query.confirmado || '').trim().toLowerCase()
  };
}

function applyFilters(items, filters) {
  return items.filter((item) => {
    if (filters.grupo && !String(item.grupo || '').toLowerCase().includes(filters.grupo)) {
      return false;
    }

    if (filters.mesa) {
      const mesaValue = item.mesa == null ? '' : String(item.mesa);
      if (mesaValue !== filters.mesa) {
        return false;
      }
    }

    if (filters.confirmado) {
      const boolValue = filters.confirmado === 'true' || filters.confirmado === 'sim' || filters.confirmado === '1';
      if (Boolean(item.confirmado) !== boolValue) {
        return false;
      }
    }

    return true;
  });
}

function toCsvRow(values) {
  return values
    .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
    .join(',');
}

export default async function handler(req, res) {
  if (!assertAdmin(req, res)) {
    return;
  }

  const adminDb = getAdminDb();

  if (req.method === 'GET') {
    try {
      const snapshot = await adminDb.collection('convidados').orderBy('nomeOriginal', 'asc').get();
      const guests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = applyFilters(guests, normalizeFilters(req.query || {}));

      if (String(req.query.export || '') === 'csv') {
        const lines = [
          toCsvRow(['nomeOriginal', 'nomeConvite', 'mesa', 'grupo', 'confirmado', 'telefone', 'observacao'])
        ];

        filtered.forEach((guest) => {
          lines.push(toCsvRow([
            guest.nomeOriginal,
            guest.nomeConvite,
            guest.mesa ?? '',
            guest.grupo,
            guest.confirmado ? 'sim' : 'nao',
            guest.telefone || '',
            guest.observacao || ''
          ]));
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="convidados.csv"');
        return res.status(200).send(lines.join('\n'));
      }

      return res.status(200).json({ total: filtered.length, guests: filtered });
    } catch (error) {
      console.error('Erro em adminGuests GET:', error);
      return res.status(500).json({ error: 'Falha ao listar convidados' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, updates } = req.body || {};
      if (!id || typeof updates !== 'object' || !updates) {
        return res.status(400).json({ error: 'Payload invalido' });
      }

      await adminDb.collection('convidados').doc(id).set(updates, { merge: true });
      const snapshot = await adminDb.collection('convidados').doc(id).get();
      return res.status(200).json({ success: true, guest: { id: snapshot.id, ...snapshot.data() } });
    } catch (error) {
      console.error('Erro em adminGuests PATCH:', error);
      return res.status(500).json({ error: 'Falha ao atualizar convidado' });
    }
  }

  return res.status(405).json({ error: 'Metodo nao permitido' });
}
