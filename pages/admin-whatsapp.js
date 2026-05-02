import Head from 'next/head';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import WeddingHeader from '../components/WeddingHeader';
import WeddingFooter from '../components/WeddingFooter';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';

const ADMIN_PASSWORD = '03052026';
const SENT_STORAGE_KEY = 'wedding_whatsapp_sent';
const SITE_LINK = 'https://fotos.andrenathalia03052026.site/';

const FILTERS = [
  { id: 'ready', label: 'Prontos' },
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'sent', label: 'Enviados' },
  { id: 'without-phone', label: 'Sem telefone' },
  { id: 'without-table', label: 'Sem mesa' }
];

function sanitizePhone(phone) {
  return String(phone || '').replace(/\D/g, '');
}

function isValidPhone(phone) {
  const clean = sanitizePhone(phone);
  return clean.length >= 10 && clean.length <= 15;
}

function hasTable(guest) {
  return Boolean(String(guest.mesa || '').trim());
}

function createWhatsAppLink(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

function buildMessage(guest) {
  const lines = [
    `Olá, ${guest.nome}! 💛`,
    '',
    'Estamos muito felizes em ter você conosco no nosso casamento.',
    ''
  ];

  if (guest.localizacaoMesa) {
    lines.push(`Sua mesa será: *${guest.mesa}*.`);
    lines.push(`Ela fica em: ${guest.localizacaoMesa}.`);
  } else {
    lines.push(`Sua mesa será: *${guest.mesa}*.`);
    lines.push('Para se localizar melhor ao chegar, abra a aba *Mapa* no site.');
  }

  lines.push('');
  lines.push('Para facilitar sua chegada, deixamos no site o mapa do espaço, a localização da sua mesa, o roteiro do casamento, menu, mural de recados e envio de fotos:');
  lines.push('');
  lines.push(SITE_LINK);
  lines.push('');
  lines.push('Ao chegar, é só acessar a aba *Mesa* ou *Mapa* para se localizar.');
  lines.push('');
  lines.push('Com carinho,');
  lines.push('André & Nathália');

  return lines.join('\n');
}

function readSentMap() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(SENT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed ? parsed : {};
  } catch {
    return {};
  }
}

function saveSentMap(nextMap) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SENT_STORAGE_KEY, JSON.stringify(nextMap));
}

function AdminPasswordGate({ error, onLogin }) {
  const [password, setPassword] = useState('');

  function submit(event) {
    event.preventDefault();
    onLogin(password);
  }

  return (
    <section className="mx-auto max-w-md romantic-panel p-6 sm:p-7">
      <h2 className="text-3xl text-cocoa">Envio WhatsApp</h2>
      <p className="mt-2 text-sm text-wine/75">Área administrativa discreta. Digite a senha para continuar.</p>
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

function SummaryCard({ label, value }) {
  return (
    <article className="romantic-card p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-wine/65">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-cocoa">{value}</p>
    </article>
  );
}

export default function AdminWhatsappPage() {
  const [adminToken, setAdminToken] = useState('');
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState([]);
  const [sentMap, setSentMap] = useState({});
  const [syncStateByGuest, setSyncStateByGuest] = useState({});
  const [activeFilter, setActiveFilter] = useState('ready');
  const [searchTerm, setSearchTerm] = useState('');
  const clearSyncTimersRef = useRef({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedToken = localStorage.getItem('adminWhatsappToken') || '';
    const existingAdminToken = localStorage.getItem('adminToken') || '';
    const token = savedToken || existingAdminToken;
    if (token) setAdminToken(token);
    setSentMap(readSentMap());
  }, []);

  useEffect(() => {
    async function fetchGuests() {
      if (!adminToken) return;

      setLoading(true);
      setStatusMessage('');

      try {
        const response = await fetch('/api/adminWhatsappGuests', {
          headers: { 'x-admin-token': adminToken }
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || 'Falha ao carregar convidados');
        }

        setGuests(Array.isArray(payload.guests) ? payload.guests : []);
      } catch (error) {
        setStatusMessage(error.message);
        setGuests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchGuests();
  }, [adminToken]);

  useEffect(() => {
    return () => {
      Object.values(clearSyncTimersRef.current).forEach((timerId) => {
        clearTimeout(timerId);
      });
      clearSyncTimersRef.current = {};
    };
  }, []);

  const guestsWithComputedStatus = useMemo(() => {
    return guests.map((guest) => {
      const sent = Boolean(sentMap[guest.id] || guest.whatsappEnviado);
      const validPhone = isValidPhone(guest.telefone);
      const tableDefined = hasTable(guest);
      return {
        ...guest,
        sent,
        validPhone,
        tableDefined,
        readyToSend: Boolean(guest.confirmado) && validPhone && tableDefined
      };
    });
  }, [guests, sentMap]);

  const stats = useMemo(() => {
    const confirmedWithTable = guestsWithComputedStatus.filter((guest) => guest.confirmado && guest.tableDefined).length;
    const pending = guestsWithComputedStatus.filter((guest) => guest.readyToSend && !guest.sent).length;
    const sent = guestsWithComputedStatus.filter((guest) => guest.sent).length;
    const withoutPhone = guestsWithComputedStatus.filter((guest) => !guest.validPhone).length;
    const withoutTable = guestsWithComputedStatus.filter((guest) => !guest.tableDefined).length;

    return { confirmedWithTable, pending, sent, withoutPhone, withoutTable };
  }, [guestsWithComputedStatus]);

  const filteredGuests = useMemo(() => {
    let base = guestsWithComputedStatus;

    if (activeFilter === 'ready') base = guestsWithComputedStatus.filter((guest) => guest.readyToSend);
    if (activeFilter === 'pending') base = guestsWithComputedStatus.filter((guest) => guest.readyToSend && !guest.sent);
    if (activeFilter === 'sent') base = guestsWithComputedStatus.filter((guest) => guest.sent);
    if (activeFilter === 'without-phone') base = guestsWithComputedStatus.filter((guest) => !guest.validPhone);
    if (activeFilter === 'without-table') base = guestsWithComputedStatus.filter((guest) => !guest.tableDefined);

    const query = String(searchTerm || '').trim().toLowerCase();
    if (!query) return base;

    return base.filter((guest) => {
      const name = String(guest.nome || '').toLowerCase();
      const phone = sanitizePhone(guest.telefone || '');
      const rawPhone = String(guest.telefone || '').toLowerCase();
      return name.includes(query) || phone.includes(query) || rawPhone.includes(query);
    });
  }, [activeFilter, guestsWithComputedStatus, searchTerm]);

  function login(password) {
    setAuthError('');

    if (password !== ADMIN_PASSWORD) {
      setAuthError('Senha inválida.');
      return;
    }

    setAdminToken(password);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminWhatsappToken', password);
      localStorage.setItem('adminToken', password);
    }
  }

  function logout() {
    setAdminToken('');
    setGuests([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminWhatsappToken');
    }
  }

  async function copyMessage(guest) {
    try {
      await navigator.clipboard.writeText(buildMessage(guest));
      setStatusMessage(`Mensagem de ${guest.nome} copiada.`);
    } catch {
      setStatusMessage('Não foi possível copiar automaticamente.');
    }
  }

  async function persistSentStatus(guestId, sent) {
    if (!adminToken) return false;

    const response = await fetch('/api/adminGuests', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken
      },
      body: JSON.stringify({
        id: guestId,
        updates: {
          whatsappEnviado: Boolean(sent)
        }
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Falha ao salvar status de envio');
    }

    return true;
  }

  async function toggleSentStatus(guest) {
    if (syncStateByGuest[guest.id] === 'saving') {
      return;
    }

    const nextSent = !guest.sent;
    const nextMap = { ...sentMap, [guest.id]: nextSent };

    setSyncStateByGuest((prev) => ({ ...prev, [guest.id]: 'saving' }));
    setSentMap(nextMap);
    saveSentMap(nextMap);
    setGuests((prev) => prev.map((row) => (
      row.id === guest.id ? { ...row, whatsappEnviado: nextSent } : row
    )));

    try {
      await persistSentStatus(guest.id, nextSent);
      setSyncStateByGuest((prev) => ({ ...prev, [guest.id]: 'saved' }));

      if (clearSyncTimersRef.current[guest.id]) {
        clearTimeout(clearSyncTimersRef.current[guest.id]);
      }
      clearSyncTimersRef.current[guest.id] = setTimeout(() => {
        setSyncStateByGuest((prev) => {
          if (prev[guest.id] !== 'saved') return prev;
          return { ...prev, [guest.id]: 'idle' };
        });
        delete clearSyncTimersRef.current[guest.id];
      }, 2800);

      setStatusMessage(nextSent ? `${guest.nome} marcado como enviado.` : `${guest.nome} marcado como pendente.`);
    } catch (error) {
      const rollbackMap = { ...nextMap, [guest.id]: guest.sent };
      setSentMap(rollbackMap);
      saveSentMap(rollbackMap);
      setGuests((prev) => prev.map((row) => (
        row.id === guest.id ? { ...row, whatsappEnviado: guest.sent } : row
      )));
      setSyncStateByGuest((prev) => ({ ...prev, [guest.id]: 'error' }));
      setStatusMessage(error.message);
    }
  }

  function exportExcel() {
    const rows = filteredGuests.map((guest) => {
      const message = buildMessage(guest);
      const linkWhatsApp = guest.validPhone ? createWhatsAppLink(guest.telefone, message) : '';
      return {
        Nome: guest.nome || '',
        Telefone: sanitizePhone(guest.telefone),
        Mesa: guest.mesa || '',
        'Localização da Mesa': guest.localizacaoMesa || '',
        'Mensagem WhatsApp': message,
        'Link WhatsApp': linkWhatsApp,
        Status: guest.sent ? 'Enviado' : 'Pendente'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Ajusta largura das colunas automaticamente
    const colWidths = [
      { wch: 35 },  // Nome
      { wch: 18 },  // Telefone
      { wch: 10 },  // Mesa
      { wch: 30 },  // Localização
      { wch: 80 },  // Mensagem
      { wch: 70 },  // Link
      { wch: 12 }   // Status
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Convidados');
    XLSX.writeFile(workbook, 'whatsapp-convidados.xlsx');
  }

  function exportCsv() {
    const headers = ['nome', 'telefone', 'mesa', 'localizacaoMesa', 'mensagem', 'linkWhatsApp', 'statusEnvio'];

    const rows = guestsWithComputedStatus.map((guest) => {
      const message = buildMessage(guest);
      const linkWhatsApp = guest.validPhone ? createWhatsAppLink(guest.telefone, message) : '';
      const values = [
        guest.nome,
        sanitizePhone(guest.telefone),
        guest.mesa,
        guest.localizacaoMesa,
        message,
        linkWhatsApp,
        guest.sent ? 'Enviado' : 'Pendente'
      ];

      return values.map((value) => `"${String(value || '').replace(/"/g, '""')}"`).join(',');
    });

    const content = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'whatsapp-convidados.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  const isLogged = Boolean(adminToken);

  return (
    <>
      <Head>
        <title>Envio WhatsApp — André e Nathália</title>
      </Head>

      <WeddingHeader />

      <main className="main">
        <div className="hero-haze" />
        <div className="container relative z-10 space-y-4">
          <PageTitle
            kicker="Área administrativa"
            title="Envio WhatsApp"
            subtitle="Mensagens personalizadas para convidados confirmados com mesa definida."
          />

          {!isLogged ? <AdminPasswordGate error={authError} onLogin={login} /> : null}

          {isLogged ? (
            <>
              <section className="romantic-panel p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-wine/80">Ação manual e segura: sem disparo automático.</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn btn--outline" onClick={exportExcel}>Exportar Excel</button>
                    <button type="button" className="btn btn--outline" onClick={exportCsv}>Exportar CSV</button>
                    <button type="button" className="btn btn--outline" onClick={logout}>Sair</button>
                  </div>
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <SummaryCard label="Confirmados com mesa" value={stats.confirmedWithTable} />
                <SummaryCard label="Pendentes de envio" value={stats.pending} />
                <SummaryCard label="Enviados" value={stats.sent} />
                <SummaryCard label="Sem telefone" value={stats.withoutPhone} />
                <SummaryCard label="Sem mesa" value={stats.withoutTable} />
              </section>

              <section className="romantic-panel p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${activeFilter === filter.id ? 'bg-wine text-white' : 'border border-roseDeep/30 bg-white/70 text-wine'}`}
                      onClick={() => setActiveFilter(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <input
                    type="search"
                    className="input-elegant"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nome ou telefone"
                  />
                </div>
              </section>

              {loading ? <LoadingSpinner label="Carregando convidados" /> : null}

              {!loading ? (
                <section className="romantic-panel overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="border-b border-roseDeep/20 bg-white/70">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-cocoa">Nome</th>
                          <th className="px-4 py-3 font-semibold text-cocoa">Telefone</th>
                          <th className="px-4 py-3 font-semibold text-cocoa">Mesa</th>
                          <th className="px-4 py-3 font-semibold text-cocoa">Localização da mesa</th>
                          <th className="px-4 py-3 font-semibold text-cocoa">Status</th>
                          <th className="px-4 py-3 font-semibold text-cocoa">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredGuests.map((guest) => {
                          const message = buildMessage(guest);
                          const canSend = guest.readyToSend;
                          const whatsappHref = canSend ? createWhatsAppLink(guest.telefone, message) : '#';
                          const syncState = syncStateByGuest[guest.id] || 'idle';
                          const isSaving = syncState === 'saving';

                          return (
                            <tr key={guest.id} className={`border-b border-roseDeep/10 align-top ${guest.sent ? 'bg-emerald-50/50' : 'bg-white/60'}`}>
                              <td className="px-4 py-3">
                                <p className="font-semibold text-cocoa">{guest.nome}</p>
                                {!guest.confirmado ? <p className="text-xs text-wine/70">Não confirmado</p> : null}
                              </td>
                              <td className="px-4 py-3 text-wine/80">
                                {guest.telefone || '—'}
                                {!guest.validPhone ? <p className="mt-1 text-xs text-amber-700">Telefone inválido ou ausente</p> : null}
                              </td>
                              <td className="px-4 py-3 text-wine/80">{guest.mesa || '—'}</td>
                              <td className="px-4 py-3 text-wine/80">{guest.localizacaoMesa || '—'}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${guest.sent ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {guest.sent ? 'Enviado' : 'Pendente'}
                                </span>
                                {syncState === 'saving' ? <p className="mt-1 text-xs text-wine/70">Sincronizando...</p> : null}
                                {syncState === 'saved' ? <p className="mt-1 text-xs text-emerald-700">Status salvo no servidor</p> : null}
                                {syncState === 'error' ? <p className="mt-1 text-xs text-red-700">Falha ao sincronizar</p> : null}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex min-w-[260px] flex-wrap gap-2">
                                  <button type="button" className="btn btn--outline px-4 py-2 text-xs" onClick={() => copyMessage(guest)} disabled={!canSend || isSaving}>
                                    Copiar mensagem
                                  </button>
                                  <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`btn px-4 py-2 text-xs ${canSend && !isSaving ? 'btn--primary' : 'btn--outline pointer-events-none opacity-60'}`}
                                  >
                                    Enviar WhatsApp
                                  </a>
                                  <button type="button" className="btn btn--outline px-4 py-2 text-xs" onClick={() => toggleSentStatus(guest)} disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : guest.sent ? 'Desmarcar envio' : 'Marcar como enviado'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {!filteredGuests.length ? (
                    <div className="px-4 py-5 text-sm text-wine/75">Nenhum convidado encontrado para este filtro.</div>
                  ) : null}
                </section>
              ) : null}

              {statusMessage ? (
                <section className="romantic-panel p-4 text-sm text-wine/80">{statusMessage}</section>
              ) : null}
            </>
          ) : null}
        </div>
      </main>

      <WeddingFooter />
    </>
  );
}
