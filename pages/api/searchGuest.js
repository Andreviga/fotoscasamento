import Fuse from 'fuse.js';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { normalizeName } from '../../lib/guestUtils';

let guestsCache = [];
let guestsCacheAt = 0;
const CACHE_TTL_MS = 45 * 1000;

async function loadGuests(force = false) {
  const now = Date.now();
  if (!force && now - guestsCacheAt < CACHE_TTL_MS && guestsCache.length > 0) {
    return guestsCache;
  }

  const adminDb = getAdminDb();
  const snapshot = await adminDb.collection('convidados').get();

  guestsCache = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }));
  guestsCacheAt = now;

  return guestsCache;
}

function toResult(guest) {
  return {
    id: guest.id,
    nomeOriginal: guest.nomeOriginal || guest.nome || '',
    nomeConvite: guest.nomeConvite || '',
    mesa: typeof guest.mesa === 'number' ? guest.mesa : null,
    grupo: guest.grupo || '',
    confirmado: Boolean(guest.confirmado)
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
      keys: ['nome', 'nomeOriginal', 'nomeConvite', 'grupo']
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
