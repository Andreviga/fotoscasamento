export default function ListaPresentesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', fontFamily: 'sans-serif', gap: '1.5rem' }}>
      <p style={{ fontSize: '1.1rem', color: '#333' }}>Acesse nossa lista de presentes:</p>
      <a
        href="https://andrenathalia03052026.site/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ backgroundColor: '#0f4f3d', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', textDecoration: 'none' }}
      >
        Ver Lista de Presentes
      </a>
    </div>
  );
}
