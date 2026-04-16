import admin from 'firebase-admin';

let adminDb = null;
let adminAuth = null;

function initializeAdminSdk() {
  if (admin.apps.length === 0) {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON nao configurado.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  }

  if (!adminDb) {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
  }
}

export function getAdminDb() {
  if (!adminDb) {
    initializeAdminSdk();
  }
  return adminDb;
}

export function getAdminAuth() {
  if (!adminAuth) {
    initializeAdminSdk();
  }
  return adminAuth;
}

