import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import GuestJourney from '../components/GuestJourney';
import PageTitle from '../components/PageTitle';
import { firebaseDb } from '@/lib/firebaseClient';

const DELETE_TOKENS_STORAGE_KEY = 'muralDeleteTokens';

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
  const mediaType = data.mediaType === 'video' ? 'video' : 'image';
  const mediaUrl = data.mediaUrl || data.imageUrl || data.urlFoto || data.url_foto || data.cloudinaryUrl || '';

  return {
    id: doc.id,
    guestName: data.guestName || data.nomeConvidado || data.nome_convidado || 'Convidado',
    mediaType,
    mediaUrl,
    imageUrl: data.imageUrl || mediaUrl,
    messageText: data.messageText || '',
    createdAtMs: photoDate ? photoDate.getTime() : 0
  };
}

function loadDeleteTokensMap() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(DELETE_TOKENS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.error('Falha ao ler tokens de exclusão', error);
    return {};
  }
}

function removeDeleteToken(documentId) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const map = loadDeleteTokensMap();
    delete map[documentId];
    window.localStorage.setItem(DELETE_TOKENS_STORAGE_KEY, JSON.stringify(map));
  } catch (error) {
    console.error('Falha ao remover token de exclusão', error);
  }
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
  const [deleteTokens, setDeleteTokens] = useState({});
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    const wallQuery = query(collection(firebaseDb, 'mural'), limit(120));

    const unsubscribe = onSnapshot(
      wallQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map(normalizePhoto)
          .filter((item) => item.mediaUrl || item.imageUrl)
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

  useEffect(() => {
    setDeleteTokens(loadDeleteTokensMap());
  }, []);

  async function excluirMidia(documentId) {
    const deleteToken = deleteTokens?.[documentId];

    if (!deleteToken) {
      return;
    }

    setDeletingId(documentId);

    try {
      const response = await fetch('/api/deleteMedia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ documentId, deleteToken })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Não foi possível excluir a mídia.');
      }

      removeDeleteToken(documentId);
      setDeleteTokens((current) => {
        const next = { ...current };
        delete next[documentId];
        return next;
      });
      setStatus('Mídia excluída com sucesso.');
    } catch (error) {
      console.error(error);
      setStatus(error?.message || 'Falha ao excluir a mídia.');
    } finally {
      setDeletingId('');
    }
  }

  return (
    <>
      <Head>
        <title>Mural ao Vivo ✿ André & Nathália</title>
        <meta name="description" content="Mural ao vivo com as fotos dos convidados." />
      </Head>

      <WeddingHeader />

      <main className="main" id="mural">
        <div className="hero-haze" />

        <div className="container relative z-10">
          <PageTitle
            kicker="Mural"
            title="Mural ao Vivo"
            subtitle="Ideal para o telao: cada nova midia publicada aparece automaticamente para todos."
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="rounded-full border border-rose/20 bg-ivory/70 px-4 py-2 text-sm text-wine/75">{status}</p>
            <Link href="/fotos" className="btn btn--outline">
              Abrir Instacasamento
            </Link>
          </div>

          {photos.length === 0 ? (
            <div className="romantic-panel mt-8 flex min-h-[46vh] items-center justify-center px-6 py-10 text-center">
              <div>
                <p className="font-serifRomance text-4xl text-cocoa">Nenhuma mídia ainda ✿</p>
                <p className="mt-3 text-sm text-wine/75">Abra /fotos no celular e publique a primeira memória da festa.</p>
              </div>
            </div>
          ) : (
            <div className="mural-columns mt-8">
              {photos.map((photo) => (
                <article key={photo.id} className="mural-card romantic-panel overflow-hidden">
                  {photo.mediaType === 'video' ? (
                    <video
                      src={photo.mediaUrl || photo.imageUrl}
                      className="w-full object-cover"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img src={photo.mediaUrl || photo.imageUrl} alt={`Foto de ${photo.guestName || 'Convidado'}`} className="w-full object-cover" />
                  )}
                  <div className="px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-wine/50">{formatTime(photo.createdAtMs)}</p>
                    <h2 className="mt-1 text-2xl">{photo.guestName || 'Convidado'}</h2>
                    {photo.messageText ? <p className="mt-2 text-sm text-wine/75">{photo.messageText}</p> : null}
                    {deleteTokens?.[photo.id] ? (
                      <button
                        type="button"
                        className="btn btn--outline mt-3"
                        onClick={() => void excluirMidia(photo.id)}
                        disabled={deletingId === photo.id}
                      >
                        {deletingId === photo.id ? 'Excluindo...' : 'Excluir minha mídia'}
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8">
            <GuestJourney
              currentPath="/mural"
              compact
              title="Continue a acompanhar a festa"
              subtitle="Volte ao Instacasamento para publicar outra memoria, confira sua mesa ou use o mapa do salao para se orientar no evento."
            />
          </div>
        </div>
      </main>

      <WeddingFooter />
    </>
  );
}
