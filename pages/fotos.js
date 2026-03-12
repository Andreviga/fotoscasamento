import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  query,
  serverTimestamp
} from 'firebase/firestore';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { firebaseDb } from '../lib/firebaseClient';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
const COLLECTION_NAME = 'mural';

const FILTERS = [
  { id: 'original', label: 'Original', transformation: 'f_auto,q_auto' },
  { id: 'pb-elegante', label: 'P&B elegante', transformation: 'e_art:audrey,f_auto,q_auto' },
  { id: 'vintage-sepia', label: 'Vintage Sépia', transformation: 'e_art:zorro,f_auto,q_auto' },
  { id: 'cores-vivas', label: 'Cores Vivas', transformation: 'e_improve,f_auto,q_auto' },
  {
    id: 'polaroid',
    label: 'Estilo Polaroid',
    transformation: 'f_auto,q_auto,b_white,bo_36px_solid_white,c_fill,g_auto,h_1700,w_1300'
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

  return {
    id: doc.id,
    guestName: data.guestName || data.nomeConvidado || data.nome_convidado || data.guestName || 'Convidado',
    imageUrl: data.imageUrl || data.urlFoto || data.url_foto || data.cloudinaryUrl || '',
    filterId: data.filterId || data.filtro || data.filter || 'original',
    createdAt: data.createdAt || data.dataCriacao || data.timestamp || null,
    createdAtMs: photoDate ? photoDate.getTime() : 0
  };
}

function buildCloudinaryUrl(publicId, transformation) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}.jpg`;
}

async function uploadUnsignedToCloudinary(fileOrRemoteUrl, folder = 'casamento/fotos') {
  const formData = new FormData();
  formData.append('file', fileOrRemoteUrl);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
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

export default function FotosPage() {
  const filtersRef = useRef(null);

  const [nomeConvidado, setNomeConvidado] = useState('');
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
    return buildCloudinaryUrl(fotoBase.publicId, filtroSelecionado.transformation);
  }, [fotoBase, filtroSelecionado]);

  useEffect(() => {
    const feedQuery = query(collection(firebaseDb, COLLECTION_NAME), limit(120));

    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        const items = snapshot.docs
          .map(normalizePhoto)
          .filter((item) => item.imageUrl)
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
    setMensagem('Enviando imagem para processar filtros...');

    try {
      const uploaded = await uploadUnsignedToCloudinary(fileOrBlob, 'casamento/base');

      setFotoBase({
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url
      });

      setFiltroSelecionadoId(FILTERS[0].id);
      setPublicado(false);
      setMensagem('');
      setTimeout(() => filtersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
    } catch (error) {
      console.error(error);
      setMensagem('Erro ao processar a foto. Tente novamente.');
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
      setMensagem('Digite seu nome antes de publicar a foto.');
      return;
    }

    if (!fotoBase?.publicId) {
      setMensagem('Tire uma foto ou escolha da galeria antes de publicar.');
      return;
    }

    setPublicando(true);
    setMensagem('Publicando no feed em tempo real...');

    try {
      const transformedUrl = buildCloudinaryUrl(fotoBase.publicId, filtroSelecionado.transformation);
      const finalUpload = await uploadUnsignedToCloudinary(transformedUrl, 'casamento/feed');
      const createdAtMs = Date.now();

      await addDoc(collection(firebaseDb, COLLECTION_NAME), {
        guestName: nomeConvidado.trim(),
        imageUrl: finalUpload.secure_url,
        filterId: filtroSelecionado.id,
        publicId: finalUpload.public_id || fotoBase.publicId,
        createdAt: serverTimestamp(),
        createdAtMs
      });

      setPublicado(true);
      setFotoBase(null);
      setFiltroSelecionadoId(FILTERS[0].id);
      setNomeConvidado('');
    } catch (error) {
      console.error(error);
      setMensagem('Não foi possível publicar sua foto. Tente novamente em instantes.');
    } finally {
      setPublicando(false);
    }
  }

  const step = publicado ? 3 : fotoBase ? 2 : 1;

  return (
    <>
      <Head>
        <title>Cabine de Fotos e Feed ✿ André & Nathália</title>
        <meta
          name="description"
          content="Cabine de fotos digital com filtros divertidos e feed em tempo real para o casamento."
        />
      </Head>

      <Header />

      <main className="main" id="fotos">
        <div className="container">
          <div className="section-header">
            <span className="section-kicker">André & Nathália</span>
            <h1>Cabine de Fotos Digital</h1>
            <p className="section-subtitle">
              Tire uma foto divertida, aplique seu filtro favorito e publique direto no feed da festa.
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
                  <img
                    src={previewPrincipalUrl}
                    alt="Pré-visualização da foto com filtro"
                    className="camera-stage__media"
                  />
                ) : (
                  <div className="camera-stage__placeholder">
                    Use a câmera do celular ou escolha uma foto pronta da galeria.
                  </div>
                )}
              </div>

              <div className="booth-actions">
                <label className="btn btn--primary">
                  Usar Câmera do Celular
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    className="input-file-hidden"
                    disabled={carregando || publicando}
                    onChange={escolherDaGaleria}
                  />
                </label>

                <label className="btn btn--outline">
                  Escolher da Galeria
                  <input
                    type="file"
                    accept="image/*"
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
                  <h2 className="panel-title">Foto publicada!</h2>
                  <p className="panel-subtitle">Ela já deve aparecer no mural da festa em instantes.</p>
                  <button type="button" className="btn btn--outline" onClick={() => setPublicado(false)}>
                    Tirar outra foto
                  </button>
                </div>
              ) : (
              <>
              <h2 className="panel-title">
                {fotoBase ? 'Filtros Divertidos' : 'Como usar'}
              </h2>
              <p className="panel-subtitle">
                {fotoBase
                  ? 'Escolha um estilo para sua foto antes de publicar.'
                  : 'Capture uma foto com a câmera do celular, escolha um filtro e publique no feed da festa.'}
              </p>

              <div className="filter-grid">
                {FILTERS.map((filter) => {
                  const thumbUrl = fotoBase?.publicId
                    ? buildCloudinaryUrl(filter.id === 'polaroid' ? fotoBase.publicId : fotoBase.publicId, `${filter.transformation},c_fill,g_auto,h_300,w_250`)
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
                        <img src={thumbUrl} alt={filter.label} className="filter-card__thumb" />
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
              <h2>Feed Contínuo de Fotos</h2>
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
                    <img
                      src={item.imageUrl}
                      alt={`Foto publicada por ${item.guestName || 'Convidado'}`}
                      className="photo-feed-card__image"
                    />
                    <div className="photo-feed-card__content">
                      <h3>{item.guestName || 'Convidado'}</h3>
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
