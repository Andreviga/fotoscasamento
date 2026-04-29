import { assertAdmin } from '../../lib/adminAuth';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { normalizeName } from '../../lib/guestUtils';
import { SEATING_GUESTS } from '../../lib/seatingPlan';

function mergeGuests(firestoreGuests) {
  const firestoreById = new Map(firestoreGuests.map((guest) => [guest.id, guest]));
  const firestoreByName = new Map(
    firestoreGuests
      .map((guest) => [normalizeName(guest.nomeOriginal || guest.nome || ''), guest])
      .filter(([key]) => Boolean(key))
  );

  const mergedFallbackGuests = SEATING_GUESTS.map((guest) => {
    const key = normalizeName(guest.nomeOriginal || guest.nome || '');
    const firestoreMatch = firestoreById.get(guest.id) || firestoreByName.get(key);
    return firestoreMatch ? { ...guest, ...firestoreMatch } : guest;
  });

  const usedIds = new Set(mergedFallbackGuests.map((guest) => guest.id));
  const extraFirestoreGuests = firestoreGuests.filter((guest) => !usedIds.has(guest.id));

  return [...mergedFallbackGuests, ...extraFirestoreGuests];
}

function normalizeMesaLabel(guest) {
  if (guest.mesaNome) return String(guest.mesaNome).trim();
  if (guest.grupo) return String(guest.grupo).trim();
  if (typeof guest.mesa === 'number') return `Mesa ${guest.mesa}`;
  if (typeof guest.mesa === 'string' && guest.mesa.trim()) return guest.mesa.trim();
  return '';
}

function toWhatsappGuest(guest) {
  return {
    id: String(guest.id || ''),
    nome: String(guest.nomeOriginal || guest.nome || '').trim(),
    telefone: String(guest.telefone || '').trim(),
    confirmado: Boolean(guest.confirmado),
    mesa: normalizeMesaLabel(guest),
    localizacaoMesa: String(guest.localizacaoMesa || guest.observacao || '').trim(),
    whatsappEnviado: Boolean(guest.whatsappEnviado)
  };
}

export default async function handler(req, res) {
  if (!assertAdmin(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection('convidados').get();
    const firestoreGuests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      source: 'firestore'
    }));

    const mergedGuests = mergeGuests(firestoreGuests)
      .map(toWhatsappGuest)
      .filter((guest) => guest.nome)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    return res.status(200).json({ total: mergedGuests.length, guests: mergedGuests });
  } catch (error) {
    console.error('Erro em adminWhatsappGuests:', error);
    return res.status(500).json({ error: 'Falha ao listar convidados para WhatsApp' });
  }
}
