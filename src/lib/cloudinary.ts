import { FilterPreset } from '@/types/cloudinary';

export const CLOUDINARY_FILTERS: FilterPreset[] = [
  { id: 'original', label: 'Original', transformation: 'f_auto,q_auto' },
  { id: 'audrey', label: 'P&B Audrey', transformation: 'e_art:audrey,f_auto,q_auto' },
  { id: 'zorro', label: 'Vintage Zorro', transformation: 'e_art:zorro,f_auto,q_auto' },
  { id: 'primavera', label: 'Primavera', transformation: 'e_art:primavera,f_auto,q_auto' },
  { id: 'fes', label: 'Filme Fes', transformation: 'e_art:fes,f_auto,q_auto' }
];

export function buildCloudinaryUrl(
  cloudName: string,
  publicId: string,
  transformation: string,
  width = 900
): string {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation},w_${width}/${publicId}.jpg`;
}

export function toCloudinaryFetchDelivery(cloudName: string, sourceUrl: string): string {
  const encoded = encodeURIComponent(sourceUrl);
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto:best/${encoded}`;
}
