# Firebase Admin SDK Migration

## O Que Mudou?

O Firebase estava usando um **sistema legado de tokens** descontinuado. Atualizamos todo o código para usar o **Firebase Admin SDK** moderno.

### Arquitetura Antiga ❌
```
fotos.js (Browser) → Firestore Client SDK → Firebase Firestore
  ↓ direto no cliente ↓
```

### Arquitetura Nova ✅
```
fotos.js (Browser) → POST /api/publishPhoto → Backend (Node.js)
                                                   ↓
                            Firebase Admin SDK + Service Account
                                                   ↓
                              Firebase Firestore (Seguro)
```

## Componentes

### 1. **lib/firebaseAdmin.js** (Backend)
- Inicializa Firebase Admin SDK com o `service account JSON`
- Funções: `getAdminDb()` e `getAdminAuth()`
- Usa `path` e `fs` para carregar credenciais do arquivo JSON

```javascript
import { getAdminDb } from '@/lib/firebaseAdmin.js';

const adminDb = getAdminDb();
await adminDb.collection('mural').add({...});
```

### 2. **pages/api/publishPhoto.js** (API Route)
Endpoint seguro que:
- Valida dados do cliente
- Usa Firebase Admin SDK para escrever no Firestore
- Retorna resposta JSON com status

```bash
POST /api/publishPhoto
Content-Type: application/json

{
  "cloudinaryUrl": "https://...",
  "filterLabel": "Original",
  "guestName": "João"
}
```

### 3. **pages/fotos.js** (Frontend)
- Não usa mais `addDoc()` direto
- Chama o endpoint `/api/publishPhoto` via `fetch()`
- Interface continua igual!

## Por Que Isso É Melhor?

| Aspecto | Antes (Client SDK) | Depois (Admin SDK) |
|--------|-------------------|-------------------|
| **Segurança** | Credenciais na frente | Secret no servidor ✅ |
| **Validação** | No cliente | No servidor ✅ |
| **Rate Limiting** | Difícil | Fácil de implementar ✅ |
| **Auditoria** | Difícil | Log no servidor ✅ |
| **Status do Projeto** | ⚠️ Legado/Deprecated | ✅ Moderno/Recomendado |

## Fluxo Completo (Passo a Passo)

### 1. Cliente Tira Foto
```
User clica "Tirar Foto"
    ↓
Camera capture → Cloudinary upload (unsigned)
    ↓
Imagem processada com filtro
```

### 2. Cliente Publica
```
User clica "Publicar no Mural"
    ↓
fetch POST /api/publishPhoto com {cloudinaryUrl, guestName, filter}
    ↓
API valida dados
    ↓
Admin SDK escreve em Firestore com timestamp do servidor
    ↓
Resposta JSON: { success: true, documentId: "...", message: "✿" }
```

### 3. Live Display
```
pages/mural.js (browser)
    ↓
onSnapshot listener (Firestore Client SDK)
    ↓
Real-time updates: novas fotos aparecem no grid!
```

## Configuração

### O arquivo service account já está:
- ✅ Criado: `casamento-fotos-84576-firebase-adminsdk-fbsvc-759a467756.json`
- ✅ Protegido: Listed em `.gitignore`
- ✅ Usado: Automaticamente por `lib/firebaseAdmin.js`

### Inicialização automática:
Quando o API route é acessado pela primeira vez, o SDK Admin se inicializa automaticamente!

```javascript
export function getAdminDb() {
  if (!adminDb) {
    initializeAdminSdk();  // Apenas chamado uma vez
  }
  return adminDb;
}
```

## Testando Localmente

### 1. Certesque o `.env.local` está preenchido:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

### 2. Inicie o servidor:
```bash
npm run dev
```

### 3. Teste a photo booth:
```
http://localhost:3000/fotos
↓
Tirar foto → Escolher filtro → Publicar
↓
http://localhost:3000/mural
↓
Ver foto em tempo real! ✿
```

## Debug/Troubleshooting

### Erro: "Can't resolve @/lib/firebaseAdmin"
- Verificar `tsconfig.json` tem `"@/*": ["./*"]`
- Restart dev server: `npm run dev`

### Erro: "Service account file not found"
- Confirmar que `casamento-fotos-84576-firebase-adminsdk-fbsvc-759a467756.json` está na raiz
- Verificar nome exato (case-sensitive no Linux/Mac)

### API retorna erro 500
- Verificar logs do servidor: `npm run dev` console
- Validar Firestore rules permitem `mural` collection
- Checar service account tem permissões no Firebase Console

## Próximos Passos

1. **Testar com dados reais** na máquina de casamento
2. **Adicionar validações extras** (ex: limpar nomes especiais)
3. **Implementar rate limiting** se necessário
4. **Adicionar logging** para auditoria
5. **Deploy para Vercel** (será automático!)

---

✨ **Arquitetura segura, moderna e pronta para produção!**
