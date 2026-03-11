import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/server/firebaseAdmin';
import { uploadUrlToDrive } from '@/lib/server/googleDrive';
import { buildCloudinaryUrl } from '@/lib/cloudinary';

type PrintPayload = {
  name: string;
  phone: string;
  publicId: string;
  filterTransformation: string;
  filterId: string;
};

const MAX_PRINTS = 3;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PrintPayload;
    const { name, phone, publicId, filterTransformation, filterId } = body;

    if (!name || !phone || !publicId || !filterTransformation || !filterId) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      return NextResponse.json({ error: 'Cloudinary não configurado.' }, { status: 500 });
    }

    const finalCloudinaryUrl = buildCloudinaryUrl(
      cloudName,
      publicId,
      `${filterTransformation},c_fill,g_auto,h_1800,w_1200`
    );

    const userRef = adminDb.collection('printLimits').doc(phone);
    const txResult = await adminDb.runTransaction(async (tx) => {
      const snapshot = await tx.get(userRef);
      const current = snapshot.exists ? (snapshot.data()?.printsUsed ?? 0) : 0;
      const limitReached = current >= MAX_PRINTS;

      if (!limitReached) {
        tx.set(
          userRef,
          {
            name,
            phone,
            printsUsed: current + 1,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      }

      return {
        limitReached,
        remaining: limitReached ? 0 : MAX_PRINTS - (current + 1)
      };
    });

    const fileName = `${phone}-${Date.now()}-${filterId}.jpg`;
    const driveFile = await uploadUrlToDrive(finalCloudinaryUrl, fileName);

    if (txResult.limitReached) {
      return NextResponse.json({
        ok: true,
        limitReached: true,
        message: 'Limite atingido, mas guardámos a sua foto no álbum digital!',
        driveFile
      });
    }

    return NextResponse.json({
      ok: true,
      limitReached: false,
      remaining: txResult.remaining,
      message: `Foto enviada para impressão. Restam ${txResult.remaining} impressões.`,
      driveFile
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Falha no processamento da impressão.' }, { status: 500 });
  }
}
