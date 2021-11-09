export interface Mouse {
  x: number;
  y: number;
  down: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Rect {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type Line = {
  boundingBox: Rect;
  positions: Position[];
};
