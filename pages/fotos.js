import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from 'firebase/firestore';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { firebaseDb } from '../lib/firebaseClient';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';
const COLLECTION_NAME = 'fotos_casamento';

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
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [nomeConvidado, setNomeConvidado] = useState('');
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [capturando, setCapturando] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [mensagem, setMensagem] = useState('Digite seu nome e registre um momento especial ✿');

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
    const feedQuery = query(
      collection(firebaseDb, COLLECTION_NAME),
      orderBy('dataCriacaoMs', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function iniciarCamera() {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setMensagem('Seu navegador não oferece suporte de câmera. Use a galeria.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraAtiva(true);
      setMensagem('Câmera ativa! Clique em "Capturar Foto" para registrar.');
    } catch (error) {
      console.error(error);
      setCameraAtiva(false);
      setMensagem('Não conseguimos acessar a câmera. Você pode escolher uma foto da galeria.');
    }
  }

  function encerrarCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraAtiva(false);
  }

  async function prepararFoto(fileOrBlob) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMensagem('Cloudinary não configurado. Confira as variáveis de ambiente.');
      return;
    }

    setCapturando(true);
    setMensagem('Enviando imagem base para aplicar filtros...');

    try {
      const uploaded = await uploadUnsignedToCloudinary(fileOrBlob, 'casamento/base');

      setFotoBase({
        publicId: uploaded.public_id,
        secureUrl: uploaded.secure_url
      });

      setFiltroSelecionadoId(FILTERS[0].id);
      setMensagem('Imagem pronta! Escolha um filtro divertido e publique no feed.');
    } catch (error) {
      console.error(error);
      setMensagem('Falha ao enviar imagem para o Cloudinary. Tente novamente.');
    } finally {
      setCapturando(false);
    }
  }

  function capturarDaCamera() {
    if (!videoRef.current || !cameraAtiva) {
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
          void prepararFoto(blob);
          encerrarCamera();
        }
      },
      'image/jpeg',
      0.92
    );
  }

  function escolherDaGaleria(event) {
    const file = event.target.files?.[0];
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

      await addDoc(collection(firebaseDb, COLLECTION_NAME), {
        nomeConvidado: nomeConvidado.trim(),
        urlFoto: finalUpload.secure_url,
        filtro: filtroSelecionado.id,
        dataCriacao: serverTimestamp(),
        dataCriacaoMs: Date.now()
      });

      setMensagem('Foto publicada! Role a página para ver no feed ao vivo ✿');
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

          <section className="photo-booth">
            <div className="photo-booth__left">
              <label htmlFor="nomeConvidado" className="form-label">
                Nome do convidado
              </label>
              <input
                id="nomeConvidado"
                className="input-elegant"
                placeholder="Ex.: Mariana"
                value={nomeConvidado}
                maxLength={40}
                onChange={(event) => setNomeConvidado(event.target.value)}
              />

              <div className="camera-stage">
                {cameraAtiva ? (
                  <video ref={videoRef} playsInline muted className="camera-stage__media" />
                ) : previewPrincipalUrl ? (
                  <img
                    src={previewPrincipalUrl}
                    alt="Pré-visualização da foto com filtro"
                    className="camera-stage__media"
                  />
                ) : (
                  <div className="camera-stage__placeholder">
                    Sua foto aparecerá aqui após capturar pela câmera ou escolher da galeria.
                  </div>
                )}
              </div>

              <div className="booth-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => void iniciarCamera()}
                  disabled={cameraAtiva || capturando}
                >
                  Abrir Câmera
                </button>

                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={capturarDaCamera}
                  disabled={!cameraAtiva || capturando}
                >
                  {capturando ? 'Processando...' : 'Capturar Foto'}
                </button>

                <label className="btn btn--outline">
                  Escolher da Galeria
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="input-file-hidden"
                    onChange={escolherDaGaleria}
                  />
                </label>

                {cameraAtiva && (
                  <button type="button" className="btn btn--ghost" onClick={encerrarCamera}>
                    Fechar Câmera
                  </button>
                )}
              </div>
            </div>

            <div className="photo-booth__right">
              <h2 className="panel-title">Filtros Divertidos</h2>
              <p className="panel-subtitle">
                Escolha um estilo para sua foto antes de publicar no feed da festa.
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

              <div className="publish-actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => void publicarNoFeed()}
                  disabled={!fotoBase?.publicId || !nomeConvidado.trim() || publicando}
                >
                  {publicando ? 'Publicando...' : 'Publicar'}
                </button>
              </div>

              <p className="status-message">{mensagem}</p>
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
                      src={item.urlFoto}
                      alt={`Foto publicada por ${item.nomeConvidado || 'Convidado'}`}
                      className="photo-feed-card__image"
                    />
                    <div className="photo-feed-card__content">
                      <h3>{item.nomeConvidado || 'Convidado'}</h3>
                      <p>{formatDate(item.dataCriacao, item.dataCriacaoMs)}</p>
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
