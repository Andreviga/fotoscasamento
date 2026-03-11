import type { FilterPreset } from '@/types/cloudinary';

export const CLOUDINARY_FILTERS: FilterPreset[] = [
  { id: 'original', label: 'Original', transformation: 'f_auto,q_auto' },
  { id: 'audrey', label: 'P&B', transformation: 'e_art:audrey,f_auto,q_auto' },
  { id: 'zorro', label: 'Sépia', transformation: 'e_art:zorro,f_auto,q_auto' },
  { id: 'primavera', label: 'Sonho', transformation: 'e_art:primavera,f_auto,q_auto' },
  { id: 'fes', label: 'Filme', transformation: 'e_art:fes,f_auto,q_auto' }
];

export function buildCloudinaryUrl(cloudName: string, publicId: string, transformation: string): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}.jpg`;
}
