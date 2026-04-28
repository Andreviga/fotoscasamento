import type { LucideIcon } from 'lucide-react';

export type MapIconItem = {
  type?: string;
  tipo?: string;
  category?: string;
  title?: string;
  name?: string;
  label?: string;
  id?: string;
};

export declare function getMapType(item: MapIconItem): string;
export declare function getMapIcon(item: MapIconItem): LucideIcon;

export declare const MAP_LEGEND_ITEMS: Array<{
  type: string;
  label: string;
}>;
