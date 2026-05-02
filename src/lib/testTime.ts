/**
 * Helper para simular data/hora em desenvolvimento.
 * Use `?testTime=YYYY-MM-DD-HH:MM` na URL para simular um momento específico.
 * Ex: http://localhost:3000/?testTime=2026-05-03-18:45
 */

let overrideTime: Date | null = null;

export function initTestTime() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const testTime = params.get('testTime');

  if (testTime) {
    const [datePart, timePart] = testTime.split('-');
    if (datePart && timePart) {
      const [y, m, d] = datePart.split('-').map(Number);
      const [h, min] = timePart.split(':').map(Number);
      if (y && m && d && h !== undefined && min !== undefined) {
        overrideTime = new Date(y, m - 1, d, h, min, 0);
      }
    }
  }
}

export function getNow(): Date {
  if (overrideTime) {
    return new Date(overrideTime);
  }
  return new Date();
}
