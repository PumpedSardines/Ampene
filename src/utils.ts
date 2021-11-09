import { Position, Rect } from "./types";

export const rect = (object: Rect, offset: Position = { x: 0, y: 0 }) => {
  return {
    rect: {
      isInside: (other: Rect, otherOffset: Position = { x: 0, y: 0 }) => {
        if (
          other.left + otherOffset.x < object.right + offset.x &&
          other.right + otherOffset.x > object.left + offset.x &&
          other.bottom + otherOffset.y > object.top + offset.y &&
          other.top + otherOffset.y < object.bottom + offset.y
        ) {
          return true;
        }
        return false;
      },
      overlap: (other: Rect, otherOffset: Position = { x: 0, y: 0 }) => {
        return (
          rect(object, offset).position.isInside(
            {
              x: other.left,
              y: other.top,
            },
            otherOffset
          ) ||
          rect(object, offset).position.isInside(
            {
              x: other.right,
              y: other.bottom,
            },
            otherOffset
          ) ||
          rect(object, offset).rect.isInside(other, otherOffset) ||
          rect(other, otherOffset).rect.isInside(object, offset)
        );
      },
    },
    position: {
      isInside: (other: Position, otherOffset: Position = { x: 0, y: 0 }) => {
        if (
          object.top + offset.y < other.y + otherOffset.y &&
          object.bottom + offset.y > other.y + otherOffset.y &&
          object.left + offset.x < other.x + otherOffset.x &&
          object.right + offset.x > other.x + otherOffset.x
        ) {
          return true;
        }
        return false;
      },
    },
  };
};
