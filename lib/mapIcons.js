import {
  Camera,
  Car,
  CakeSlice,
  DoorOpen,
  Gift,
  Heart,
  MapPin,
  Martini,
  Music2,
  Table2,
  Toilet,
  Trees,
  Utensils,
  Wine
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  mesa: Table2,
  buffet: Utensils,
  bar: Martini,
  doces: CakeSlice,
  pista: Music2,
  fotos: Camera,
  estacionamento: Car,
  banheiro: Toilet,
  entrada: DoorOpen,
  cerimonia: Heart,
  jardim: Trees,
  presentes: Gift,
  bebidas: Wine,
  default: MapPin
};

const CATEGORY_KEYWORDS = [
  { category: 'mesa', keywords: ['mesa', 'convidado', 'convidados', 'bistro'] },
  { category: 'buffet', keywords: ['buffet', 'comida', 'jantar', 'cozinha', 'cafe'] },
  { category: 'bar', keywords: ['bar', 'drink', 'caipirinha'] },
  { category: 'bebidas', keywords: ['bebida', 'welcome drink', 'agua aromatizada'] },
  { category: 'doces', keywords: ['doce', 'bolo', 'sobremesa', 'bem casado'] },
  { category: 'pista', keywords: ['pista', 'dj', 'musica', 'dan', 'banda'] },
  { category: 'fotos', keywords: ['foto', 'fotografia', 'cabine'] },
  { category: 'estacionamento', keywords: ['estacionamento', 'carro', 'valet'] },
  { category: 'banheiro', keywords: ['banheiro', 'lavabo'] },
  { category: 'entrada', keywords: ['entrada', 'recepcao', 'recepção', 'acesso'] },
  { category: 'cerimonia', keywords: ['cerimonia', 'cerimônia', 'altar', 'noivos', 'casamento'] },
  { category: 'jardim', keywords: ['jardim', 'externo', 'planta'] },
  { category: 'presentes', keywords: ['presente', 'lembrancinha'] }
];

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function getMapType(item) {
  const text = normalize(
    `${item?.type || ''} ${item?.tipo || ''} ${item?.category || ''} ${item?.title || ''} ${item?.name || ''} ${item?.label || ''} ${item?.id || ''}`
  );

  for (const rule of CATEGORY_KEYWORDS) {
    if (rule.keywords.some((term) => text.includes(normalize(term)))) {
      return rule.category;
    }
  }

  return 'default';
}

export function getMapIcon(item) {
  const type = getMapType(item);
  return CATEGORY_ICON_MAP[type] || MapPin;
}

export const MAP_LEGEND_ITEMS = [
  { type: 'mesa', label: 'Mesas' },
  { type: 'buffet', label: 'Buffet' },
  { type: 'bar', label: 'Bar' },
  { type: 'banheiro', label: 'Banheiros' },
  { type: 'entrada', label: 'Entrada' },
  { type: 'fotos', label: 'Fotos' },
  { type: 'estacionamento', label: 'Estacionamento' },
  { type: 'pista', label: 'Pista' }
];
