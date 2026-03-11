'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { buildCloudinaryUrl, CLOUDINARY_FILTERS } from '@/lib/cloudinary';
import type { CloudinaryUploadResult } from '@/types/cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

type Stage = 'profile' | 'capture' | 'filters';

export function WeddingPhotoApp() {
  const [stage, setStage] = useState<Stage>('profile');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [captureBlob, setCaptureBlob] = useState<Blob | null>(null);
  const [uploaded, setUploaded] = useState<CloudinaryUploadResult | null>(null);
  const [selectedFilterId, setSelectedFilterId] = useState(CLOUDINARY_FILTERS[0].id);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (stage !== 'capture') return;

    let stream: MediaStream | null = null;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      })
      .catch(() => setMessage('Sem acesso à câmara. Use a galeria abaixo.'));

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stage]);

  const selectedFilter = useMemo(
    () => CLOUDINARY_FILTERS.find((f) => f.id === selectedFilterId) ?? CLOUDINARY_FILTERS[0],
    [selectedFilterId]
  );

  const previewUrls = useMemo(() => {
    if (!uploaded || !cloudName) return [];

    return CLOUDINARY_FILTERS.map((filter) => ({
      ...filter,
      url: buildCloudinaryUrl(
        cloudName,
        uploaded.public_id,
        `${filter.transformation},c_fill,g_auto,h_280,w_220`
      )
    }));
  }, [uploaded]);

  function captureFrame() {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        setCaptureBlob(blob);
        setMessage('Foto capturada! A enviar para filtros...');
        void uploadToCloudinary(blob);
      }
    }, 'image/jpeg');
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setCaptureBlob(file);
    setMessage('Foto selecionada! A enviar para filtros...');
    void uploadToCloudinary(file);
  }

  async function uploadToCloudinary(file: Blob) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'wedding-originals');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload falhou');
      }

      const result = (await response.json()) as CloudinaryUploadResult;
      setUploaded(result);
      setStage('filters');
      setMessage('Escolha um filtro e envie para impressão ✿');
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível enviar a foto para o Cloudinary.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePrint() {
    if (!uploaded || !selectedFilter) return;

    setLoading(true);
    setMessage('A preparar impressão...');

    try {
      const response = await fetch('/api/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          publicId: uploaded.public_id,
          filterTransformation: selectedFilter.transformation,
          filterId: selectedFilter.id
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Erro ao imprimir');
      }

      setMessage(payload.message);
    } catch (error) {
      console.error(error);
      setMessage('Falha no envio para impressão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-5 px-4 py-6">
      <header className="text-center">
        <p className="font-serifRomance text-3xl text-wine">✿ Cabine Fotográfica ✿</p>
        <p className="mt-1 text-sm text-wine/75">Visual romântico, simples e feito para telemóvel.</p>
      </header>

      {stage === 'profile' && (
        <section className="romantic-card p-5">
          <h1 className="font-serifRomance text-2xl">Os seus dados</h1>
          <p className="mb-4 mt-1 text-sm text-wine/70">Use os mesmos dados para manter o limite de 3 impressões.</p>
          <div className="space-y-3">
            <input className="romantic-input" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="romantic-input" placeholder="Telemóvel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <button className="romantic-button mt-4 w-full" onClick={() => setStage('capture')} disabled={!name || !phone}>
            Continuar
          </button>
        </section>
      )}

      {stage === 'capture' && (
        <section className="romantic-card p-4">
          <div className="relative overflow-hidden rounded-2xl border border-rose/25 bg-black">
            <video ref={videoRef} playsInline muted className="aspect-[3/4] w-full object-cover" />
          </div>
          <button className="romantic-button mx-auto mt-4 block h-16 w-16 rounded-full text-xl" onClick={captureFrame}>
            ●
          </button>
          <label className="mt-3 block text-center text-sm text-wine/70">
            ou escolha da galeria
            <input type="file" accept="image/*" capture="environment" className="mt-2 block w-full" onChange={onFileChange} />
          </label>
        </section>
      )}

      {stage === 'filters' && uploaded && (
        <section className="romantic-card p-4">
          <div className="overflow-hidden rounded-2xl border border-rose/25">
            <img
              src={buildCloudinaryUrl(cloudName, uploaded.public_id, `${selectedFilter.transformation},c_fill,g_auto,h_1200,w_900`)}
              alt="Pré-visualização"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>

          <div className="mt-3 grid grid-cols-5 gap-2">
            {previewUrls.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilterId(filter.id)}
                className={`overflow-hidden rounded-xl border ${filter.id === selectedFilterId ? 'border-wine' : 'border-rose/20'}`}
              >
                <img src={filter.url} alt={filter.label} className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>

          <button className="romantic-button mt-4 w-full" onClick={handlePrint} disabled={loading}>
            {loading ? 'A processar...' : 'Imprimir'}
          </button>
        </section>
      )}

      {captureBlob && <p className="text-center text-xs text-wine/55">Imagem pronta para upload ({Math.round(captureBlob.size / 1024)} KB).</p>}
      {message && <p className="romantic-card px-4 py-3 text-center text-sm">{message}</p>}
    </main>
  );
}
