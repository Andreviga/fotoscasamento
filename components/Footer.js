export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-rose/10 bg-blush/30 py-8">
      <div className="container text-center">
        <p className="text-sm text-wine/70">
          ✿ {year} —
          <span className="wedding-names" style={{ '--font-size': '24px', '--line-height': '1', marginLeft: '0.35rem' }}>
            André <span className="wedding-amp">&amp;</span> Nathália
          </span>
          . Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
