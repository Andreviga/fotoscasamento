'use client';

import { useEffect, useMemo, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

function isStandaloneMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: fullscreen)').matches || Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
}

export default function InstallPromptBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setInstalled(isStandaloneMode());
    setDismissed(window.sessionStorage.getItem('install-banner-dismissed') === '1');

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setDismissed(false);
    }

    function onInstalled() {
      setInstalled(true);
      setDeferredPrompt(null);
      setDismissed(true);
      setStatusMessage('Aplicativo instalado com sucesso.');
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const isIosSafariHint = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua);
    return isIos && isSafari && !installed;
  }, [installed]);

  async function handleInstall() {
    if (!deferredPrompt) {
      setStatusMessage('No iPhone, use Compartilhar e depois Adicionar à Tela de Início.');
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setStatusMessage(choice.outcome === 'accepted' ? 'Aplicativo instalado com sucesso.' : 'Instalação cancelada.');
    if (choice.outcome !== 'accepted') {
      setDismissed(true);
      window.sessionStorage.setItem('install-banner-dismissed', '1');
    }
  }

  function handleDismiss() {
    setDismissed(true);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('install-banner-dismissed', '1');
    }
  }

  if (installed || (!deferredPrompt && !isIosSafariHint) || dismissed) {
    return statusMessage ? <p className="px-4 pt-3 text-center text-xs text-wine/65">{statusMessage}</p> : null;
  }

  return (
    <div className="sticky top-0 z-30 px-4 pt-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-[26px] border border-gold/30 bg-[#fffaf0]/95 px-4 py-3 shadow-soft backdrop-blur">
        <span className="mt-0.5 text-xl">📲</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-cocoa">Instale o app do casamento</p>
          <p className="mt-0.5 text-xs leading-5 text-wine/75">
            Abra em tela cheia e acesse mesa, mapa, menu e mural com mais rapidez.
          </p>
          {statusMessage ? <p className="mt-1 text-xs text-wine/70">{statusMessage}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className="btn btn--primary px-4 py-2 text-xs" onClick={() => void handleInstall()}>
            Instalar
          </button>
          <button type="button" className="btn btn--outline px-3 py-2 text-xs" onClick={handleDismiss}>
            Depois
          </button>
        </div>
      </div>
    </div>
  );
}