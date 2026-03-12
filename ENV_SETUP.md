# 🔴 INSTRUÇÕES PARA CONFIGURAR O AMBIENTE

## 1️⃣ CLOUDINARY
Acesse: https://cloudinary.com/console/settings/upload

Copie seus valores:
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=df3aqieat
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=fotos_casamento

## 2️⃣ FIREBASE
Acesse seu projeto em: https://console.firebase.google.com
Vá para: Project Settings > General > SDK Setup

Você terá um bloco JavaScript como:
```
const firebaseConfig = {
  apiKey: "COPIE_AQUI",
  authDomain: "COPIE_AQUI",
  projectId: "COPIE_AQUI",
  storageBucket: "COPIE_AQUI",
  messagingSenderId: "COPIE_AQUI",
  appId: "COPIE_AQUI"
};
```

Preencha abaixo com esses valores:

```bash
# FIREBASE PÚBLICAS (do SDK Setup do Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=df3aqieat
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=fotos_casamento
```

## 3️⃣ FIREBASE ADMIN (já configurados)
FIREBASE_SERVICE_ACCOUNT_JSON=... ✅
GOOGLE_SERVICE_ACCOUNT_JSON=... ✅
GOOGLE_DRIVE_FOLDER_ID=... (deixe em branco se não usar)

---

**DEPOIS QUE PREENCHER, REINICIE O SERVIDOR:**
```
npm run dev
```

Acesse: http://localhost:3000
