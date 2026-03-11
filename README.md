# Web App Mobile-first para Fotos do Casamento

## Stack escolhida
- **Frontend:** Next.js (React) para deploy fácil em Vercel/Netlify e suporte a subdiretório (`/casamento`).
- **Base de dados/limites:** Firebase Firestore.
- **Processamento de imagem:** Cloudinary Upload Widget + transformações URL.
- **Armazenamento final:** Firebase Storage (compatível com downloader local no Raspberry Pi).

## Estrutura de pastas

```txt
.
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── WeddingPhotoApp.tsx
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   └── firebase.ts
│   ├── services/
│   │   ├── finalStorage.ts
│   │   └── printLimit.ts
│   └── types/
│       └── cloudinary.ts
├── .env.example
├── next.config.mjs
├── package.json
└── tsconfig.json
```

## Fluxo implementado
1. Utilizador preenche **Nome + Telemóvel (userID)**.
2. Clique em **Tirar Foto / Upload** abre o widget Cloudinary (camera/galeria).
3. Após upload, a app mostra miniaturas com filtros artísticos Cloudinary.
4. Clique em **Imprimir Foto**:
   - valida limite de 3 no Firestore;
   - incrementa contador se permitido;
   - gera URL final HD com o filtro selecionado;
   - guarda o ficheiro final no Firebase Storage.

## Trechos-chave pedidos

### 1) Upload Cloudinary + Filtros por URL
- Ver: `src/components/WeddingPhotoApp.tsx` e `src/lib/cloudinary.ts`.

### 2) Função de validação/incremento Firestore
- Ver: `src/services/printLimit.ts`.
- Usa `runTransaction` para garantir consistência concorrente do limite.

## Execução

```bash
cp .env.example .env.local
npm install
npm run dev
```
