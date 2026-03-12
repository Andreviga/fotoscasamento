import type { FilterPreset } from '@/types/cloudinary';

export const CLOUDINARY_FILTERS: FilterPreset[] = [
  {
    id: 'original',
    label: 'Original',
    transformation: 'f_auto,q_auto',
    badge: '✿'
  },
  {
    id: 'audrey',
    label: 'P&B',
    transformation: 'e_art:audrey,f_auto,q_auto',
    badge: 'P&B'
  },
  {
    id: 'zorro',
    label: 'Sépia',
    transformation: 'e_art:zorro,f_auto,q_auto',
    badge: 'Sépia'
  },
  {
    id: 'primavera',
    label: 'Sonho',
    transformation: 'e_art:primavera,f_auto,q_auto',
    badge: 'Sonho'
  }
];

export function buildCloudinaryUrl(cloudName: string, publicId: string, transformation: string): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}.jpg`;
}
