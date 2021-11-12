export interface Mouse {
  x: number;
  y: number;
  down: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface Path {
  positions: Position[];
}

export interface Circle {
  radius: number,
  origin: Position
}

export interface Shape<T> {
  type: T,
  meta: {
    color: string,
  },
  boundingBox: Rectangle;
};

export type PathShape = Shape<"path"> & Path;
export type CircleShape = Shape<"circle"> & Circle;
export type RectangleShape = Shape<"rectangle"> & Rectangle;


export type Shapes = PathShape | CircleShape | RectangleShape;