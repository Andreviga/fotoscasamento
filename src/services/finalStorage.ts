import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export async function storeProcessedPhoto(
  userId: string,
  cloudinaryFinalUrl: string,
  filterId: string
): Promise<string> {
  const response = await fetch(cloudinaryFinalUrl);
  const blob = await response.blob();

  const now = Date.now();
  const fileRef = ref(storage, `wedding-prints/${userId}/${now}-${filterId}.jpg`);

  await uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });

  return getDownloadURL(fileRef);
}
