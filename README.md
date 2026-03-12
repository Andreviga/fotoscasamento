# André & Nathália | Cabine de Fotos Digital + Mural ao Vivo

Aplicação Next.js mobile-first para uso no casamento, com captura de foto, filtros via Cloudinary e mural ao vivo sincronizado com Firebase Firestore.

## Rotas

- `/fotos`: cabine digital para captura, escolha de filtro e publicação no mural.
- `/mural`: grid em tempo real para telão ou TV durante a festa.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Firebase Firestore
- Cloudinary unsigned upload

## Variáveis de ambiente

Defina estas variáveis em `.env.local` e também no projeto da Vercel:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_SERVICE_ACCOUNT_JSON=
```

### Observações importantes

- `FIREBASE_SERVICE_ACCOUNT_JSON` deve ser o JSON inteiro da service account em uma única linha.
- As variáveis `NEXT_PUBLIC_*` precisam existir na Vercel para a rota `/mural` funcionar no browser.
- O preset do Cloudinary precisa permitir upload unsigned.

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Firestore

Coleção utilizada:

- `mural`

Campos gravados por foto:

- `guestName`
- `imageUrl`
- `filterId`
- `publicId`
- `createdAt`
- `createdAtMs`

As regras iniciais estão em `firestore.rules`.

## Deploy na Vercel

1. Importe o repositório no painel da Vercel.
2. Adicione todas as variáveis de ambiente listadas acima.
3. Faça o deploy da branch principal.
4. Teste `/fotos` no telemóvel e `/mural` em outra aba ou no telão.
