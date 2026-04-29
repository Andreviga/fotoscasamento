export type MesaPosition = {
  n: number;
  nome: string;
  cx: number;
  cy: number;
  r: number;
  isNoivos?: boolean;
};

export type MapaCrop = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export declare const MESA_POSITIONS_DEFAULT: MesaPosition[];
export declare const MAPA_CROP_DEFAULT: MapaCrop;
export declare const MAPA_ASPECT_RATIO: number;

export declare function normalizeMapaCrop(rawCrop: Partial<MapaCrop> | null | undefined): MapaCrop;
export declare function getMapaMediaFrameStyle(rawCrop: Partial<MapaCrop> | null | undefined): {
  left: string;
  top: string;
  width: string;
  height: string;
};