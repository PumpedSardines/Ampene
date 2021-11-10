import { Rectangle, Position } from "../../types/types";

export const rectangle = (
  object: Rectangle,
  offset: Position = { x: 0, y: 0 }
) => {
  return {
    rectangle: {
      isInside: (other: Rectangle, otherOffset: Position = { x: 0, y: 0 }) => {
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
      overlap: (other: Rectangle, otherOffset: Position = { x: 0, y: 0 }) => {
        return (
          rectangle(object, offset).position.isInside(
            {
              x: other.left,
              y: other.top,
            },
            otherOffset
          ) ||
          rectangle(object, offset).position.isInside(
            {
              x: other.right,
              y: other.bottom,
            },
            otherOffset
          ) ||
          rectangle(object, offset).rectangle.isInside(other, otherOffset) ||
          rectangle(other, otherOffset).rectangle.isInside(object, offset)
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
