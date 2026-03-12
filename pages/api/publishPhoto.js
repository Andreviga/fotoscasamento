import { getAdminDb } from '../../lib/firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

const ALLOWED_MEDIA_TYPES = new Set(['image', 'video']);

function normalizeText(value, maxLength = 120) {
  if (typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized.slice(0, maxLength);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function encodeOverlayText(text) {
  return encodeURIComponent(text)
    .replace(/%20/g, '%20')
    .replace(/,/g, '%2C')
    .replace(/\//g, '%2F');
}

function buildCloudinaryDeliveryUrl({ cloudName, publicId, mediaType, filterTransformation, messageText }) {
  const normalizedTransformation = filterTransformation || (mediaType === 'video'
    ? 'f_auto,q_auto:good,vc_auto'
    : 'f_auto,q_auto');

  const gravity = mediaType === 'video' ? 'g_center' : 'g_auto';

  const baseTransformation = `${normalizedTransformation},c_fill,${gravity},h_1600,w_1200`;

  const safeMessage = normalizeText(messageText, 80);

  const overlayTransformation = safeMessage
    ? `/l_text:Arial_46_bold:${encodeOverlayText(safeMessage)},co_rgb:FFFFFF,o_92/c_fit,w_0.9/fl_layer_apply,g_south,y_42`
    : '';

  return `https://res.cloudinary.com/${cloudName}/${mediaType}/upload/${baseTransformation}${overlayTransformation}/${publicId}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const {
      guestName,
      publicId,
      filterId,
      filterTransformation,
      mediaType,
      messageText,
      deleteToken
    } = req.body ?? {};

    const safeGuestName = normalizeText(guestName, 40);
    const safePublicId = normalizeText(publicId, 220);
    const safeFilterId = normalizeText(filterId, 40) || 'original';
    const safeFilterTransformation = normalizeText(filterTransformation, 200) || 'f_auto,q_auto';
    const safeMediaType = normalizeText(mediaType, 10) || 'image';
    const safeMessage = normalizeText(messageText, 80);
    const safeDeleteToken = normalizeText(deleteToken, 128);

    if (!safeGuestName || !safePublicId) {
      return res.status(400).json({ error: 'Nome e mídia são obrigatórios.' });
    }

    if (!ALLOWED_MEDIA_TYPES.has(safeMediaType)) {
      return res.status(400).json({ error: 'Tipo de mídia inválido.' });
    }

    if (!safeDeleteToken || safeDeleteToken.length < 16) {
      return res.status(400).json({ error: 'Token de segurança inválido.' });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      return res.status(500).json({ error: 'Cloudinary não configurado no servidor.' });
    }

    const mediaUrl = buildCloudinaryDeliveryUrl({
      cloudName,
      publicId: safePublicId,
      mediaType: safeMediaType,
      filterTransformation: safeFilterTransformation,
      messageText: safeMessage
    });

    const adminDb = getAdminDb();
    const docRef = await adminDb.collection('mural').add({
      guestName: safeGuestName,
      mediaType: safeMediaType,
      mediaUrl,
      imageUrl: safeMediaType === 'image' ? mediaUrl : '',
      messageText: safeMessage,
      filterId: safeFilterId,
      publicId: safePublicId,
      deleteTokenHash: hashToken(safeDeleteToken),
      createdAt: FieldValue.serverTimestamp(),
      createdAtMs: Date.now()
    });

    return res.status(200).json({
      success: true,
      documentId: docRef.id,
      mediaUrl,
      message: 'Mídia publicada com sucesso no mural ✿'
    });
  } catch (error) {
    console.error('Erro ao publicar foto:', error);
    return res.status(500).json({
      error: 'Erro ao publicar mídia',
      details: error.message
    });
  }
}
