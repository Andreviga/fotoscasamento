export function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function cleanText(value, fallback = '') {
  const text = typeof value === 'string' ? value : String(value || fallback);
  return text.trim();
}

export function toBool(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['true', '1', 'sim', 'yes', 'confirmado'].includes(normalized);
  }

  return Boolean(value);
}
