import { Circle, Position } from "../../types/types";

export const circle = (object: Circle, offset: Position = { x: 0, y: 0 }) => {
  return {
    position: {
      isInside: (pos: Position, { x, y }: Position = { x: 0, y: 0 }) => {
        const { origin } = object;

        const radius = Math.sqrt(
          Math.abs(pos.x + x - origin.x - offset.x) ** 2 +
            Math.abs(pos.y + y - origin.y - offset.y) ** 2
        );

        return radius < object.radius;
      },
    },
  };
};
