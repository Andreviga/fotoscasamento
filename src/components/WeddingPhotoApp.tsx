'use client';

import Script from 'next/script';
import { useMemo, useState } from 'react';
import { buildCloudinaryUrl, CLOUDINARY_FILTERS } from '@/lib/cloudinary';
import { validateAndIncrementPrintLimit } from '@/services/printLimit';
import { storeProcessedPhoto } from '@/services/finalStorage';
import type { CloudinaryUploadResult } from '@/types/cloudinary';

type CloudinaryWidget = {
  createUploadWidget: (options: Record<string, unknown>, callback: (error: unknown, result: { event: string; info: CloudinaryUploadResult }) => void) => { open: () => void };
};

declare global {
  interface Window {
    cloudinary?: CloudinaryWidget;
  }
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

export function WeddingPhotoApp() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [uploaded, setUploaded] = useState<CloudinaryUploadResult | null>(null);
  const [selectedFilter, setSelectedFilter] = useState(CLOUDINARY_FILTERS[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const canOpenWidget = Boolean(name && phone && window.cloudinary && cloudName && uploadPreset);

  const previewUrls = useMemo(() => {
    if (!uploaded) return [];

    return CLOUDINARY_FILTERS.map((filter) => ({
      ...filter,
      url: buildCloudinaryUrl(cloudName, uploaded.public_id, `${filter.transformation},c_fill,g_auto,h_460,w_340`, 340)
    }));
  }, [uploaded]);

  function openCloudinaryWidget() {
    if (!canOpenWidget || !window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'camera'],
        multiple: false,
        cropping: false,
        folder: 'wedding-originals',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'heic']
      },
      (_, result) => {
        if (result?.event === 'success') {
          setUploaded(result.info);
          setMessage('Foto carregada! Escolha um filtro para imprimir.');
        }
      }
    );

    widget.open();
  }

  async function handlePrint() {
    if (!uploaded || !phone || !name) return;
    setLoading(true);
    setMessage('');

    try {
      const limit = await validateAndIncrementPrintLimit(phone, name);
      const finalCloudinaryUrl = buildCloudinaryUrl(
        cloudName,
        uploaded.public_id,
        `${selectedFilter.transformation},c_fill,g_auto,h_1800,w_1200`,
        1200
      );

      const archiveUrl = await storeProcessedPhoto(phone, finalCloudinaryUrl, selectedFilter.id);

      if (!limit.allowed) {
        setMessage('Atingiu o limite de impressões, mas a foto foi guardada no nosso álbum digital!');
        console.info('Foto guardada apenas no álbum digital:', archiveUrl);
        return;
      }

      setMessage(`Foto enviada para impressão! Restam ${limit.remaining} impressões.`);
      console.info('URL final para o Raspberry Pi/print queue:', archiveUrl);
    } catch (error) {
      console.error(error);
      setMessage('Ocorreu um erro ao processar a foto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Script src="https://widget.cloudinary.com/v2.0/global/all.js" strategy="afterInteractive" />
      <main>
        <section className="card">
          <h1>📸 Cabine Fotográfica do Casamento</h1>
          <p className="small">Insira os dados e tire uma foto para imprimir.</p>
          <input className="input" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
          <div style={{ height: 8 }} />
          <input className="input" placeholder="Telemóvel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <div style={{ height: 12 }} />
          <button className="button" onClick={openCloudinaryWidget} disabled={!canOpenWidget}>
            Tirar Foto / Upload
          </button>
        </section>

        {uploaded && (
          <section className="card">
            <h2>Escolha o estilo</h2>
            <div className="grid">
              {previewUrls.map((filter) => (
                <button
                  key={filter.id}
                  className={`thumb ${selectedFilter.id === filter.id ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  <img src={filter.url} alt={filter.label} />
                  <div style={{ padding: '0.5rem' }}>{filter.label}</div>
                </button>
              ))}
            </div>

            <div style={{ height: 12 }} />
            <button className="button" onClick={handlePrint} disabled={loading}>
              {loading ? <div className="spinner" /> : 'Imprimir Foto'}
            </button>
          </section>
        )}

        {message && <section className="card">{message}</section>}
      </main>
    </>
  );
}
