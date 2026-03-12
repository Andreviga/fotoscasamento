import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebaseClient';

const FILTERS = [
  { id: 'original', label: 'Original', transformation: 'f_auto,q_auto' },
  { id: 'audrey', label: 'P&B', transformation: 'e_art:audrey,f_auto,q_auto' },
  { id: 'zorro', label: 'Sépia', transformation: 'e_art:zorro,f_auto,q_auto' }
];

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

function buildCloudinaryUrl(publicId, transformation) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}.jpg`;
}

export default function FotosPage() {
  const videoRef = useRef(null);
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState('Digite seu nome e registre este momento ✿');
  const [uploaded, setUploaded] = useState(null);
  const [selectedFilterId, setSelectedFilterId] = useState(FILTERS[0].id);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraEnabled(true);
        }
      } catch (error) {
        console.error(error);
        setCameraEnabled(false);
        setMessage('Sem acesso à câmera. Você pode escolher uma foto da galeria.');
      }
    }

    void startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const selectedFilter = useMemo(() => FILTERS.find((item) => item.id === selectedFilterId) || FILTERS[0], [selectedFilterId]);

  const mainPreviewUrl = uploaded
    ? buildCloudinaryUrl(uploaded.public_id, `${selectedFilter.transformation},c_fill,g_auto,h_1400,w_1080`)
    : '';

  async function uploadToCloudinary(file) {
    if (!cloudName || !uploadPreset) {
      setMessage('Cloudinary não configurado. Verifique as variáveis de ambiente.');
      return;
    }

    setUploading(true);
    setMessage('Enviando foto para preparar os filtros...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'casamento/mural');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const payload = await response.json();
      if (!response.ok || !payload.public_id) {
        throw new Error(payload?.error?.message || 'Falha no upload para o Cloudinary.');
      }

      setUploaded(payload);
      setSelectedFilterId(FILTERS[0].id);
      setMessage('Selecione um filtro e publique no mural.');
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível enviar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  function handleCapture() {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          void uploadToCloudinary(blob);
        }
      },
      'image/jpeg',
      0.92
    );
  }

  function handleGalleryChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    void uploadToCloudinary(file);
  }

  async function publishToMural() {
    if (!uploaded || !nomeConvidado.trim()) {
      setMessage('Digite seu nome e selecione uma foto para publicar.');
      return;
    }

    setPublishing(true);
    setMessage('Publicando no mural ao vivo...');

    try {
      const urlFoto = buildCloudinaryUrl(
        uploaded.public_id,
        `${selectedFilter.transformation},c_fill,g_auto,h_1600,w_1200`
      );

      await addDoc(collection(firebaseDb, 'mural'), {
        nome_convidado: nomeConvidado.trim(),
        url_foto: urlFoto,
        filtro: selectedFilter.id,
        timestamp: serverTimestamp()
      });

      setMessage('Foto publicada com sucesso! Veja no mural ao vivo ✿');
      setUploaded(null);
      setSelectedFilterId(FILTERS[0].id);
    } catch (error) {
      console.error(error);
      setMessage('Erro ao publicar no mural. Verifique as configurações do Firebase.');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <>
      <Head>
        <title>Cabine de Fotos ✿ André & Nathália</title>
        <meta name="description" content="Cabine de fotos digital do casamento de André & Nathália." />
      </Head>

      <main className="main" id="fotos">
        <div className="hero-haze" />
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">André & Nathália</span>
            <h1 className="mt-3 text-4xl sm:text-5xl">✿ Cabine de Fotos Digital</h1>
            <p className="section-subtitle">A mesma identidade visual do site, com captura instantânea e publicação no mural em tempo real.</p>
          </div>

          <div className="romantic-panel mt-8 grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
            <section>
              <label htmlFor="nomeConvidado" className="mb-2 block text-sm font-semibold text-wine">
                Nome do convidado
              </label>
              <input
                id="nomeConvidado"
                className="input-elegant"
                placeholder="Ex.: Camila"
                value={nomeConvidado}
                maxLength={40}
                onChange={(event) => setNomeConvidado(event.target.value)}
              />

              <div className="mt-5 overflow-hidden rounded-[28px] border border-rose/20 bg-cocoa/95 shadow-frame">
                <video ref={videoRef} playsInline muted className="aspect-[3/4] w-full object-cover" />
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="btn btn--primary" onClick={handleCapture} disabled={!cameraEnabled || uploading}>
                  {uploading ? 'Enviando...' : 'Tirar Foto'}
                </button>

                <label className="btn btn--outline cursor-pointer">
                  Escolher da Galeria
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleGalleryChange} />
                </label>
              </div>
            </section>

            <section>
              <div className="overflow-hidden rounded-[28px] border border-rose/20 bg-white shadow-frame">
                {uploaded ? (
                  <img src={mainPreviewUrl} alt="Prévia da foto" className="aspect-[4/5] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center bg-gradient-to-b from-blush to-linen px-6 text-center text-sm text-wine/75">
                    Sua prévia aparecerá aqui após capturar ou escolher uma foto.
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {FILTERS.map((filter) => {
                  const preview = uploaded
                    ? buildCloudinaryUrl(uploaded.public_id, `${filter.transformation},c_fill,g_auto,h_260,w_200`)
                    : null;
                  const active = filter.id === selectedFilterId;

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      className={`overflow-hidden rounded-[18px] border text-left ${active ? 'border-wine shadow-soft' : 'border-rose/25'}`}
                      onClick={() => setSelectedFilterId(filter.id)}
                      disabled={!uploaded}
                    >
                      {preview ? (
                        <img src={preview} alt={filter.label} className="aspect-square w-full object-cover" />
                      ) : (
                        <div className="aspect-square w-full bg-linen" />
                      )}
                      <p className="px-2 py-2 text-xs font-semibold text-cocoa">{filter.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="btn btn--primary" onClick={() => void publishToMural()} disabled={!uploaded || !nomeConvidado.trim() || publishing}>
                  {publishing ? 'Publicando...' : 'Publicar no Mural'}
                </button>
                <Link href="/mural" className="btn btn--outline">
                  Abrir Telão
                </Link>
              </div>

              <p className="mt-4 rounded-[20px] border border-rose/20 bg-ivory/70 px-4 py-3 text-sm text-wine/80">{message}</p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
