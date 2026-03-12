# Deploy Checklist

## 1. Vercel

### Importação do projeto

1. Acesse o painel da Vercel.
2. Clique em `Add New -> Project`.
3. Importe o repositório `Andreviga/fotoscasamento`.
4. Confirme a branch `main`.
5. Mantenha o framework detectado como `Next.js`.

### Variáveis de ambiente

Cadastre estas variáveis em `Project Settings -> Environment Variables`:

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

### Valor esperado de cada variável

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: nome do cloud no painel do Cloudinary.
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: preset unsigned criado para upload de imagem.
- `NEXT_PUBLIC_FIREBASE_API_KEY`: chave pública do app web no Firebase.
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: normalmente `seu-projeto.firebaseapp.com`.
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: id do projeto Firebase.
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: bucket padrão do projeto.
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: sender id do app web.
- `NEXT_PUBLIC_FIREBASE_APP_ID`: app id do app web.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: JSON completo da service account em linha única.

### Como salvar o JSON da service account

No campo `FIREBASE_SERVICE_ACCOUNT_JSON`, cole o JSON completo sem quebrar em múltiplas variáveis. Exemplo de formato:

```json
{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"..."}
```

Depois de adicionar ou alterar variáveis, faça um novo deploy.

## 2. Firebase

### Criar app web

1. Abra o console do Firebase.
2. Crie ou selecione o projeto do casamento.
3. Em `Project settings -> Your apps`, crie um app web.
4. Copie as credenciais públicas para as variáveis `NEXT_PUBLIC_*`.

### Firestore Database

1. Ative o Firestore em modo production ou test, conforme sua etapa atual.
2. Crie a coleção `mural` automaticamente pelo app ou manualmente.
3. Publique as regras do arquivo `firestore.rules`.

### Publicar regras

No editor de regras do Firestore, substitua o conteúdo atual pelo arquivo `firestore.rules` deste repositório e publique.

## 3. Cloudinary

### Criar upload preset unsigned

1. No painel do Cloudinary, abra `Settings -> Upload`.
2. Em `Upload presets`, crie um preset novo.
3. Marque como `Unsigned`.
4. Se quiser, limite o formato para imagens.
5. Copie o nome desse preset para `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

## 4. Fluxo de teste em produção

1. Abra `/fotos` no celular.
2. Digite um nome e permita acesso à câmera.
3. Capture uma foto ou envie uma imagem da galeria.
4. Escolha um filtro e clique em `Postar no mural`.
5. Abra `/mural` em outro navegador, notebook ou telão.
6. Confirme se a nova foto apareceu em tempo real.

## 5. Problemas comuns

- Erro `Cloudinary não configurado`:
  falta `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` ou `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
- Erro ao publicar no mural:
  normalmente indica problema em `FIREBASE_SERVICE_ACCOUNT_JSON`.
- Mural vazio mesmo após publicar:
  revise as variáveis públicas do Firebase e as regras do Firestore.
- Câmera não abre no celular:
  teste com HTTPS, que a Vercel fornece automaticamente em produção.

## 6. Rotas finais

- `/fotos`
- `/mural`
