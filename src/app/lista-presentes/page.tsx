export default function ListaPresentesPage() {
  return (
    <iframe
      src="/api/lista-presentes/proxy"
      style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }}
      title="Lista de Presentes André e Nathália"
      allow="payment"
    />
  );
}
