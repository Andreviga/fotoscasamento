const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { SEATING_GUESTS } = require('../lib/seatingPlan');

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

function readEnvValue(filePath, key) {
  const content = fs.readFileSync(filePath, 'utf8');
  const line = content
    .split(/\r?\n/)
    .find((item) => item.startsWith(`${key}=`));

  if (!line) return '';

  const raw = line.slice(`${key}=`.length).trim();
  if ((raw.startsWith("'") && raw.endsWith("'")) || (raw.startsWith('"') && raw.endsWith('"'))) {
    return raw.slice(1, -1);
  }

  return raw;
}

function extractObjectLiteral(fileContent, constName) {
  const startMarker = `const ${constName} =`;
  const startIndex = fileContent.indexOf(startMarker);
  if (startIndex < 0) {
    throw new Error(`Constante ${constName} não encontrada`);
  }

  const braceStart = fileContent.indexOf('{', startIndex);
  if (braceStart < 0) {
    throw new Error(`Objeto de ${constName} não encontrado`);
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;
  let endIndex = -1;

  for (let i = braceStart; i < fileContent.length; i += 1) {
    const ch = fileContent[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'" && !inSingle) {
      inSingle = true;
      continue;
    }
    if (inSingle && ch === "'") {
      inSingle = false;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"' && !inDouble) {
      inDouble = true;
      continue;
    }
    if (inDouble && ch === '"') {
      inDouble = false;
      continue;
    }

    if (!inSingle && !inDouble && ch === '`' && !inTemplate) {
      inTemplate = true;
      continue;
    }
    if (inTemplate && ch === '`') {
      inTemplate = false;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex < 0) {
    throw new Error(`Fim do objeto ${constName} não encontrado`);
  }

  return fileContent.slice(braceStart, endIndex + 1);
}

function getMenuFallbackObject(projectRoot) {
  const menuFile = path.join(projectRoot, 'pages', 'menu.js');
  const fileContent = fs.readFileSync(menuFile, 'utf8');
  const objectLiteral = extractObjectLiteral(fileContent, 'MENU_FALLBACK');
  // eslint-disable-next-line no-new-func
  return new Function(`return (${objectLiteral});`)();
}

async function run() {
  const projectRoot = path.resolve(__dirname, '..');
  const envPath = path.join(projectRoot, '.env.local');

  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local não encontrado');
  }

  const serviceAccountRaw = readEnvValue(envPath, 'FIREBASE_SERVICE_ACCOUNT_JSON');
  if (!serviceAccountRaw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON não encontrado no .env.local');
  }

  const serviceAccount = JSON.parse(serviceAccountRaw);

  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
  }

  const db = admin.firestore();

  const menuFallback = getMenuFallbackObject(projectRoot);
  await db.collection('config').doc('menu').set(menuFallback, { merge: true });

  const guestsSnapshot = await db.collection('convidados').get();
  const existingByNorm = new Map();

  guestsSnapshot.docs.forEach((doc) => {
    const data = doc.data() || {};
    const norm = normalizeName(data.nomeOriginal || data.nome || '');
    if (norm) {
      existingByNorm.set(norm, doc.id);
    }
  });

  let created = 0;
  let updated = 0;

  for (const guest of SEATING_GUESTS) {
    const nomeOriginal = guest.nomeOriginal || guest.nome || '';
    const norm = normalizeName(nomeOriginal);
    if (!norm) continue;

    const docId = existingByNorm.get(norm) || guest.id;
    const payload = {
      nomeOriginal,
      nome: nomeOriginal,
      nomeConvite: guest.nomeConvite || guest.mesaNome || '',
      grupo: guest.grupo || guest.mesaNome || '',
      mesa: typeof guest.mesa === 'number' ? guest.mesa : null,
      mesaNome: guest.mesaNome || guest.grupo || '',
      confirmado: true,
      source: guest.source || 'seating-plan'
    };

    if (existingByNorm.has(norm)) {
      updated += 1;
    } else {
      created += 1;
      existingByNorm.set(norm, docId);
    }

    await db.collection('convidados').doc(docId).set(payload, { merge: true });
  }

  console.log(JSON.stringify({
    success: true,
    syncedMenu: true,
    convidadosUpdated: updated,
    convidadosCreated: created,
    totalConvidadosFromSeating: SEATING_GUESTS.length
  }, null, 2));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
