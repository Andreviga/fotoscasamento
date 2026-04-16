'use client';

import Link from 'next/link';
import { useState } from 'react';

const MAIN_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/mesa', label: 'Mesa' },
  { href: '/fotos', label: 'Fotos' }
];

const MENU_LINKS = [
  { href: '/roteiro', label: 'Roteiro' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/cardapio', label: 'Cardapio' },
  { href: '/mural', label: 'Mural' },
  { href: '/etiqueta', label: 'Etiqueta' }
];

export default function TabBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-roseDeep/20 bg-ivory/95 pb-safe backdrop-blur sm:hidden" aria-label="Navegacao mobile">
        <div className="mx-auto grid h-16 max-w-2xl grid-cols-4">
          {MAIN_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 text-xs font-semibold text-roseDeep/80"
              aria-label={`Abrir ${item.label}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
          <button
            type="button"
            className="flex flex-col items-center justify-center gap-0.5 text-xs font-semibold text-roseDeep/80"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            Menu
          </button>
        </div>
      </nav>

      {open ? (
        <div className="fixed inset-0 z-50 bg-cocoa/35 sm:hidden" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl border border-roseDeep/20 bg-ivory p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-roseDeep/30" />
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-roseDeep/75">Mais acessos</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {MENU_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-roseDeep/20 bg-white/80 px-3 py-2 text-center text-sm font-semibold text-wine"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-full border border-roseDeep/25 px-4 py-2 text-sm font-semibold text-cocoa"
              onClick={() => setOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
