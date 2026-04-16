export default function LoadingSpinner({ label = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-wine/80" role="status" aria-live="polite">
      <span className="inline-flex h-5 w-5 animate-spin rounded-full border-2 border-wine/20 border-t-wine" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
