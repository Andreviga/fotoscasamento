import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let adminDb = null;
let adminAuth = null;

function initializeAdminSdk() {
  if (admin.apps.length === 0) {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } else {
      const serviceAccountPath = path.join(process.cwd(), 'casamento-fotos-84576-firebase-adminsdk-fbsvc-759a467756.json');
      serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
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

