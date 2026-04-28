import Fuse from 'fuse.js';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { normalizeName } from '../../lib/guestUtils';
import { SEATING_GUESTS } from '../../lib/seatingPlan';

let guestsCache = [];
let guestsCacheAt = 0;
const CACHE_TTL_MS = 45 * 1000;

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

async function loadGuests(force = false) {
  const now = Date.now();
  if (!force && now - guestsCacheAt < CACHE_TTL_MS && guestsCache.length > 0) {
    return guestsCache;
  }

  try {
    const adminDb = getAdminDb();
    const snapshot = await adminDb.collection('convidados').get();

    const fromFirestore = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      source: 'firestore'
    }));

    guestsCache = mergeGuests(fromFirestore).filter((guest) => !guest.excludedFromSearch);
  } catch (error) {
    console.error('Falha ao carregar convidados do Firestore, usando plano local:', error);
    guestsCache = [...SEATING_GUESTS];
  }

  guestsCacheAt = now;

  return guestsCache;
}

function toResult(guest) {
  return {
    id: guest.id,
    nomeOriginal: guest.nomeOriginal || guest.nome || '',
    nomeConvite: guest.nomeConvite || '',
    mesa: typeof guest.mesa === 'number' ? guest.mesa : null,
    mesaNome: guest.mesaNome || '',
    confirmado: Boolean(guest.confirmado),
    excludedFromSearch: Boolean(guest.excludedFromSearch)
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  try {
    const query = normalizeName(req.query.q || '');
    const forceRefresh = String(req.query.refresh || '') === '1';
    const all = String(req.query.all || '') === '1';

    const guests = await loadGuests(forceRefresh);

    if (all) {
      return res.status(200).json({
        total: guests.length,
        results: guests.map(toResult)
      });
    }

    if (!query) {
      return res.status(200).json({ total: 0, results: [] });
    }

    const fuse = new Fuse(guests, {
      threshold: 0.4,
      includeScore: true,
      ignoreLocation: true,
      keys: ['nome', 'nomeOriginal', 'nomeConvite']
    });

    const fused = fuse.search(query).slice(0, 5).map((item) => toResult(item.item));

    const includesMatches = guests
      .filter((guest) => {
        const name = normalizeName(guest.nomeOriginal || guest.nome || '');
        const invite = normalizeName(guest.nomeConvite || '');
        return name.includes(query) || invite.includes(query);
      })
      .slice(0, 5)
      .map(toResult);

    const dedupe = new Map();
    [...includesMatches, ...fused].forEach((item) => {
      if (!dedupe.has(item.id)) {
        dedupe.set(item.id, item);
      }
    });

    return res.status(200).json({
      total: dedupe.size,
      results: Array.from(dedupe.values()).slice(0, 5)
    });
  } catch (error) {
    console.error('Erro em searchGuest:', error);
    return res.status(500).json({ error: 'Falha na busca de convidados' });
  }
}
