'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { buildCloudinaryUrl, CLOUDINARY_FILTERS } from '@/lib/cloudinary';
import type { CloudinaryUploadResult } from '@/types/cloudinary';

type Stage = 'intro' | 'capture' | 'filters' | 'success';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

export function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stage, setStage] = useState<Stage>('intro');
  const [guestName, setGuestName] = useState('');
  const [message, setMessage] = useState('Insira seu nome para começar.');
  const [isLoading, setIsLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState<CloudinaryUploadResult | null>(null);
  const [selectedFilterId, setSelectedFilterId] = useState(CLOUDINARY_FILTERS[0].id);

  useEffect(() => {
    if (stage !== 'capture') {
      return;
    }

    let currentStream: MediaStream | null = null;
    let active = true;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1080 },
            height: { ideal: 1440 }
          },
          audio: false
        });

        if (!active) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        currentStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
        setCameraReady(true);
        setMessage('Tudo pronto. Capture sua foto ou escolha uma da galeria.');
      } catch (error) {
        console.error(error);
        setCameraReady(false);
        setMessage('Sem acesso à câmera. Você ainda pode escolher uma foto da galeria.');
      }
    }

    void startCamera();

    return () => {
      active = false;
      currentStream?.getTracks().forEach((track) => track.stop());
    };
  }, [stage]);

  const selectedFilter = CLOUDINARY_FILTERS.find((item) => item.id === selectedFilterId) ?? CLOUDINARY_FILTERS[0];

  async function handleCapture() {
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

    canvas.toBlob(async (blob) => {
      if (!blob) {
        return;
      }
      await uploadPhoto(blob);
    }, 'image/jpeg', 0.92);
  }

  async function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await uploadPhoto(file);
  }

  async function uploadPhoto(file: Blob) {
    if (!cloudName || !uploadPreset) {
      setMessage('Defina as variáveis do Cloudinary antes de testar esta rota.');
      return;
    }

    setIsLoading(true);
    setMessage('Enviando foto para preparação dos filtros...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'casamento/mural');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const payload = (await response.json()) as CloudinaryUploadResult & { error?: { message?: string } };

      if (!response.ok || !payload.public_id) {
        throw new Error(payload.error?.message || 'Falha no upload da imagem.');
      }

      setUploadedPhoto(payload);
      setSelectedFilterId(CLOUDINARY_FILTERS[0].id);
      setStage('filters');
      setMessage('Escolha o filtro final e publique no mural ✿');
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível carregar a foto para o Cloudinary.');
    } finally {
      setIsLoading(false);
    }
  }

  async function publishToWall() {
    if (!uploadedPhoto) {
      return;
    }

    setIsLoading(true);
    setMessage('Publicando sua foto no mural ao vivo...');

    try {
      const response = await fetch('/api/mural', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName,
          publicId: uploadedPhoto.public_id,
          filterId: selectedFilter.id,
          filterTransformation: selectedFilter.transformation
        })
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao publicar.');
      }

      setStage('success');
      setMessage(payload.message || 'Sua foto já foi publicada no mural ✿');
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível publicar no mural agora.');
    } finally {
      setIsLoading(false);
    }
  }

  function resetFlow() {
    setUploadedPhoto(null);
    setSelectedFilterId(CLOUDINARY_FILTERS[0].id);
    setStage('capture');
    setMessage('Você pode registrar outra memória.');
  }

  const mainPreviewUrl = uploadedPhoto
    ? buildCloudinaryUrl(
        cloudName,
        uploadedPhoto.public_id,
        `${selectedFilter.transformation},c_fill,g_auto,h_1400,w_1080`
      )
    : '';

  return (
    <main className="romantic-shell">
      <div className="hero-haze" />
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="romantic-panel overflow-hidden px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-wine/60">Cabine de Fotos</p>
              <h1 className="mt-2 text-4xl sm:text-5xl">✿ Registre este momento</h1>
            </div>
            <Link href="/mural" className="romantic-button-secondary">
              Ver mural
            </Link>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-7 text-wine/75">
            A estética, as cores suaves e o clima romântico seguem a identidade do site principal, agora em uma experiência pensada para o telemóvel.
          </p>

          {stage === 'intro' && (
            <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
              <div className="romantic-panel border border-rose/15 bg-ivory/75 p-5">
                <label className="text-sm font-semibold text-wine">Seu nome</label>
                <input
                  className="romantic-input mt-3"
                  placeholder="Ex.: Marina"
                  value={guestName}
                  maxLength={40}
                  onChange={(event) => setGuestName(event.target.value)}
                />
                <button className="romantic-button mt-4 w-full" onClick={() => setStage('capture')} disabled={!guestName.trim()}>
                  Abrir câmera
                </button>
              </div>

              <div className="rounded-[28px] border border-rose/20 bg-gradient-to-br from-white to-blush p-5">
                <p className="font-serifRomance text-2xl">Como funciona</p>
                <ol className="mt-4 space-y-3 text-sm leading-7 text-wine/75">
                  <li>1. Digite seu nome e capture uma foto.</li>
                  <li>2. Escolha um filtro artístico suave.</li>
                  <li>3. Poste no mural para aparecer no telão.</li>
                </ol>
              </div>
            </div>
          )}

          {stage === 'capture' && (
            <div className="mt-8 space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-rose/20 bg-cocoa shadow-frame">
                <video ref={videoRef} playsInline muted className="aspect-[3/4] w-full object-cover" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="romantic-button flex-1" onClick={() => void handleCapture()} disabled={!cameraReady || isLoading}>
                  Capturar agora
                </button>
                <label className="romantic-button-secondary flex flex-1 cursor-pointer items-center justify-center">
                  Escolher da galeria
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => void handleFileSelection(event)} />
                </label>
              </div>
            </div>
          )}

          {stage === 'filters' && uploadedPhoto && (
            <div className="mt-8 space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-rose/20 bg-white shadow-frame">
                <img src={mainPreviewUrl} alt="Prévia com filtro selecionado" className="aspect-[4/5] w-full object-cover" />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {CLOUDINARY_FILTERS.map((filter) => {
                  const previewUrl = buildCloudinaryUrl(
                    cloudName,
                    uploadedPhoto.public_id,
                    `${filter.transformation},c_fill,g_auto,h_320,w_240`
                  );

                  const isActive = filter.id === selectedFilterId;

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedFilterId(filter.id)}
                      className={`overflow-hidden rounded-[22px] border bg-white text-left transition ${
                        isActive ? 'border-wine shadow-soft' : 'border-rose/20'
                      }`}
                    >
                      <img src={previewUrl} alt={filter.label} className="aspect-[3/4] w-full object-cover" />
                      <div className="px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-wine/55">{filter.badge}</p>
                        <p className="mt-1 text-xs font-semibold text-cocoa">{filter.label}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="romantic-button flex-1" onClick={() => void publishToWall()} disabled={isLoading}>
                  {isLoading ? 'Publicando...' : 'Postar no mural'}
                </button>
                <button className="romantic-button-secondary flex-1" onClick={resetFlow} disabled={isLoading}>
                  Tirar outra foto
                </button>
              </div>
            </div>
          )}

          {stage === 'success' && uploadedPhoto && (
            <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="overflow-hidden rounded-[28px] border border-rose/20 bg-white shadow-frame">
                <img src={mainPreviewUrl} alt="Foto publicada" className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="flex flex-col justify-center rounded-[28px] border border-rose/20 bg-gradient-to-br from-white to-blush p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-wine/55">Foto publicada</p>
                <h2 className="mt-3 text-4xl">Obrigada, {guestName} ✿</h2>
                <p className="mt-4 text-sm leading-7 text-wine/75">Sua foto já está ao vivo no mural do casamento e será exibida automaticamente no telão da festa.</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button className="romantic-button" onClick={resetFlow}>
                    Publicar outra foto
                  </button>
                  <Link href="/mural" className="romantic-button-secondary">
                    Abrir mural
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="romantic-panel px-5 py-6 sm:px-7 sm:py-8">
          <p className="text-xs uppercase tracking-[0.3em] text-wine/55">Mensagem</p>
          <p className="mt-3 rounded-[24px] border border-rose/15 bg-ivory/70 px-4 py-4 text-sm leading-7 text-wine/80">{message}</p>

          <div className="mt-6 space-y-4">
            <div className="rounded-[28px] border border-rose/20 bg-white p-5">
              <p className="font-serifRomance text-2xl">Visual alinhado ao site</p>
              <p className="mt-2 text-sm leading-7 text-wine/72">
                Fundo claro, serif elegante, detalhes suaves em rosé e botões arredondados para manter a sensação delicada e acolhedora da identidade principal.
              </p>
            </div>

            <div className="rounded-[28px] border border-rose/20 bg-gradient-to-br from-white to-linen p-5">
              <p className="font-serifRomance text-2xl">Dicas para o telão</p>
              <p className="mt-2 text-sm leading-7 text-wine/72">
                Abra a rota do mural em tela cheia no navegador do evento. As novas fotos aparecem sozinhas graças ao listener em tempo real do Firestore.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
