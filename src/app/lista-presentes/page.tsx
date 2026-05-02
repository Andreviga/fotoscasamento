export default function ListaPresentesFallbackPage() {
  return (
    <main className="main" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="hero-haze" />
      <div className="container relative z-10">
        <section className="romantic-panel p-6 sm:p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-roseDeep/55">Lista de presentes</p>
          <h1 className="mt-2 text-3xl sm:text-4xl text-cocoa">Estamos te redirecionando</h1>
          <p className="mt-3 text-sm sm:text-base text-cocoa/80">
            Se o acesso automático falhar, use um dos links abaixo para abrir a lista de presentes.
          </p>
          <p className="mt-2 text-xs text-wine/70">
            Se aparecer "403 Forbidden", tente o link alternativo abaixo.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="https://andrenathalia03052026.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary w-full sm:w-auto px-6 py-3 text-sm"
            >
              Abrir lista principal
            </a>
            <a
              href="https://www.andrenathalia03052026.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--outline w-full sm:w-auto px-6 py-3 text-sm"
            >
              Abrir lista alternativa
            </a>
          </div>

          <p className="mt-5 text-xs text-wine/70">
            Em caso de indisponibilidade momentânea, tente novamente em alguns minutos.
          </p>
        </section>
      </div>
    </main>
  );
}
