'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebaseClient';
import type { MuralPhoto } from '@/types/mural';

export function LiveWall() {
  const [photos, setPhotos] = useState<MuralPhoto[]>([]);
  const [status, setStatus] = useState('Conectando ao mural em tempo real...');

  useEffect(() => {
    const wallQuery = query(collection(firebaseDb, 'mural'), orderBy('createdAtMs', 'desc'), limit(80));

    const unsubscribe = onSnapshot(
      wallQuery,
      (snapshot) => {
        const nextPhotos = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            guestName: String(data.guestName ?? 'Convidado'),
            imageUrl: String(data.imageUrl ?? ''),
            filterId: String(data.filterId ?? 'original'),
            publicId: String(data.publicId ?? ''),
            createdAtMs: Number(data.createdAtMs ?? 0)
          } satisfies MuralPhoto;
        });

        setPhotos(nextPhotos);
        setStatus(nextPhotos.length ? 'Novas memórias aparecem automaticamente.' : 'O mural está pronto para receber a primeira foto.');
      },
      (error) => {
        console.error(error);
        setStatus('Não foi possível escutar o Firestore. Verifique as variáveis públicas do Firebase.');
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <main className="romantic-shell">
      <div className="hero-haze" />

      <section className="romantic-panel px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex flex-col gap-4 border-b border-rose/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-wine/55">Mural ao Vivo</p>
            <h1 className="mt-2 text-4xl sm:text-6xl">✿ André & Nathália</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-wine/72">
              Página pensada para telão: visual elegante, leitura limpa e atualização imediata quando um convidado publica uma nova foto.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/fotos" className="romantic-button">
              Abrir cabine
            </Link>
            <div className="rounded-full border border-rose/20 bg-ivory/70 px-4 py-3 text-sm text-wine/75">{status}</div>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="max-w-md text-center">
              <p className="font-serifRomance text-4xl">O mural espera pela primeira foto ✿</p>
              <p className="mt-4 text-sm leading-7 text-wine/72">Assim que alguém publicar em /fotos, a imagem aparecerá aqui automaticamente.</p>
            </div>
          </div>
        ) : (
          <div className="mural-columns mt-8">
            {photos.map((photo, index) => {
              const formattedTime = photo.createdAtMs
                ? new Intl.DateTimeFormat('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }).format(photo.createdAtMs)
                : 'Agora';

              return (
                <article key={photo.id} className="mural-card romantic-panel overflow-hidden">
                  <div className="overflow-hidden bg-linen">
                    <img
                      src={photo.imageUrl}
                      alt={`Foto publicada por ${photo.guestName}`}
                      className={`w-full object-cover transition ${index === 0 ? 'max-h-[36rem]' : 'max-h-[32rem]'}`}
                    />
                  </div>
                  <div className="space-y-2 px-4 py-4 sm:px-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-wine/50">{formattedTime}</p>
                    <h2 className="text-2xl">{photo.guestName}</h2>
                    <p className="text-sm text-wine/70">Filtro {photo.filterId}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}