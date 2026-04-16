import { getAdminDb } from './firebaseAdmin';
import { ensureConfigDefaults, getDefaultConfigDoc } from './defaultConfig';

export async function getConfigDocument(docId) {
  const adminDb = getAdminDb();
  await ensureConfigDefaults([docId]);
  const snapshot = await adminDb.collection('config').doc(docId).get();

  if (!snapshot.exists) {
    return getDefaultConfigDoc(docId);
  }

  return snapshot.data() || {};
}

export async function getManyConfigDocuments(docIds) {
  const adminDb = getAdminDb();
  await ensureConfigDefaults(docIds);

  const refs = docIds.map((docId) => adminDb.collection('config').doc(docId));
  const snapshots = await adminDb.getAll(...refs);

  const result = {};
  snapshots.forEach((snapshot, index) => {
    const docId = docIds[index];
    result[docId] = snapshot.exists ? (snapshot.data() || {}) : getDefaultConfigDoc(docId);
  });

  return result;
}

export async function saveConfigDocument(docId, data) {
  const adminDb = getAdminDb();
  const payload = typeof data === 'object' && data !== null ? data : {};

  await adminDb.collection('config').doc(docId).set(payload, { merge: true });
  return getConfigDocument(docId);
}
