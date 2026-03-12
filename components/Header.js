import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-rose/10 bg-white/95 backdrop-blur-md">
      <div className="container flex items-center justify-between px-4 py-4 sm:py-5">
        <Link href="/" className="font-serifRomance text-2xl text-wine">
          ✿ André & Nathália
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="text-sm text-wine/75 hover:text-wine">
            Casa
          </Link>
          <Link href="/fotos" className="text-sm text-wine/75 hover:text-wine">
            Fotos
          </Link>
          <Link href="/mural" className="text-sm text-wine/75 hover:text-wine">
            Mural
          </Link>
        </nav>
      </div>
    </header>
  );
}
