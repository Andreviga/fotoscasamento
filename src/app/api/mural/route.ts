import { FieldValue } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
import { buildCloudinaryUrl, CLOUDINARY_FILTERS } from '@/lib/cloudinary';
import { getAdminDb } from '@/lib/server/firebaseAdmin';
import type { PublishPhotoPayload } from '@/types/cloudinary';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PublishPhotoPayload;
    const guestName = body.guestName?.trim();
    const publicId = body.publicId?.trim();
    const filterId = body.filterId?.trim();
    const filterTransformation = body.filterTransformation?.trim();

    if (!guestName || !publicId || !filterId || !filterTransformation) {
      return NextResponse.json({ error: 'Dados incompletos para publicar no mural.' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      return NextResponse.json({ error: 'Cloudinary não configurado.' }, { status: 500 });
    }

    const filter = CLOUDINARY_FILTERS.find((item) => item.id === filterId);
    if (!filter || filter.transformation !== filterTransformation) {
      return NextResponse.json({ error: 'Filtro inválido.' }, { status: 400 });
    }

    const imageUrl = buildCloudinaryUrl(
      cloudName,
      publicId,
      `${filterTransformation},c_fill,g_auto,h_1600,w_1200`
    );

    const createdAtMs = Date.now();
    const adminDb = getAdminDb();

    const docRef = await adminDb.collection('mural').add({
      guestName,
      imageUrl,
      filterId,
      publicId,
      createdAt: FieldValue.serverTimestamp(),
      createdAtMs
    });

    return NextResponse.json({
      ok: true,
      id: docRef.id,
      imageUrl,
      message: 'Sua foto já está no mural ao vivo ✿'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Não foi possível publicar no mural.' }, { status: 500 });
  }
}
