import { useEffect, useState } from 'react';

function normalizePtText(value) {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }

  const replacements = [
    [/\bsao\b/gi, 'são'],
    [/\bsalao\b/gi, 'salão'],
    [/\bfamilia\b/gi, 'família'],
    [/\bNathalia\b/g, 'Nathália'],
    [/\bCerimonia\b/g, 'Cerimônia'],
    [/\bcerimonia\b/g, 'cerimônia'],
    [/\bCelebracao\b/g, 'Celebração'],
    [/\bcelebracao\b/g, 'celebração'],
    [/\baliancas\b/gi, 'alianças'],
    [/\bSaida\b/g, 'Saída'],
    [/\bsaida\b/g, 'saída'],
    [/\bSessao\b/g, 'Sessão'],
    [/\bsessao\b/g, 'sessão'],
    [/\bdanca\b/gi, 'dança'],
    [/\bda inicio\b/gi, 'dá início'],
    [/\bbuque\b/gi, 'buquê'],
    [/\bUltimas\b/g, 'Últimas'],
    [/\bultimas\b/g, 'últimas'],
    [/\bmusicas\b/gi, 'músicas'],
    [/\bWelcome Drink\b/g, 'Welcome drink'],
    [/\bsake\b/gi, 'saquê'],
    [/\bsaké\b/g, 'saquê']
  ];

  return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function normalizeConfig(config) {
  const next = { ...(config || {}) };

  if (Array.isArray(next?.roteiro?.itens)) {
    next.roteiro = {
      ...next.roteiro,
      itens: next.roteiro.itens.map((item) => ({
        ...item,
        titulo: normalizePtText(item?.titulo),
        descricao: normalizePtText(item?.descricao)
      }))
    };
  }

  if (Array.isArray(next?.menu?.secoes)) {
    next.menu = {
      ...next.menu,
      heroTitle: normalizePtText(next.menu.heroTitle),
      heroSubtitle: normalizePtText(next.menu.heroSubtitle),
      secoes: next.menu.secoes.map((section) => ({
        ...section,
        title: normalizePtText(section?.title),
        subtitle: normalizePtText(section?.subtitle),
        items: Array.isArray(section?.items)
          ? section.items.map((item) => ({
              ...item,
              name: normalizePtText(item?.name),
              description: normalizePtText(item?.description)
            }))
          : section?.items
      }))
    };
  }

  if (Array.isArray(next?.etiqueta?.secoes)) {
    next.etiqueta = {
      ...next.etiqueta,
      secoes: next.etiqueta.secoes.map((item) => ({
        ...item,
        titulo: normalizePtText(item?.titulo),
        conteudo: normalizePtText(item?.conteudo)
      }))
    };
  }

  return next;
}

export default function useConfig(docIds = ['site', 'aparencia']) {
  const [state, setState] = useState({ loading: true, error: '', data: {} });

  useEffect(() => {
    let mounted = true;

    async function fetchConfig() {
      setState((previous) => ({ ...previous, loading: true, error: '' }));

      try {
        const query = encodeURIComponent(docIds.join(','));
        const response = await fetch(`/api/getConfig?docs=${query}`, { cache: 'no-store' });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Falha ao carregar configurações');
        }

        if (mounted) {
          setState({ loading: false, error: '', data: normalizeConfig(payload.config || {}) });
        }
      } catch (error) {
        if (mounted) {
          setState({ loading: false, error: error.message, data: {} });
        }
      }
    }

    fetchConfig();

    return () => {
      mounted = false;
    };
  }, [docIds.join('|')]);

  return state;
}
