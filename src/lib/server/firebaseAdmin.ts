import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não configurado.');
  }
  return JSON.parse(raw);
}

export function getAdminDb(): Firestore {
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(getServiceAccount())
      });

  return getFirestore(app);
}