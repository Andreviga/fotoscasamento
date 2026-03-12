export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t border-rose/10 bg-blush/30 py-8">
      <div className="container text-center">
        <p className="text-sm text-wine/70">
          ✿ {year} — André & Nathália. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
