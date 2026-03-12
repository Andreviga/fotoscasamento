'use client';

import { useEffect, useRef, useState } from 'react';

type InviteActionsProps = {
  address: string;
  mapsUrl: string;
};

function copyWithFallback(text: string) {
  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', 'true');
  helper.style.position = 'absolute';
  helper.style.left = '-9999px';
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(helper);
  return copied;
}

export default function InviteActions({ address, mapsUrl }: InviteActionsProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const resetTimerRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address);
      } else if (!copyWithFallback(address)) {
        throw new Error('clipboard-unavailable');
      }

      setCopyStatus('success');
    } catch {
      setCopyStatus('error');
    } finally {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopyStatus('idle');
      }, 2400);
    }
  }

  return (
    <div className="invite__actions">
      <a className="invite-chip" href={mapsUrl} rel="noreferrer" target="_blank">
        Abrir no Maps
      </a>
      <button className="invite-chip" onClick={handleCopy} type="button">
        {copyStatus === 'success' ? 'Endereço copiado' : copyStatus === 'error' ? 'Não foi possível copiar' : 'Copiar endereço'}
      </button>
    </div>
  );
}