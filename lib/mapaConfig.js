// Posicoes iniciais baseadas no layout real da foto do salao.
// cx e cy sao percentuais (0-100) sobre largura e altura da imagem.
// r: raio do circulo em unidades viewBox (viewBox = "0 0 100 130")
// Ajuste fino feito pelo admin atraves do painel de calibracao.

export const MESA_POSITIONS_DEFAULT = [
  // --- Linha superior (proxima ao buffet e DJ) ---
  { n: 6, nome: 'Estocolmo', cx: 14.5, cy: 33.0, r: 4.2 },
  { n: 17, nome: 'Split', cx: 24.0, cy: 33.0, r: 5.2 },
  { n: 10, nome: 'Madrid', cx: 34.5, cy: 29.5, r: 4.2 },
  { n: 9, nome: 'Las Vegas', cx: 45.0, cy: 29.5, r: 4.2 },
  { n: 11, nome: 'Milao', cx: 68.0, cy: 30.5, r: 5.2 },
  { n: 12, nome: 'Paris', cx: 79.5, cy: 30.5, r: 4.2 },

  // --- Segunda linha ---
  { n: 3, nome: 'Colonia', cx: 19.0, cy: 44.0, r: 4.2 },
  { n: 2, nome: 'Campos do Jordao', cx: 30.5, cy: 44.5, r: 4.8 },
  { n: 18, nome: 'Treze Tilias', cx: 39.5, cy: 44.5, r: 4.8 },
  { n: 4, nome: 'Copenhague', cx: 57.0, cy: 41.5, r: 4.2 },
  { n: 7, nome: 'Giethoorn', cx: 69.5, cy: 41.5, r: 4.2 },

  // --- Terceira linha (mesa dos noivos no centro) ---
  { n: 15, nome: 'Santorini', cx: 20.5, cy: 57.5, r: 5.5 },
  { n: 0, nome: 'Noivos', cx: 38.5, cy: 58.5, r: 5.5, isNoivos: true },
  { n: 8, nome: 'Kefalonia', cx: 55.0, cy: 54.0, r: 4.2 },
  { n: 20, nome: 'Sucre', cx: 64.5, cy: 56.5, r: 4.2 },
  { n: 19, nome: 'Zurique', cx: 75.0, cy: 56.5, r: 4.2 },

  // --- Quarta linha ---
  { n: 16, nome: 'Sarajevo', cx: 20.5, cy: 70.5, r: 5.5 },
  { n: 14, nome: 'Salar de Uyuni', cx: 55.0, cy: 67.5, r: 4.8 },
  { n: 5, nome: 'Patagonia', cx: 64.5, cy: 67.5, r: 4.2 },
  { n: 13, nome: 'Roma', cx: 75.5, cy: 70.5, r: 4.2 },

  // --- Linha inferior ---
  { n: 1, nome: 'Amsterda', cx: 20.5, cy: 83.0, r: 4.2 },
];

// Aspect ratio real da imagem do salao (largura / altura)
// Ajuste se a imagem tiver dimensoes diferentes
export const MAPA_ASPECT_RATIO = 0.82;
