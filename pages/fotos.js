import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  collection,
  limit,
  onSnapshot,
  query
} from 'firebase/firestore';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { firebaseDb } from '../lib/firebaseClient';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
const COLLECTION_NAME = 'mural';
const DELETE_TOKENS_STORAGE_KEY = 'muralDeleteTokens';

const FILTERS = [
  {
    id: 'original',
    label: 'Original',
    imageTransformation: 'f_auto,q_auto',
    videoTransformation: 'f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'pb-classico',
    label: 'P&B Clássico',
    imageTransformation: 'e_grayscale,f_auto,q_auto',
    videoTransformation: 'e_grayscale,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'sepia',
    label: 'Sépia',
    imageTransformation: 'e_sepia,f_auto,q_auto',
    videoTransformation: 'e_sepia,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'vibrante',
    label: 'Vibrante',
    imageTransformation: 'e_saturation:35,e_contrast:18,f_auto,q_auto',
    videoTransformation: 'e_saturation:35,e_contrast:18,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'suave',
    label: 'Suave',
    imageTransformation: 'e_brightness:10,e_saturation:-10,f_auto,q_auto',
    videoTransformation: 'e_brightness:10,e_saturation:-10,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'dramatico',
    label: 'Dramático',
    imageTransformation: 'e_contrast:42,e_brightness:-10,f_auto,q_auto',
    videoTransformation: 'e_contrast:42,e_brightness:-10,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'quente',
    label: 'Quente',
    imageTransformation: 'e_red:20,e_blue:-8,f_auto,q_auto',
    videoTransformation: 'e_red:20,e_blue:-8,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'frio',
    label: 'Frio',
    imageTransformation: 'e_blue:20,e_red:-8,f_auto,q_auto',
    videoTransformation: 'e_blue:20,e_red:-8,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'cinema',
    label: 'Cinema',
    imageTransformation: 'e_contrast:30,e_shadow:35,f_auto,q_auto',
    videoTransformation: 'e_contrast:30,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'festa',
    label: 'Festa',
    imageTransformation: 'e_vibrance:45,e_brightness:6,f_auto,q_auto',
    videoTransformation: 'e_vibrance:45,e_brightness:6,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'retro',
    label: 'Retrô',
    imageTransformation: 'e_colorize:45,co_rgb:D9A97A,f_auto,q_auto',
    videoTransformation: 'e_colorize:45,co_rgb:D9A97A,f_auto,q_auto:good,vc_auto'
  },
  {
    id: 'polaroid',
    label: 'Estilo Polaroid',
    imageTransformation: 'f_auto,q_auto,b_white,bo_36px_solid_white,c_fill,g_auto,h_1700,w_1300',
    videoTransformation: 'f_auto,q_auto:good,vc_auto,b_white,bo_24px_solid_white,c_fill,g_auto,h_1700,w_1300'
  }
];

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

function formatDate(timestamp, fallbackMs) {
  const tsDate = timestamp?.toDate ? timestamp.toDate() : null;
  const date = tsDate || (typeof fallbackMs === 'number' ? new Date(fallbackMs) : null);

  if (!date) {
    return 'Agora mesmo';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date);
}

function normalizePhoto(doc) {
  const data = doc.data();
  const photoDate = extractPhotoDate(data);
  const mediaType = data.mediaType === 'video' ? 'video' : 'image';
  const mediaUrl = data.mediaUrl || data.imageUrl || data.urlFoto || data.url_foto || data.cloudinaryUrl || '';

  return {
    id: doc.id,
    guestName: data.guestName || data.nomeConvidado || data.nome_convidado || data.guestName || 'Convidado',
    imageUrl: data.imageUrl || mediaUrl,
    mediaUrl,
    mediaType,
    messageText: data.messageText || '',
    filterId: data.filterId || data.filtro || data.filter || 'original',
    createdAt: data.createdAt || data.dataCriacao || data.timestamp || null,
    createdAtMs: photoDate ? photoDate.getTime() : 0
  };
}

function resolveFilterTransformation(filter, mediaType) {
  if (mediaType === 'video') {
    return filter?.videoTransformation || FILTERS[0].videoTransformation;
  }

  return filter?.imageTransformation || FILTERS[0].imageTransformation;
}

function buildCloudinaryUrl(publicId, transformation, mediaType = 'image') {
  const extension = mediaType === 'video' ? 'mp4' : 'jpg';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${mediaType}/upload/${transformation}/${publicId}.${extension}`;
}

async function uploadUnsignedToCloudinary(fileOrRemoteUrl, folder = 'casamento/fotos') {
  const formData = new FormData();
  formData.append('file', fileOrRemoteUrl);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const payload = await response.json();

  if (!response.ok || !payload.public_id || !payload.secure_url) {
    throw new Error(payload?.error?.message || 'Falha no upload para o Cloudinary.');
  }

  return payload;
}

function normalizeGuestMessage(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 80);
}

function generateDeleteToken() {
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    const randomBytes = new Uint8Array(24);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, (item) => item.toString(16).padStart(2, '0')).join('');
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`;
}

function saveDeleteToken(documentId, deleteToken) {
  if (typeof window === 'undefined' || !documentId || !deleteToken) {
    return;
  }

  try {
    const raw = window.localStorage.getItem(DELETE_TOKENS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[documentId] = deleteToken;
    window.localStorage.setItem(DELETE_TOKENS_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error('Falha ao salvar token de exclusão no navegador', error);
  }
}

export default function FotosPage() {
  const filtersRef = useRef(null);

  const [nomeConvidado, setNomeConvidado] = useState('');
  const [mensagemFoto, setMensagemFoto] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const [fotoBase, setFotoBase] = useState(null);
  const [filtroSelecionadoId, setFiltroSelecionadoId] = useState(FILTERS[0].id);
  const [feed, setFeed] = useState([]);
  const [feedStatus, setFeedStatus] = useState('Conectando ao mural de fotos...');

  const filtroSelecionado = useMemo(
    () => FILTERS.find((item) => item.id === filtroSelecionadoId) || FILTERS[0],
    [filtroSelecionadoId]
  );

  const previewPrincipalUrl = useMemo(() => {
    if (!fotoBase?.publicId) {
      return '';
    }
    const transformation = resolveFilterTransformation(filtroSelecionado, fotoBase.mediaType);
    return buildCloudinaryUrl(
      fotoBase.publicId,
      `${transformation},c_fill,g_auto,h_1400,w_1080`,
      fotoBase.mediaType
    );
  }, [fotoBase, filtroSelecionado]);

  useEffect(() => {
    const feedQuery = query(collection(firebaseDb, COLLECTION_NAME), limit(120));

    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map(normalizePhoto)
          .filter((item) => item.mediaUrl || item.imageUrl)
          .sort((first, second) => second.createdAtMs - first.createdAtMs);

        setFeed(items);
        setFeedStatus(items.length > 0 ? 'Feed atualizado em tempo real ✿' : 'O feed está pronto para a primeira foto.');
      },
      (error) => {
        console.error(error);
        setFeedStatus('Não foi possível ler o feed. Verifique a configuração do Firebase.');
      }
    );

    return () => unsubscribe();
  }, []);

  async function prepararFoto(fileOrBlob) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMensagem('Cloudinary não configurado. Confira as variáveis de ambiente.');
      return;
    }

    // Validação do arquivo
    if (!(fileOrBlob instanceof Blob || fileOrBlob instanceof File)) {
      setMensagem('Arquivo inválido. Tente novamente.');
      return;
    }

    setCarregando(true);
    setMensagem('Enviando mídia para processar filtros...');

    try {
      const uploaded = await uploadUnsignedToCloudinary(fileOrBlob, 'casamento/base');
      const mediaType = uploaded.resource_type === 'video' ? 'video' : 'image';

      setFotoBase({
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url,
        mediaType
      });

      setFiltroSelecionadoId(FILTERS[0].id);
      setPublicado(false);
      setMensagem('');
      setTimeout(() => filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao processar a mídia. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  function escolherDaGaleria(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    void prepararFoto(file);
  }

  async function publicarNoFeed() {
    if (!nomeConvidado.trim()) {
      setMensagem('Digite seu nome antes de publicar.');
      return;
    }

    if (!fotoBase?.publicId) {
      setMensagem('Tire uma foto ou escolha da galeria antes de publicar.');
      return;
    }

    setPublicando(true);
    setMensagem('Publicando no feed em tempo real...');

    try {
      const selectedTransformation = resolveFilterTransformation(filtroSelecionado, fotoBase.mediaType);
      const deleteToken = generateDeleteToken();

      const response = await fetch('/api/publishPhoto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName: nomeConvidado.trim(),
          publicId: fotoBase.publicId,
          filterId: filtroSelecionado.id,
          filterTransformation: selectedTransformation,
          mediaType: fotoBase.mediaType,
          messageText: normalizeGuestMessage(mensagemFoto),
          deleteToken
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Não foi possível publicar no mural.');
      }

      if (payload?.documentId) {
        saveDeleteToken(payload.documentId, deleteToken);
      }

      setPublicado(true);
      setFotoBase(null);
      setFiltroSelecionadoId(FILTERS[0].id);
      setNomeConvidado('');
      setMensagemFoto('');
      setMensagem(payload?.message || 'Mídia publicada com sucesso no mural ✿');
    } catch (error) {
      console.error(error);
      setMensagem(error?.message || 'Não foi possível publicar sua mídia. Tente novamente em instantes.');
    } finally {
      setPublicando(false);
    }
  }

  const step = publicado ? 3 : fotoBase ? 2 : 1;

  return (
    <>
      <Head>
        <title>Instacasamento ✿ André & Nathália</title>
        <meta
          name="description"
          content="Instacasamento com foto e vídeo, filtros divertidos e mural em tempo real para o casamento."
        />
      </Head>

      <Header />

      <main className="main" id="fotos">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">André & Nathália</span>
            <h1>Instacasamento</h1>
            <p className="section-subtitle">
              Tire foto ou grave vídeo, escolha entre vários filtros e publique direto no feed da festa.
            </p>
          </div>

          <div className="step-indicator">
            <div className={`step-indicator__item${step > 1 ? ' step-indicator__item--done' : ' step-indicator__item--active'}`}>
              <span className="step-indicator__num">{step > 1 ? '✓' : '1'}</span>
              <span className="step-indicator__label">Foto</span>
            </div>
            <div className="step-indicator__line" />
            <div className={`step-indicator__item${step > 2 ? ' step-indicator__item--done' : step >= 2 ? ' step-indicator__item--active' : ' step-indicator__item--pending'}`}>
              <span className="step-indicator__num">{step > 2 ? '✓' : '2'}</span>
              <span className="step-indicator__label">Filtro</span>
            </div>
            <div className="step-indicator__line" />
            <div className={`step-indicator__item${step === 3 ? ' step-indicator__item--done' : ' step-indicator__item--pending'}`}>
              <span className="step-indicator__num">{step === 3 ? '✓' : '3'}</span>
              <span className="step-indicator__label">Publicar</span>
            </div>
          </div>

          <section className="photo-booth">
            <div className="photo-booth__left">
              <div className="camera-stage">
                {previewPrincipalUrl ? (
                  fotoBase?.mediaType === 'video' ? (
                    <video
                      src={previewPrincipalUrl}
                      className="camera-stage__media"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={previewPrincipalUrl}
                      alt="Pré-visualização da foto com filtro"
                      className="camera-stage__media"
                    />
                  )
                ) : (
                  <div className="camera-stage__placeholder">
                    Use a câmera do celular ou escolha foto/vídeo da galeria.
                  </div>
                )}
              </div>

              <div className="booth-actions">
                <label className="btn btn--primary">
                  Tirar Foto Agora
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="input-file-hidden"
                    disabled={carregando || publicando}
                    onChange={escolherDaGaleria}
                  />
                </label>

                <label className="btn btn--outline">
                  Gravar Vídeo Agora
                  <input
                    type="file"
                    accept="video/*"
                    capture="environment"
                    className="input-file-hidden"
                    disabled={carregando || publicando}
                    onChange={escolherDaGaleria}
                  />
                </label>

                <label className="btn btn--outline">
                  Escolher da Galeria
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="input-file-hidden"
                    disabled={carregando || publicando}
                    onChange={escolherDaGaleria}
                  />
                </label>
              </div>
            </div>

            <div className="photo-booth__right" ref={filtersRef}>
              {step === 3 ? (
                <div className="booth-success">
                  <div className="booth-success__icon">✿</div>
                  <h2 className="panel-title">Mídia publicada!</h2>
                  <p className="panel-subtitle">Ela já deve aparecer no mural da festa em instantes.</p>
                  <button type="button" className="btn btn--outline" onClick={() => setPublicado(false)}>
                    Publicar outra mídia
                  </button>
                </div>
              ) : (
              <>
              <h2 className="panel-title">
                {fotoBase ? 'Muitos Filtros' : 'Como usar'}
              </h2>
              <p className="panel-subtitle">
                {fotoBase
                  ? 'Escolha um estilo para sua mídia antes de publicar.'
                  : 'Capture foto/vídeo no celular, escolha o filtro e publique no feed da festa.'}
              </p>

              <div className="filter-grid">
                {FILTERS.map((filter) => {
                  const isVideo = fotoBase?.mediaType === 'video';
                  const thumbTransformation = resolveFilterTransformation(filter, isVideo ? 'video' : 'image');
                  const thumbUrl = fotoBase?.publicId
                    ? buildCloudinaryUrl(fotoBase.publicId, `${thumbTransformation},c_fill,g_auto,h_300,w_250`, isVideo ? 'video' : 'image')
                    : '';

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      className={`filter-card${filtroSelecionadoId === filter.id ? ' filter-card--active' : ''}`}
                      onClick={() => setFiltroSelecionadoId(filter.id)}
                      disabled={!fotoBase?.publicId}
                    >
                      {thumbUrl ? (
                        isVideo ? (
                          <video
                            src={thumbUrl}
                            className="filter-card__thumb"
                            muted
                            playsInline
                            loop
                            autoPlay
                            preload="metadata"
                          />
                        ) : (
                          <img src={thumbUrl} alt={filter.label} className="filter-card__thumb" />
                        )
                      ) : (
                        <div className="filter-card__thumb filter-card__thumb--empty" />
                      )}
                      <span className="filter-card__label">{filter.label}</span>
                    </button>
                  );
                })}
              </div>

              {fotoBase && (
                <>
                  <label htmlFor="nomeConvidado" className="form-label">
                    Seu nome
                  </label>
                  <input
                    id="nomeConvidado"
                    className="input-elegant"
                    placeholder="Ex.: Mariana"
                    value={nomeConvidado}
                    maxLength={40}
                    onChange={(event) => setNomeConvidado(event.target.value)}
                  />

                  <label htmlFor="mensagemFoto" className="form-label" style={{ marginTop: '0.9rem' }}>
                    Mensagem na mídia (opcional)
                  </label>
                  <input
                    id="mensagemFoto"
                    className="input-elegant"
                    placeholder="Ex.: Viva os noivos ✿"
                    value={mensagemFoto}
                    maxLength={80}
                    onChange={(event) => setMensagemFoto(event.target.value)}
                  />
                </>
              )}

              <div className="publish-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => void publicarNoFeed()}
                  disabled={!fotoBase?.publicId || !nomeConvidado.trim() || publicando || carregando}
                >
                  {publicando ? 'Publicando...' : carregando ? 'Processando...' : 'Publicar no Feed'}
                </button>
              </div>

              {mensagem && <p className="status-message">{mensagem}</p>}
              </>
              )}
            </div>
          </section>

          <section className="photo-feed-section" aria-live="polite">
            <div className="section-header section-header--left">
              <span className="section-kicker">Mural da Festa</span>
              <h2>Feed Contínuo de Mídias</h2>
              <p className="section-subtitle section-subtitle--left">{feedStatus}</p>
            </div>

            {feed.length === 0 ? (
              <div className="empty-state-panel">
                O feed ainda está vazio. Publique a primeira foto para inaugurar este mural ✿
              </div>
            ) : (
              <div className="photo-feed-grid">
                {feed.map((item) => (
                  <article key={item.id} className="photo-feed-card">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.mediaUrl || item.imageUrl}
                        className="photo-feed-card__image"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={item.mediaUrl || item.imageUrl}
                        alt={`Foto publicada por ${item.guestName || 'Convidado'}`}
                        className="photo-feed-card__image"
                      />
                    )}
                    <div className="photo-feed-card__content">
                      <h3>{item.guestName || 'Convidado'}</h3>
                      {item.messageText ? <p>{item.messageText}</p> : null}
                      <p>{formatDate(item.createdAt, item.createdAtMs)}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
