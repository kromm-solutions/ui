export interface SignaturePoint {
  x: number;
  y: number;
  pressure?: number;
  timestamp?: number;
}

export interface SignatureStroke {
  points: SignaturePoint[];
}

export interface SignatureData {
  version: 1;
  width: number;
  height: number;
  strokes: SignatureStroke[];
}

export interface SignaturePen {
  color?: string;
  width?: number;
}

export interface SignatureDataUrlOptions {
  type?: string;
  quality?: number;
  background?: string;
}

export interface SignatureSvgOptions {
  width?: number;
  height?: number;
  background?: string;
}
