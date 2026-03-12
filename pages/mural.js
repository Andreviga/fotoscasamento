import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebaseClient';

function extractPhotoDate(data) {
  if (typeof data.createdAtMs === 'number') {
    return new Date(data.createdAtMs);
  }

  if (typeof data.dataCriacaoMs === 'number') {
    return new Date(data.dataCriacaoMs);
  }

  if (data.createdAt?.toDate) {
    return data.createdAt.toDate();
  }

  if (data.dataCriacao?.toDate) {
    return data.dataCriacao.toDate();
  }

  if (data.timestamp?.toDate) {
    return data.timestamp.toDate();
  }

  return null;
}

function normalizePhoto(doc) {
  const data = doc.data();
  const photoDate = extractPhotoDate(data);

  return {
    id: doc.id,
    guestName: data.guestName || data.nomeConvidado || data.nome_convidado || 'Convidado',
    imageUrl: data.imageUrl || data.urlFoto || data.url_foto || data.cloudinaryUrl || '',
    createdAtMs: photoDate ? photoDate.getTime() : 0
  };
}

function formatTime(timestampMs) {
  if (!timestampMs) {
    return 'Agora';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(timestampMs);
}

export default function MuralPage() {
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState('Conectando ao mural...');

  useEffect(() => {
    const wallQuery = query(collection(firebaseDb, 'mural'), limit(120));

    const unsubscribe = onSnapshot(
      wallQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map(normalizePhoto)
          .filter((item) => item.imageUrl)
          .sort((first, second) => second.createdAtMs - first.createdAtMs);

        setPhotos(items);
        setStatus(items.length ? 'Atualização em tempo real ativa ✿' : 'Mural pronto para receber a primeira foto.');
      },
      (error) => {
        console.error(error);
        setStatus('Falha ao escutar o Firestore. Revise as variáveis públicas.');
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>Mural ao Vivo ✿ André & Nathália</title>
        <meta name="description" content="Mural ao vivo com as fotos dos convidados." />
      </Head>

      <main className="main" id="mural">
        <div className="hero-haze" />

        <div className="container">
          <div className="section-header">
            <span className="section-kicker">André & Nathália</span>
            <h1 className="mt-3 text-4xl sm:text-6xl">✿ Mural ao Vivo</h1>
            <p className="section-subtitle">Ideal para o telão: cada nova foto publicada aparece automaticamente para todos.</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="rounded-full border border-rose/20 bg-ivory/70 px-4 py-2 text-sm text-wine/75">{status}</p>
            <Link href="/fotos" className="btn btn--outline">
              Abrir Cabine
            </Link>
          </div>

          {photos.length === 0 ? (
            <div className="romantic-panel mt-8 flex min-h-[46vh] items-center justify-center px-6 py-10 text-center">
              <div>
                <p className="font-serifRomance text-4xl text-cocoa">Nenhuma foto ainda ✿</p>
                <p className="mt-3 text-sm text-wine/75">Abra /fotos no celular e publique a primeira memória da festa.</p>
              </div>
            </div>
          ) : (
            <div className="mural-columns mt-8">
              {photos.map((photo) => (
                <article key={photo.id} className="mural-card romantic-panel overflow-hidden">
                  <img src={photo.imageUrl} alt={`Foto de ${photo.guestName || 'Convidado'}`} className="w-full object-cover" />
                  <div className="px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-wine/50">{formatTime(photo.createdAtMs)}</p>
                    <h2 className="mt-1 text-2xl">{photo.guestName || 'Convidado'}</h2>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
