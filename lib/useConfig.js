import { useEffect, useState } from 'react';

export default function useConfig(docIds = ['site', 'aparencia']) {
  const [state, setState] = useState({ loading: true, error: '', data: {} });

  useEffect(() => {
    let mounted = true;

    async function fetchConfig() {
      setState((previous) => ({ ...previous, loading: true, error: '' }));

      try {
        const query = encodeURIComponent(docIds.join(','));
        const response = await fetch(`/api/getConfig?docs=${query}`);
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Falha ao carregar configuracoes');
        }

        if (mounted) {
          setState({ loading: false, error: '', data: payload.config || {} });
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
