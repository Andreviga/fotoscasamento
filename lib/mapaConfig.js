// Posicoes iniciais baseadas no layout real da foto do salao.
// cx e cy sao percentuais (0-100) sobre largura e altura da imagem.
// r: raio do circulo em unidades viewBox (viewBox = "0 0 100 130")
// Ajuste fino feito pelo admin atraves do painel de calibracao.

export const MESA_POSITIONS_DEFAULT = [
  // --- Linha superior (proxima ao buffet e DJ) ---
  { n: 6, nome: 'Estocolmo', cx: 27.170299727520437, cy: 48.0819557665788, r: 2.1 },
  { n: 17, nome: 'Split', cx: 26.724795640326978, cy: 56.01394731789062, r: 3 },
  { n: 10, nome: 'Madrid', cx: 37.08855585831063, cy: 48.26865606507585, r: 2.2 },
  { n: 9, nome: 'Las Vegas', cx: 47.86103542234333, cy: 48.71552882853003, r: 2.7 },
  { n: 11, nome: 'Milao', cx: 79.17166212534059, cy: 49.26865606507585, r: 2.9 },
  { n: 12, nome: 'Paris', cx: 89.44550408719346, cy: 49.268656065075845, r: 3 },

  // --- Segunda linha ---
  { n: 3, nome: 'Colonia', cx: 30.580381471389643, cy: 64.22099254630196, r: 2.2 },
  { n: 2, nome: 'Campos do Jordao', cx: 39.35558583106267, cy: 64.16240159198423, r: 2.3 },
  { n: 18, nome: 'Treze Tilias', cx: 40.317438692098094, cy: 56.11869184980886, r: 3 },
  { n: 4, nome: 'Copenhague', cx: 77.84468664850135, cy: 57.92257405694137, r: 2.3 },
  { n: 7, nome: 'Giethoorn', cx: 89.25476839237056, cy: 57.922574056941365, r: 2.3 },

  // --- Terceira linha (mesa dos noivos no centro) ---
  { n: 15, nome: 'Santorini', cx: 28.40190735694823, cy: 73.69913767521427, r: 3.9 },
  { n: 0, nome: 'Noivos', cx: 44.358310626703, cy: 73.58195576657883, r: 2.7, isNoivos: true },
  { n: 8, nome: 'Kefalonia', cx: 69.98637602179838, cy: 58.24529125281477, r: 2.3 },
  { n: 20, nome: 'Sucre', cx: 80.03133514986375, cy: 65.1023006964931, r: 2.2 },
  { n: 19, nome: 'Zurique', cx: 89.57765667574932, cy: 65.43745526908373, r: 2.6 },

  // --- Quarta linha ---
  { n: 16, nome: 'Sarajevo', cx: 28.674386920980922, cy: 85.3585193848517, r: 4.1 },
  { n: 14, nome: 'Salar de Uyuni', cx: 77.75204359673025, cy: 72.63903677972314, r: 2.6 },
  { n: 5, nome: 'Patagonia', cx: 88.61444141689373, cy: 72.63903677972314, r: 2.4 },
  { n: 13, nome: 'Roma', cx: 89.2023593466425, cy: 80.39663872385448, r: 3.3 },

  // --- Linha inferior ---
  { n: 1, nome: 'Amsterda', cx: 47.202997275204375, cy: 64.11962574406058, r: 2.3 },
];

// Aspect ratio real da imagem do salao (largura / altura)
// Ajuste se a imagem tiver dimensoes diferentes
export const MAPA_ASPECT_RATIO = 0.82;
