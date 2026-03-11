import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MAX_PRINTS = 3;

export async function validateAndIncrementPrintLimit(userId: string, name: string) {
  const ref = doc(db, 'printLimits', userId);

  return runTransaction(db, async (tx) => {
    const snapshot = await tx.get(ref);

    if (!snapshot.exists()) {
      tx.set(ref, {
        name,
        phone: userId,
        printsUsed: 1,
        updatedAt: serverTimestamp()
      });
      return { allowed: true, remaining: MAX_PRINTS - 1 };
    }

    const current = snapshot.data().printsUsed ?? 0;

    if (current >= MAX_PRINTS) {
      return { allowed: false, remaining: 0 };
    }

    tx.update(ref, {
      name,
      printsUsed: current + 1,
      updatedAt: serverTimestamp()
    });

    return { allowed: true, remaining: MAX_PRINTS - (current + 1) };
  });
}
