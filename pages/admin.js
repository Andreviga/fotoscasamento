import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import useConfig from '../lib/useConfig';

const TABS = [
  { id: 'site', label: 'Site' },
  { id: 'menu', label: 'Menu' },
  { id: 'roteiro', label: 'Roteiro' },
  { id: 'etiqueta', label: 'Etiqueta' },
  { id: 'aparencia', label: 'Aparência' },
  { id: 'notificacoes', label: 'Notificações' },
  { id: 'convidados', label: 'Convidados' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'mural', label: 'Mural' }
];

const EMPTY_ROTEIRO = { horario: '', titulo: '', descricao: '', icone: '✨', destaque: false };
const EMPTY_SECAO = { titulo: '', conteudo: '', icone: '✨' };
const EMPTY_MENU_ITEM = { name: '', description: '' };
const EMPTY_MENU_SECTION = { id: '', title: '', subtitle: '', items: [{ ...EMPTY_MENU_ITEM }] };

function AdminLogin({ onLogin, error }) {
  const [password, setPassword] = useState('');

  function submit(event) {
    event.preventDefault();
    onLogin(password);
  }

  return (
    <section className="mx-auto max-w-md romantic-panel p-6">
      <h2 className="text-2xl text-cocoa">Acesso do Admin</h2>
      <p className="mt-2 text-sm text-wine/75">Digite a senha configurada em ADMIN_PASSWORD.</p>
      <form className="mt-4 space-y-3" onSubmit={submit}>
        <input
          type="password"
          className="input-elegant"
          placeholder="Senha"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="btn btn--primary w-full" type="submit">Entrar</button>
      </form>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </section>
  );
}

function TabButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${active ? 'bg-wine text-white' : 'bg-white/70 text-wine border border-roseDeep/20'}`}
    >
      {label}
    </button>
  );
}

export default function AdminPage() {
  const { loading, error, data } = useConfig(['site', 'aparencia', 'roteiro', 'etiqueta', 'menu', 'mapa', 'notificacoes']);
  const [token, setToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('site');

  const [site, setSite] = useState({});
  const [aparencia, setAparencia] = useState({});
  const [roteiro, setRoteiro] = useState([]);
  const [etiqueta, setEtiqueta] = useState([]);
  const [menu, setMenu] = useState({ heroTitle: '', heroSubtitle: '', secoes: [] });
  const [notificacoes, setNotificacoes] = useState({ enabled: false, onlyEventDay: true, schedules: [] });

  const [statusMessage, setStatusMessage] = useState('');
  const [savingDoc, setSavingDoc] = useState('');
  const [seedingConfig, setSeedingConfig] = useState(false);

  const [preview, setPreview] = useState(null);
  const [importing, setImporting] = useState(false);

  const [guestFilters, setGuestFilters] = useState({ mesa: '', confirmado: '', excluded: '' });
  const [guestRows, setGuestRows] = useState([]);
  const [guestMesaSnapshot, setGuestMesaSnapshot] = useState({});
  const [loadingGuests, setLoadingGuests] = useState(false);

  const [muralPhotos, setMuralPhotos] = useState([]);
  const [loadingMural, setLoadingMural] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('adminToken') || '';
    setToken(saved);
  }, []);

  useEffect(() => {
    if (!loading && data) {
      setSite(data.site || {});
      setAparencia(data.aparencia || {});
      setRoteiro(Array.isArray(data?.roteiro?.itens) ? data.roteiro.itens : []);
      setEtiqueta(Array.isArray(data?.etiqueta?.secoes) ? data.etiqueta.secoes : []);
      setMenu({
        heroTitle: data?.menu?.heroTitle || '',
        heroSubtitle: data?.menu?.heroSubtitle || '',
        secoes: Array.isArray(data?.menu?.secoes) ? data.menu.secoes : []
      });
      setNotificacoes({
        enabled: Boolean(data?.notificacoes?.enabled),
        onlyEventDay: data?.notificacoes?.onlyEventDay !== false,
        schedules: Array.isArray(data?.notificacoes?.schedules) ? data.notificacoes.schedules : []
      });
    }
  }, [loading, data]);

  const isLogged = Boolean(token);

  async function login(nextToken) {
    setAuthError('');

    try {
      const response = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': nextToken
        },
        body: JSON.stringify({ docId: 'site', data: {} })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Senha inválida');
      }

      localStorage.setItem('adminToken', nextToken);
      setToken(nextToken);
      setStatusMessage('Sessão iniciada com sucesso.');
    } catch (requestError) {
      setAuthError(requestError.message);
    }
  }

  function logout() {
    localStorage.removeItem('adminToken');
    setToken('');
    setStatusMessage('Sessão encerrada.');
  }

  async function saveConfig(docId, payload) {
    setStatusMessage('');
    setSavingDoc(docId);

    try {
      const response = await fetch('/api/saveConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ docId, data: payload })
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || 'Falha ao salvar');
      }

      setStatusMessage(`Configuração ${docId} salva.`);
    } catch (requestError) {
      setStatusMessage(requestError.message);
    } finally {
      setSavingDoc('');
    }
  }

  async function runConfigSeed(force = false) {
    if (!token) {
      setStatusMessage('Sessão admin ausente para inicializar configurações.');
      return;
    }

    setSeedingConfig(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/seedConfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({ force })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao inicializar configurações');
      }

      const summary = [
        `Criados: ${payload.totalCreated}`,
        `Atualizados: ${payload.totalUpdated}`,
        `Ignorados: ${payload.totalSkipped}`
      ].join(' | ');

      setStatusMessage(`Seed concluido. ${summary}.`);

      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (requestError) {
      setStatusMessage(requestError.message);
    } finally {
      setSeedingConfig(false);
    }
  }

  async function uploadLogo(file) {
    if (!file) return;

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary não configurado');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'casamento/logo');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error?.message || 'Falha no upload');
      }

      setAparencia((prev) => ({ ...prev, logo_url: payload.secure_url }));
      setStatusMessage('Logo enviada para Cloudinary. Clique em Salvar Aparência.');
    } catch (uploadError) {
      setStatusMessage(uploadError.message);
    }
  }

  async function handlePreviewFile(file) {
    if (!file) return;
    setImporting(true);
    setStatusMessage('');

    try {
      const form = new FormData();
      form.append('action', 'preview');
      form.append('file', file);

      const response = await fetch('/api/importGuests', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: form
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao gerar preview');
      }

      setPreview(payload);
      setStatusMessage(`Preview gerado com ${payload.total} convidados.`);
    } catch (requestError) {
      setStatusMessage(requestError.message);
    } finally {
      setImporting(false);
    }
  }

  async function confirmImport() {
    if (!preview?.previewId) return;
    setImporting(true);

    try {
      const form = new FormData();
      form.append('action', 'confirm');
      form.append('previewId', preview.previewId);

      const response = await fetch('/api/importGuests', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: form
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha na importação');
      }

      setStatusMessage(`Importação concluída: ${payload.importados} convidados.`);
      setPreview(null);
      fetchGuests();
    } catch (requestError) {
      setStatusMessage(requestError.message);
    } finally {
      setImporting(false);
    }
  }

  async function fetchGuests() {
    if (!token) return;
    setLoadingGuests(true);
    setStatusMessage('');

    const params = new URLSearchParams();
    if (guestFilters.mesa) params.set('mesa', guestFilters.mesa);
    if (guestFilters.confirmado) params.set('confirmado', guestFilters.confirmado);
    if (guestFilters.excluded) params.set('excluded', guestFilters.excluded);

    try {
      const response = await fetch(`/api/adminGuests?${params.toString()}`, {
        headers: { 'x-admin-token': token }
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao carregar convidados');
      }

      const rows = payload.guests || [];
      setGuestRows(rows);
      setGuestMesaSnapshot(Object.fromEntries(rows.map((guest) => [guest.id, guest.mesa ?? null])));
    } catch (requestError) {
      setStatusMessage(requestError.message);
      setGuestRows([]);
      setGuestMesaSnapshot({});
    } finally {
      setLoadingGuests(false);
    }
  }

  useEffect(() => {
    if ((activeTab === 'convidados' || activeTab === 'mapa') && token) {
      fetchGuests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  async function fetchMural() {
    setLoadingMural(true);
    try {
      const response = await fetch('/api/adminMural', {
        headers: { 'x-admin-token': token }
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao carregar mural');
      setMuralPhotos(payload.photos || []);
    } catch (err) {
      setStatusMessage(err.message);
    } finally {
      setLoadingMural(false);
    }
  }

  async function deleteMuralPhoto(id) {
    try {
      const response = await fetch('/api/adminMural', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ id })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao excluir');
      setMuralPhotos((prev) => prev.filter((p) => p.id !== id));
      setStatusMessage('Foto excluída do mural.');
    } catch (err) {
      setStatusMessage(err.message);
    }
  }

  async function deleteAllMuralPhotos() {
    if (!window.confirm('Tem certeza que deseja excluir TODAS as fotos do mural?')) return;
    try {
      const response = await fetch('/api/adminMural', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ deleteAll: true })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Falha ao excluir');
      setMuralPhotos([]);
      setStatusMessage(`${payload.deleted} foto(s) excluída(s) do mural.`);
    } catch (err) {
      setStatusMessage(err.message);
    }
  }

  useEffect(() => {
    if (activeTab === 'mural' && token) {
      fetchMural();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, token]);

  async function saveGuest(guest) {
    const parsedMesa = guest.mesa === '' || guest.mesa == null ? null : Number(guest.mesa);
    try {
      const response = await fetch('/api/adminGuests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          id: guest.id,
          updates: {
            mesa: Number.isFinite(parsedMesa) ? parsedMesa : null,
            confirmado: Boolean(guest.confirmado),
            excludedFromSearch: Boolean(guest.excludedFromSearch)
          }
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao atualizar convidado');
      }

      setGuestMesaSnapshot((prev) => ({ ...prev, [guest.id]: Number.isFinite(parsedMesa) ? parsedMesa : null }));
      setStatusMessage(`Convidado ${guest.nomeOriginal} atualizado.`);
    } catch (requestError) {
      setStatusMessage(requestError.message);
    }
  }

  async function saveGuestsBatch() {
    if (!token) return;

    const changedGuests = guestRows.filter((guest) => {
      const currentMesa = guest.mesa === '' || guest.mesa == null ? null : Number(guest.mesa);
      const normalizedMesa = Number.isFinite(currentMesa) ? currentMesa : null;
      const originalMesa = guestMesaSnapshot[guest.id] ?? null;
      return normalizedMesa !== originalMesa;
    });

    if (changedGuests.length === 0) {
      setStatusMessage('Nenhuma alteração de mesa para salvar.');
      return;
    }

    setLoadingGuests(true);
    setStatusMessage(`Salvando ${changedGuests.length} alteração(ões) de mesa...`);

    let updated = 0;
    let failed = 0;

    for (const guest of changedGuests) {
      const mesaValue = guest.mesa === '' || guest.mesa == null ? null : Number(guest.mesa);
      const normalizedMesa = Number.isFinite(mesaValue) ? mesaValue : null;

      try {
        const response = await fetch('/api/adminGuests', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-token': token
          },
          body: JSON.stringify({
            id: guest.id,
            updates: {
              mesa: normalizedMesa
            }
          })
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || 'Falha ao atualizar convidado');
        }

        updated += 1;
      } catch {
        failed += 1;
      }
    }

    await fetchGuests();
    setStatusMessage(`Salvamento em lote concluído. Atualizados: ${updated}. Falhas: ${failed}.`);
  }

  async function toggleGuestSearchVisibility(guest, excludedFromSearch) {
    try {
      const response = await fetch('/api/adminGuests', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token
        },
        body: JSON.stringify({
          id: guest.id,
          updates: {
            nomeOriginal: guest.nomeOriginal,
            nomeConvite: guest.nomeConvite || '',
            mesa: guest.mesa ?? null,
            confirmado: Boolean(guest.confirmado),
            excludedFromSearch
          }
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Falha ao atualizar visibilidade do convidado');
      }

      setGuestRows((prev) => prev.map((row) => (
        row.id === guest.id ? { ...row, excludedFromSearch } : row
      )));
      setStatusMessage(
        excludedFromSearch
          ? `Convidado ${guest.nomeOriginal} removido da pesquisa.`
          : `Convidado ${guest.nomeOriginal} voltou a aparecer na pesquisa.`
      );
    } catch (requestError) {
      setStatusMessage(requestError.message);
    }
  }

  function updateGuestRow(id, patch) {
    setGuestRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function moveRoteiro(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= roteiro.length) return;
    const clone = [...roteiro];
    const [item] = clone.splice(index, 1);
    clone.splice(target, 0, item);
    setRoteiro(clone);
  }

  function moveEtiqueta(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= etiqueta.length) return;
    const clone = [...etiqueta];
    const [item] = clone.splice(index, 1);
    clone.splice(target, 0, item);
    setEtiqueta(clone);
  }

  function moveMenuSection(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= menu.secoes.length) return;
    const clone = [...menu.secoes];
    const [item] = clone.splice(index, 1);
    clone.splice(target, 0, item);
    setMenu((prev) => ({ ...prev, secoes: clone }));
  }

  function moveMenuItem(sectionIndex, itemIndex, direction) {
    const items = [...(menu.secoes[sectionIndex]?.items || [])];
    const target = itemIndex + direction;
    if (target < 0 || target >= items.length) return;
    const [item] = items.splice(itemIndex, 1);
    items.splice(target, 0, item);
    setMenu((prev) => ({
      ...prev,
      secoes: prev.secoes.map((sec, si) =>
        si === sectionIndex ? { ...sec, items } : sec
      ),
    }));
  }

  function addNotificacao() {
    setNotificacoes((prev) => ({
      ...prev,
      schedules: [
        ...(prev.schedules || []),
        {
          id: `notif-${Date.now()}`,
          active: true,
          time: '12:00',
          title: 'Lembrete do Casamento',
          message: 'Confira as informações do evento no app.',
          targetTab: 'info'
        }
      ]
    }));
  }

  function updateNotificacao(index, patch) {
    setNotificacoes((prev) => ({
      ...prev,
      schedules: (prev.schedules || []).map((item, idx) => (idx === index ? { ...item, ...patch } : item))
    }));
  }

  function removeNotificacao(index) {
    setNotificacoes((prev) => ({
      ...prev,
      schedules: (prev.schedules || []).filter((_, idx) => idx !== index)
    }));
  }

  const tabContent = useMemo(() => {
    if (activeTab === 'site') {
      return (
        <section className="romantic-panel p-5 space-y-3">
          <h2 className="text-2xl text-cocoa">Conteúdo principal</h2>
          {[
            ['titulo_site', 'Título do site'],
            ['nome_noivos', 'Nome dos noivos'],
            ['data_casamento', 'Data do casamento'],
            ['local_cerimonia', 'Local da cerimônia'],
            ['local_recepcao', 'Local da recepção'],
            ['info_data', 'Info rápida - Data'],
            ['info_local', 'Info rápida - Local'],
            ['info_horario', 'Info rápida - Horário'],
            ['info_traje', 'Info rápida - Traje'],
            ['info_estacionamento', 'Info rápida - Estacionamento'],
            ['mensagem_boas_vindas', 'Mensagem de boas-vindas'],
            ['hashtag', 'Hashtag'],
            ['pix_key', 'Chave PIX'],
            ['contato_emergencia', 'Contato de emergência']
          ].map(([field, label]) => (
            <label className="block" key={field}>
              <span className="form-label">{label}</span>
              <input
                className="input-elegant"
                value={site[field] || ''}
                onChange={(event) => setSite((prev) => ({ ...prev, [field]: event.target.value }))}
              />
            </label>
          ))}
          <button className="btn btn--primary" onClick={() => saveConfig('site', site)} disabled={savingDoc === 'site'}>
            {savingDoc === 'site' ? 'Salvando...' : 'Salvar Site'}
          </button>
        </section>
      );
    }

    if (activeTab === 'menu') {
      return (
        <section className="space-y-3">
          <div className="romantic-panel p-5 space-y-3">
            <h2 className="text-2xl text-cocoa">Editor de menu</h2>
            <label className="block">
              <span className="form-label">Título principal</span>
              <input className="input-elegant" value={menu.heroTitle || ''} onChange={(e) => setMenu((prev) => ({ ...prev, heroTitle: e.target.value }))} />
            </label>
            <label className="block">
              <span className="form-label">Subtítulo principal</span>
              <textarea className="input-elegant" rows={3} value={menu.heroSubtitle || ''} onChange={(e) => setMenu((prev) => ({ ...prev, heroSubtitle: e.target.value }))} />
            </label>
            <button className="btn btn--outline" onClick={() => setMenu((prev) => ({ ...prev, secoes: [...prev.secoes, { ...EMPTY_MENU_SECTION, id: `secao-${Date.now()}` }] }))}>Adicionar seção</button>
          </div>

          {(menu.secoes || []).map((section, sectionIndex) => (
            <article key={section.id || sectionIndex} className="romantic-panel p-4 space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <input className="input-elegant" placeholder="Título da seção" value={section.title || ''} onChange={(e) => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((item, index) => (index === sectionIndex ? { ...item, title: e.target.value } : item)) }))} />
                <input className="input-elegant" placeholder="ID da seção" value={section.id || ''} onChange={(e) => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((item, index) => (index === sectionIndex ? { ...item, id: e.target.value } : item)) }))} />
              </div>
              <textarea className="input-elegant" rows={2} placeholder="Subtítulo da seção" value={section.subtitle || ''} onChange={(e) => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((item, index) => (index === sectionIndex ? { ...item, subtitle: e.target.value } : item)) }))} />

              <div className="space-y-2">
                {(section.items || []).map((item, itemIndex) => (
                  <div key={`${section.id || sectionIndex}-${itemIndex}`} className="rounded-2xl border border-roseDeep/15 bg-white/70 p-3 space-y-2">
                    <input className="input-elegant" placeholder="Nome do item" value={item.name || ''} onChange={(e) => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((currentSection, currentIndex) => currentIndex === sectionIndex ? { ...currentSection, items: currentSection.items.map((currentItem, currentItemIndex) => currentItemIndex === itemIndex ? { ...currentItem, name: e.target.value } : currentItem) } : currentSection) }))} />
                    <textarea className="input-elegant" rows={2} placeholder="Descricao do item" value={item.description || ''} onChange={(e) => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((currentSection, currentIndex) => currentIndex === sectionIndex ? { ...currentSection, items: currentSection.items.map((currentItem, currentItemIndex) => currentItemIndex === itemIndex ? { ...currentItem, description: e.target.value } : currentItem) } : currentSection) }))} />
                    <div className="flex flex-wrap gap-2">
                      <button className="btn btn--outline" onClick={() => moveMenuItem(sectionIndex, itemIndex, -1)}>Subir item</button>
                      <button className="btn btn--outline" onClick={() => moveMenuItem(sectionIndex, itemIndex, 1)}>Descer item</button>
                      <button className="btn btn--outline" onClick={() => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((currentSection, currentIndex) => currentIndex === sectionIndex ? { ...currentSection, items: currentSection.items.filter((_, currentItemIndex) => currentItemIndex !== itemIndex) } : currentSection) }))}>Remover item</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="btn btn--outline" onClick={() => setMenu((prev) => ({ ...prev, secoes: prev.secoes.map((item, index) => index === sectionIndex ? { ...item, items: [...(item.items || []), { ...EMPTY_MENU_ITEM }] } : item) }))}>Adicionar item</button>
                <button className="btn btn--outline" onClick={() => moveMenuSection(sectionIndex, -1)}>Subir seção</button>
                <button className="btn btn--outline" onClick={() => moveMenuSection(sectionIndex, 1)}>Descer seção</button>
                <button className="btn btn--outline" onClick={() => setMenu((prev) => ({ ...prev, secoes: prev.secoes.filter((_, index) => index !== sectionIndex) }))}>Remover seção</button>
              </div>
            </article>
          ))}

          <button className="btn btn--primary" onClick={() => saveConfig('menu', menu)} disabled={savingDoc === 'menu'}>
            {savingDoc === 'menu' ? 'Salvando...' : 'Salvar Menu'}
          </button>
        </section>
      );
    }

    if (activeTab === 'roteiro') {
      return (
        <section className="space-y-3">
          <div className="romantic-panel p-5 flex items-center justify-between">
            <h2 className="text-2xl text-cocoa">Editor de roteiro</h2>
            <button className="btn btn--outline" onClick={() => setRoteiro((prev) => [...prev, { ...EMPTY_ROTEIRO }])}>Adicionar item</button>
          </div>

          {roteiro.map((item, index) => (
            <article key={index} className="romantic-panel p-4 grid gap-2 sm:grid-cols-2">
              <input className="input-elegant" placeholder="Horário" value={item.horario || ''} onChange={(e) => setRoteiro((prev) => prev.map((x, i) => i === index ? { ...x, horario: e.target.value } : x))} />
              <input className="input-elegant" placeholder="Título" value={item.titulo || ''} onChange={(e) => setRoteiro((prev) => prev.map((x, i) => i === index ? { ...x, titulo: e.target.value } : x))} />
              <input className="input-elegant" placeholder="Ícone" value={item.icone || ''} onChange={(e) => setRoteiro((prev) => prev.map((x, i) => i === index ? { ...x, icone: e.target.value } : x))} />
              <label className="flex items-center gap-2 text-sm text-wine">
                <input type="checkbox" checked={Boolean(item.destaque)} onChange={(e) => setRoteiro((prev) => prev.map((x, i) => i === index ? { ...x, destaque: e.target.checked } : x))} />
                Destaque
              </label>
              <textarea className="input-elegant sm:col-span-2" rows={2} placeholder="Descrição" value={item.descricao || ''} onChange={(e) => setRoteiro((prev) => prev.map((x, i) => i === index ? { ...x, descricao: e.target.value } : x))} />
              <div className="sm:col-span-2 flex flex-wrap gap-2">
                <button className="btn btn--outline" onClick={() => moveRoteiro(index, -1)}>Subir</button>
                <button className="btn btn--outline" onClick={() => moveRoteiro(index, 1)}>Descer</button>
                <button className="btn btn--outline" onClick={() => setRoteiro((prev) => prev.filter((_, i) => i !== index))}>Remover</button>
              </div>
            </article>
          ))}

          <button className="btn btn--primary" onClick={() => saveConfig('roteiro', { itens: roteiro })} disabled={savingDoc === 'roteiro'}>
            {savingDoc === 'roteiro' ? 'Salvando...' : 'Salvar Roteiro'}
          </button>
        </section>
      );
    }

    if (activeTab === 'etiqueta') {
      return (
        <section className="space-y-3">
          <div className="romantic-panel p-5 flex items-center justify-between">
            <h2 className="text-2xl text-cocoa">Editor de etiqueta</h2>
            <button className="btn btn--outline" onClick={() => setEtiqueta((prev) => [...prev, { ...EMPTY_SECAO }])}>Adicionar seção</button>
          </div>

          {etiqueta.map((secao, index) => (
            <article key={index} className="romantic-panel p-4 space-y-2">
              <input className="input-elegant" placeholder="Título" value={secao.titulo || ''} onChange={(e) => setEtiqueta((prev) => prev.map((x, i) => i === index ? { ...x, titulo: e.target.value } : x))} />
              <input className="input-elegant" placeholder="Ícone" value={secao.icone || ''} onChange={(e) => setEtiqueta((prev) => prev.map((x, i) => i === index ? { ...x, icone: e.target.value } : x))} />
              <textarea className="input-elegant" rows={4} placeholder="Conteúdo" value={secao.conteudo || ''} onChange={(e) => setEtiqueta((prev) => prev.map((x, i) => i === index ? { ...x, conteudo: e.target.value } : x))} />
              <div className="flex flex-wrap gap-2">
                <button className="btn btn--outline" onClick={() => moveEtiqueta(index, -1)}>Subir</button>
                <button className="btn btn--outline" onClick={() => moveEtiqueta(index, 1)}>Descer</button>
                <button className="btn btn--outline" onClick={() => setEtiqueta((prev) => prev.filter((_, i) => i !== index))}>Remover</button>
              </div>
            </article>
          ))}

          <button className="btn btn--primary" onClick={() => saveConfig('etiqueta', { secoes: etiqueta })} disabled={savingDoc === 'etiqueta'}>
            {savingDoc === 'etiqueta' ? 'Salvando...' : 'Salvar Etiqueta'}
          </button>
        </section>
      );
    }

    if (activeTab === 'aparencia') {
      return (
        <section className="romantic-panel p-5 space-y-4">
          <h2 className="text-2xl text-cocoa">Aparência</h2>
          <label className="block">
            <span className="form-label">Paleta principal</span>
            <select className="input-elegant" value={aparencia.paleta || 'dourado_branco'} onChange={(e) => setAparencia((prev) => ({ ...prev, paleta: e.target.value }))}>
              <option value="dourado_branco">Dourado & Branco</option>
              <option value="rosa_champagne">Rosa & Champagne</option>
              <option value="azul_prata">Azul Marinho & Prata</option>
            </select>
          </label>

          <label className="block">
            <span className="form-label">Logo / monograma</span>
            <input className="input-elegant" type="file" accept="image/*" onChange={(e) => uploadLogo(e.target.files?.[0])} />
          </label>

          {aparencia.logo_url ? (
            <img src={aparencia.logo_url} alt="Logo do casamento" className="h-16 w-auto rounded-md border border-roseDeep/20" />
          ) : null}

          <label className="flex items-center gap-2 text-sm text-wine">
            <input
              type="checkbox"
              checked={Boolean(aparencia.mostrar_outros_na_mesa)}
              onChange={(e) => setAparencia((prev) => ({ ...prev, mostrar_outros_na_mesa: e.target.checked }))}
            />
            Mostrar outros convidados da mesma mesa na busca pública
          </label>

          <button className="btn btn--primary" onClick={() => saveConfig('aparencia', aparencia)} disabled={savingDoc === 'aparencia'}>
            {savingDoc === 'aparencia' ? 'Salvando...' : 'Salvar Aparência'}
          </button>
        </section>
      );
    }

    if (activeTab === 'notificacoes') {
      return (
        <section className="space-y-3">
          <div className="romantic-panel p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl text-cocoa">Notificações programadas</h2>
              <button className="btn btn--outline" onClick={addNotificacao}>Adicionar notificação</button>
            </div>

            <label className="flex items-center gap-2 text-sm text-wine">
              <input
                type="checkbox"
                checked={Boolean(notificacoes.enabled)}
                onChange={(e) => setNotificacoes((prev) => ({ ...prev, enabled: e.target.checked }))}
              />
              Ativar notificações no app
            </label>

            <label className="flex items-center gap-2 text-sm text-wine">
              <input
                type="checkbox"
                checked={Boolean(notificacoes.onlyEventDay)}
                onChange={(e) => setNotificacoes((prev) => ({ ...prev, onlyEventDay: e.target.checked }))}
              />
              Disparar somente no dia do evento (03/05/2026)
            </label>

            <p className="text-xs text-wine/65">
              As notificações aparecem para convidados que instalaram/abriram o app e autorizaram notificações.
            </p>
          </div>

          {(notificacoes.schedules || []).map((item, index) => (
            <article key={item.id || index} className="romantic-panel p-4 space-y-2">
              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="form-label">Horário (HH:mm)</span>
                  <input
                    type="time"
                    className="input-elegant"
                    value={item.time || '12:00'}
                    onChange={(e) => updateNotificacao(index, { time: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="form-label">Abrir aba ao clicar</span>
                  <select
                    className="input-elegant"
                    value={item.targetTab || 'info'}
                    onChange={(e) => updateNotificacao(index, { targetTab: e.target.value })}
                  >
                    <option value="info">Início</option>
                    <option value="mesa">Mesa</option>
                    <option value="roteiro">Roteiro</option>
                    <option value="menu">Menu</option>
                    <option value="mapa">Mapa</option>
                    <option value="fotos">Fotos</option>
                    <option value="mural">Mural</option>
                    <option value="extra">Mais</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="form-label">Título</span>
                <input
                  className="input-elegant"
                  value={item.title || ''}
                  onChange={(e) => updateNotificacao(index, { title: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="form-label">Mensagem</span>
                <textarea
                  className="input-elegant"
                  rows={2}
                  value={item.message || ''}
                  onChange={(e) => updateNotificacao(index, { message: e.target.value })}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 text-sm text-wine">
                  <input
                    type="checkbox"
                    checked={Boolean(item.active)}
                    onChange={(e) => updateNotificacao(index, { active: e.target.checked })}
                  />
                  Ativa
                </label>
                <button className="btn btn--outline" onClick={() => removeNotificacao(index)}>Remover</button>
              </div>
            </article>
          ))}

          <button className="btn btn--primary" onClick={() => saveConfig('notificacoes', notificacoes)} disabled={savingDoc === 'notificacoes'}>
            {savingDoc === 'notificacoes' ? 'Salvando...' : 'Salvar Notificações'}
          </button>
        </section>
      );
    }

    if (activeTab === 'convidados') {
      return (
        <section className="space-y-4">
          <article className="romantic-panel p-5 space-y-3">
            <h2 className="text-2xl text-cocoa">Importar planilha XLSX</h2>
            <input className="input-elegant" type="file" accept=".xlsx,.xls" onChange={(e) => handlePreviewFile(e.target.files?.[0])} />
            {importing ? <LoadingSpinner label="Processando planilha" /> : null}
            {preview ? (
              <div className="rounded-xl border border-roseDeep/20 bg-white/70 p-3 text-sm text-wine/80">
                <p><strong>Total em preview:</strong> {preview.total}</p>
                <p><strong>Erros:</strong> {preview.erros?.length || 0}</p>
                <div className="mt-2 max-h-40 overflow-auto rounded-md border border-roseDeep/20 bg-white p-2">
                  {(preview.preview || []).slice(0, 8).map((item, index) => (
                    <p key={`${item.nomeOriginal}-${index}`}>{item.nomeOriginal} - {item.nomeConvite}</p>
                  ))}
                </div>
                <button className="btn btn--primary mt-3" onClick={confirmImport} disabled={importing}>Confirmar importação</button>
              </div>
            ) : null}
          </article>

          <article className="romantic-panel p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl text-cocoa">Atribuição de mesas</h2>
              <a href="/api/adminGuests?export=csv" className="btn btn--outline" onClick={(e) => {
                if (!token) return;
                e.preventDefault();
                fetch('/api/adminGuests?export=csv', { headers: { 'x-admin-token': token } })
                  .then((res) => res.text())
                  .then((csv) => {
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.download = 'convidados.csv';
                    anchor.click();
                    URL.revokeObjectURL(url);
                  });
              }}>Exportar CSV</a>
            </div>

            <div className="grid gap-2 sm:grid-cols-4">
              <input className="input-elegant" placeholder="Mesa" value={guestFilters.mesa} onChange={(e) => setGuestFilters((prev) => ({ ...prev, mesa: e.target.value }))} />
              <select className="input-elegant" value={guestFilters.confirmado} onChange={(e) => setGuestFilters((prev) => ({ ...prev, confirmado: e.target.value }))}>
                <option value="">Confirmação (todos)</option>
                <option value="true">Confirmado</option>
                <option value="false">Não confirmado</option>
              </select>
              <select className="input-elegant" value={guestFilters.excluded} onChange={(e) => setGuestFilters((prev) => ({ ...prev, excluded: e.target.value }))}>
                <option value="">Pesquisa (todos)</option>
                <option value="false">Aparecendo na busca</option>
                <option value="true">Excluídos da busca</option>
              </select>
              <button className="btn btn--outline" onClick={fetchGuests}>Aplicar filtros</button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="btn btn--primary" onClick={saveGuestsBatch} disabled={loadingGuests || guestRows.length === 0}>
                Salvar mesas em lote
              </button>
            </div>

            {loadingGuests ? <LoadingSpinner label="Carregando convidados" /> : null}

            {!loadingGuests ? (
              <div className="overflow-auto rounded-xl border border-roseDeep/20">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/70 text-left text-wine/80">
                    <tr>
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">Convite</th>
                      <th className="px-3 py-2">Mesa</th>
                      <th className="px-3 py-2">Confirmado</th>
                      <th className="px-3 py-2">Busca</th>
                      <th className="px-3 py-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guestRows.map((guest) => (
                      <tr key={guest.id} className={`border-t border-roseDeep/10 ${guest.excludedFromSearch ? 'bg-rose-50/50 text-wine/60' : ''}`}>
                        <td className="px-3 py-2">{guest.nomeOriginal}</td>
                        <td className="px-3 py-2">{guest.nomeConvite}</td>
                        <td className="px-3 py-2">
                          <input
                            className="w-20 rounded-md border border-roseDeep/25 bg-white px-2 py-1"
                            type="number"
                            value={guest.mesa ?? ''}
                            onChange={(e) => updateGuestRow(guest.id, { mesa: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="checkbox"
                            checked={Boolean(guest.confirmado)}
                            onChange={(e) => updateGuestRow(guest.id, { confirmado: e.target.checked })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          {guest.excludedFromSearch ? 'Oculto' : 'Ativo'}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-2">
                            <button className="btn btn--outline" onClick={() => saveGuest(guest)}>Salvar</button>
                            <button
                              className="btn btn--outline"
                              onClick={() => toggleGuestSearchVisibility(guest, !guest.excludedFromSearch)}
                            >
                              {guest.excludedFromSearch ? 'Reativar busca' : 'Excluir da busca'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </article>
        </section>
      );
    }

    if (activeTab === 'mapa') {
      return (
        <section className="space-y-4">
          <article className="romantic-panel p-5 space-y-3">
            <h2 className="text-2xl text-cocoa">Calibração do Mapa do Salão</h2>
            <p className="text-sm text-wine/80">
              Abra o mapa em modo admin para <strong>arrastar os círculos</strong> sobre a foto real do salão,
              usar as setas de ajuste fino, aplicar um recorte visual e salvar as configurações no Firestore.
              As posições salvas aparecem automaticamente para todos os convidados.
            </p>
            <a href="/mapa?admin=true" target="_blank" rel="noopener noreferrer" className="btn btn--primary inline-flex">
              Abrir calibração do mapa
            </a>
          </article>

          <article className="romantic-panel p-5 space-y-2 text-sm text-wine/80">
            <p className="font-semibold text-cocoa">Como usar a calibração:</p>
            <ol className="list-decimal pl-5 space-y-1.5">
              <li>Clique em "Abrir calibração do mapa" acima.</li>
              <li>Se precisar esconder bordas da imagem, ajuste primeiro o <strong>recorte visual</strong>.</li>
              <li>Selecione uma mesa no dropdown ou clique diretamente no círculo.</li>
              <li><strong>Arraste</strong> o círculo até ele ficar sobre a mesa correta na foto.</li>
              <li>Use as <strong>setas ^ v &lt; &gt;</strong> para ajuste fino (0.5% por clique).</li>
              <li>Ajuste o <strong>raio</strong> para cobrir o tamanho visual correto de cada mesa.</li>
              <li>Repita para todas as 21 posições (20 mesas + noivos).</li>
              <li>Clique em <strong>"Salvar posições"</strong> - o recorte e as posições ficam salvos no Firestore e valem para todos os convidados.</li>
            </ol>
            <p className="mt-2 text-xs text-wine/60">
              As posições são salvas em <code>config/mapa.posicoesMesas</code> e o recorte em <code>config/mapa.crop</code> no Firestore.
              Caso precise resetar, use o botão "Resetar padrão" no modo admin.
            </p>
          </article>
        </section>
      );
    }

    if (activeTab === 'whatsapp') {
      return (
        <section className="space-y-4">
          <article className="romantic-panel p-5 space-y-3">
            <h2 className="text-2xl text-cocoa">Envio WhatsApp</h2>
            <p className="text-sm text-wine/80">
              Abra a área administrativa de WhatsApp para gerar mensagens personalizadas, copiar texto, abrir link oficial wa.me e marcar envio.
            </p>
            <a href="/admin-whatsapp" className="btn btn--primary">Abrir Envio WhatsApp</a>
          </article>

          <article className="romantic-panel p-5 space-y-2 text-sm text-wine/80">
            <p>Funcionalidades disponíveis na área de WhatsApp:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Filtros por pendentes, enviados, sem telefone e sem mesa.</li>
              <li>Mensagem personalizada por convidado com mesa e link do site.</li>
              <li>Ações manuais seguras: copiar mensagem e abrir wa.me.</li>
              <li>Status de envio salvo no navegador e no Firestore.</li>
            </ul>
          </article>
        </section>
      );
    }

    if (activeTab === 'mural') {
    return (
      <section className="romantic-panel p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl text-cocoa">Fotos do Mural</h2>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn--outline" onClick={fetchMural} disabled={loadingMural}>
              {loadingMural ? 'Carregando...' : 'Atualizar'}
            </button>
            <button className="btn btn--outline" style={{ color: '#b91c1c' }} onClick={deleteAllMuralPhotos} disabled={loadingMural || muralPhotos.length === 0}>
              Excluir todas ({muralPhotos.length})
            </button>
          </div>
        </div>

        {loadingMural ? <LoadingSpinner label="Carregando fotos do mural" /> : null}

        {!loadingMural && muralPhotos.length === 0 ? (
          <p className="text-sm text-wine/60">Nenhuma foto no mural.</p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {muralPhotos.map((photo) => (
            <div key={photo.id} className="rounded-2xl border border-roseDeep/15 bg-white/70 p-3 space-y-2">
              {photo.imageUrl ? (
                <img
                  src={photo.imageUrl}
                  alt={photo.guestName}
                  className="w-full rounded-xl object-cover"
                  style={{ maxHeight: '180px' }}
                />
              ) : null}
              <p className="text-sm font-semibold text-cocoa truncate">{photo.guestName}</p>
              {photo.createdAtMs ? (
                <p className="text-xs text-wine/50">{new Date(photo.createdAtMs).toLocaleString('pt-BR')}</p>
              ) : null}
              <button
                className="btn btn--outline w-full"
                style={{ color: '#b91c1c' }}
                onClick={() => deleteMuralPhoto(photo.id)}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
  }, [activeTab, aparencia, menu, etiqueta, guestFilters, guestRows, importing, loadingGuests, loadingMural, muralPhotos, notificacoes, preview, roteiro, savingDoc, site, token]);

  return (
    <>
      <Head>
        <title>Painel Administrativo</title>
      </Head>
      <WeddingHeader />
      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10 space-y-6">
          <PageTitle
            kicker="Controle total"
            title="Painel Administrativo"
            subtitle="Edite todos os conteúdos do site sem alterar código."
          />

          {!isLogged ? <AdminLogin onLogin={login} error={authError} /> : null}

          {isLogged ? (
            <>
              <section className="romantic-panel p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {TABS.map((tab) => (
                      <TabButton
                        key={tab.id}
                        label={tab.label}
                        active={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn--outline" onClick={() => runConfigSeed(false)} disabled={seedingConfig}>
                      {seedingConfig ? 'Inicializando...' : 'Inicializar Config Padrão'}
                    </button>
                    <button className="btn btn--outline" onClick={() => runConfigSeed(true)} disabled={seedingConfig}>
                      {seedingConfig ? 'Aplicando...' : 'Forcar Seed'}
                    </button>
                    <button className="btn btn--outline" onClick={logout}>Sair</button>
                  </div>
                </div>
              </section>

              {loading ? <LoadingSpinner label="Carregando configurações" /> : null}
              {error ? <div className="romantic-panel p-4 text-sm text-red-700">{error}</div> : null}

              {!loading && !error ? tabContent : null}
            </>
          ) : null}

          {statusMessage ? <div className="romantic-panel p-4 text-sm text-wine/80">{statusMessage}</div> : null}
        </div>
      </main>
      <WeddingFooter />
    </>
  );
}
