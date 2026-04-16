import formidable from 'formidable';
import XLSX from 'xlsx';
import crypto from 'crypto';

import { assertAdmin } from '../../lib/adminAuth';
import { getAdminDb } from '../../lib/firebaseAdmin';
import { cleanText, normalizeName } from '../../lib/guestUtils';

export const config = {
  api: {
    bodyParser: false
  }
};

const previewStore = new Map();
const PREVIEW_TTL_MS = 15 * 60 * 1000;

function getCell(row, index) {
  return cleanText(row[index] || '');
}

function sanitizeFaixaEtaria(value) {
  const normalized = cleanText(value).toLowerCase();
  if (!normalized) return '';
  if (normalized.includes('cri')) return 'Crianca';
  if (normalized.includes('adult')) return 'Adulto';
  if (normalized.includes('free')) return 'Free';
  return cleanText(value);
}

function sanitizeGenero(value) {
  const upper = cleanText(value).toUpperCase();
  if (upper === 'M' || upper === 'F') {
    return upper;
  }
  return '';
}

function parseRows(rows) {
  const guests = [];
  const errors = [];
  let currentInviteName = '';
  let currentPhone = '';
  let currentGroup = '';
  let currentObservation = '';

  rows.forEach((row, rowIndex) => {
    const nomeConvite = getCell(row, 0);
    const telefone = getCell(row, 2);
    const grupo = getCell(row, 3);
    const observacao = getCell(row, 4);
    const nomeConvidado = getCell(row, 5);

    if (nomeConvite) currentInviteName = nomeConvite;
    if (telefone) currentPhone = telefone;
    if (grupo) currentGroup = grupo;
    if (observacao) currentObservation = observacao;

    if (!nomeConvidado) {
      return;
    }

    if (!currentInviteName) {
      errors.push(`Linha ${rowIndex + 1}: nome_convite nao identificado.`);
      return;
    }

    guests.push({
      nome: normalizeName(nomeConvidado),
      nomeOriginal: nomeConvidado,
      nomeConvite: currentInviteName,
      mesa: null,
      grupo: currentGroup,
      genero: sanitizeGenero(getCell(row, 6)),
      faixaEtaria: sanitizeFaixaEtaria(getCell(row, 7)),
      confirmado: false,
      telefone: currentPhone,
      observacao: currentObservation
    });
  });

  return { guests, errors };
}

function cleanupPreviewStore() {
  const now = Date.now();
  for (const [key, value] of previewStore.entries()) {
    if (now - value.createdAt > PREVIEW_TTL_MS) {
      previewStore.delete(key);
    }
  }
}

async function parseForm(req) {
  const form = formidable({ multiples: false, maxFileSize: 6 * 1024 * 1024 });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido' });
  }

  if (!assertAdmin(req, res)) {
    return;
  }

  cleanupPreviewStore();

  try {
    const { fields, files } = await parseForm(req);
    const action = cleanText(fields.action || 'preview').toLowerCase();

    if (action === 'confirm') {
      const previewId = cleanText(fields.previewId || '');
      const data = previewStore.get(previewId);

      if (!data) {
        return res.status(404).json({ error: 'Preview expirado ou inexistente' });
      }

      const adminDb = getAdminDb();
      const batchSize = 400;
      let imported = 0;

      for (let start = 0; start < data.guests.length; start += batchSize) {
        const slice = data.guests.slice(start, start + batchSize);
        const batch = adminDb.batch();

        slice.forEach((guest) => {
          const ref = adminDb.collection('convidados').doc();
          batch.set(ref, guest);
        });

        await batch.commit();
        imported += slice.length;
      }

      previewStore.delete(previewId);
      return res.status(200).json({ success: true, importados: imported, erros: data.errors });
    }

    const fileInput = files.file;
    const uploadFile = Array.isArray(fileInput) ? fileInput[0] : fileInput;

    if (!uploadFile || !uploadFile.filepath) {
      return res.status(400).json({ error: 'Arquivo .xlsx obrigatorio' });
    }

    const workbook = XLSX.readFile(uploadFile.filepath);
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const rows = rawRows.slice(8);

    const { guests, errors } = parseRows(rows);

    const previewId = crypto.randomUUID();
    previewStore.set(previewId, {
      createdAt: Date.now(),
      guests,
      errors
    });

    return res.status(200).json({
      previewId,
      total: guests.length,
      erros: errors,
      preview: guests.slice(0, 20)
    });
  } catch (error) {
    console.error('Erro em importGuests:', error);
    return res.status(500).json({ error: 'Falha ao processar planilha', details: error.message });
  }
}
