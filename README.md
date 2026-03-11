# ✿ Wedding Photo Booth App (Next.js + Tailwind + Vercel)

Web app mobile-first para cabine de fotos do casamento, com identidade visual romântica e minimalista inspirada no site principal.

## Stack escolhida (ideal para Vercel)
- **Framework:** Next.js 14 (App Router) + TypeScript
- **UI:** Tailwind CSS (estilo romântico minimalista)
- **Processamento de imagem:** Cloudinary (upload assíncrono + filtros artísticos por URL)
- **Validação de limite:** Firebase Firestore (via Firebase Admin em API Route)
- **Armazenamento final:** Google Drive API (Service Account em Route Handler)

## Estrutura de pastas

```txt
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── print/
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── WeddingPhotoApp.tsx
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   └── server/
│   │       ├── firebaseAdmin.ts
│   │       └── googleDrive.ts
│   └── types/
│       └── cloudinary.ts
├── .env.example
├── next.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## O que foi implementado

### 1) Componente principal (captura + filtros + Tailwind)
Ficheiro: `src/components/WeddingPhotoApp.tsx`
- Formulário de login simples (Nome + Telemóvel).
- Captura com `navigator.mediaDevices.getUserMedia` + botão central de disparo.
- Fallback para upload da galeria.
- Upload assíncrono para Cloudinary por `fetch`.
- Pré-visualização com 5 miniaturas usando filtros artísticos (`e_art:*`) via URL.
- Botão "Imprimir" que chama a API interna `/api/print`.

### 2) Route Serverless (limite Firestore + upload Google Drive)
Ficheiro: `src/app/api/print/route.ts`
- Recebe `name`, `phone`, `publicId`, `filterTransformation`, `filterId`.
- Gera URL final Cloudinary em alta resolução.
- Executa transação no Firestore para validar/incrementar limite de 3.
- Faz download da imagem final e upload para pasta do Google Drive.
- Retorna mensagem elegante caso limite tenha sido atingido.

### 3) Identidade visual igual ao site principal
Ficheiro: `src/app/globals.css` + `tailwind.config.ts`
- Paleta clara e romântica (`blush`, `rose`, `wine`, `ivory`).
- Tipografia mista serif + sans-serif.
- Uso do símbolo floral `✿`.
- Inputs e botões arredondados, limpos e touch-friendly.

## Variáveis de ambiente
Preencha `.env.local` com base em `.env.example`.

## Execução local
```bash
npm install
npm run dev
```
