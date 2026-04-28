import { assertAdmin } from '../../lib/adminAuth';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { normalizeName } from '../../lib/guestUtils';
import { SEATING_GUESTS } from '../../lib/seatingPlan';

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

function normalizeMesa(value) {
  if (value === '' || value == null) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export default async function handler(req, res) {
  if (!assertAdmin(req, res)) {
    return;
  }

  const adminDb = getAdminDb();

  if (req.method === 'GET') {
    try {
      const snapshot = await adminDb.collection('convidados').orderBy('nomeOriginal', 'asc').get();
      const firestoreGuests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), source: 'firestore' }));

      const dedupe = new Set(
        firestoreGuests
          .map((guest) => normalizeName(guest.nomeOriginal || guest.nome || ''))
          .filter(Boolean)
      );

      const fallbackGuests = SEATING_GUESTS.filter((guest) => {
        const key = normalizeName(guest.nomeOriginal || guest.nome || '');
        return key && !dedupe.has(key);
      });

      const guests = [...firestoreGuests, ...fallbackGuests];
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

  if (req.method === 'POST') {
    try {
      const { guest } = req.body || {};
      if (!guest || typeof guest !== 'object') {
        return res.status(400).json({ error: 'Payload invalido' });
      }

      const nomeOriginal = String(guest.nomeOriginal || guest.nome || '').trim();
      if (!nomeOriginal) {
        return res.status(400).json({ error: 'nomeOriginal obrigatorio' });
      }

      const mesa = normalizeMesa(guest.mesa);
      const docData = {
        nomeOriginal,
        nomeConvite: String(guest.nomeConvite || nomeOriginal).trim(),
        mesa,
        mesaNome: String(guest.mesaNome || guest.grupo || '').trim(),
        grupo: String(guest.grupo || guest.mesaNome || '').trim(),
        confirmado: Boolean(guest.confirmado),
        telefone: String(guest.telefone || '').trim(),
        observacao: String(guest.observacao || '').trim(),
        createdAt: Date.now(),
        source: 'admin'
      };

      const createdRef = await adminDb.collection('convidados').add(docData);
      const createdSnapshot = await createdRef.get();

      return res.status(201).json({
        success: true,
        guest: {
          id: createdSnapshot.id,
          ...createdSnapshot.data()
        }
      });
    } catch (error) {
      console.error('Erro em adminGuests POST:', error);
      return res.status(500).json({ error: 'Falha ao criar convidado' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = String(req.query.id || req.body?.id || '').trim();
      if (!id) {
        return res.status(400).json({ error: 'id obrigatorio' });
      }

      await adminDb.collection('convidados').doc(id).delete();
      return res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Erro em adminGuests DELETE:', error);
      return res.status(500).json({ error: 'Falha ao excluir convidado' });
    }
  }

  return res.status(405).json({ error: 'Metodo nao permitido' });
}
