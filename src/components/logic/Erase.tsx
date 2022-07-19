import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { _shapes } from "../../state/shapes";
import { _mode } from "../../state/mode";
import { _undoRedo } from "../managers/UndoRedo";
import { CircleShape, Mouse, RectangleShape, Shapes } from "../../types/types";
import { _mouse } from "../../state/mouse";
import { rerenderCondition } from "../../lib/rerenderCondition";
import { rectangle } from "../../functions/rectangle/rectangle";
import { _camera } from "../../state/camera";
import { circle } from "../../functions/circle/circle";

export default function Erase() {

    const mouse = useRecoilValue(_mouse);
    const mode = useRecoilValue(_mode);
    const undoRedo = useRecoilValue(_undoRedo);
    const [shapes, setShapes] = useRecoilState(_shapes);
    const camera = useRecoilValue(_camera);


    React.useEffect(() => {
        if (!undoRedo) {
            return;
        }


        if (mouse.down) {
            const eraseSize = 10;
            const mouseRect = {
                top: mouse.y - eraseSize,
                bottom: mouse.y + eraseSize,
                left: mouse.x - eraseSize,
                right: mouse.x + eraseSize,
            };

            const indexes: string[] = []
            for (const [id, shape] of Object.entries(shapes)) {

                const bb = rectangle(shape.boundingBox, camera);
                if (!bb.rectangle.overlap(mouseRect)) {
                    continue;
                }

                switch (shape.type) {
                    case "path": {

                        for (const position of shape.positions) {
                            if (rectangle(mouseRect).position.isInside(position, camera)) {
                                indexes.push(id);
                                break;
                            }
                        }
                        break;
                    }
                    case "circle": {

                        const biggerCircle: CircleShape = JSON.parse(JSON.stringify(shape));
                        const smallerCircle: CircleShape = JSON.parse(JSON.stringify(shape));
                        biggerCircle.radius += eraseSize;
                        smallerCircle.radius -= eraseSize;

                        if(
                            circle(biggerCircle, camera).position.isInside(mouse) &&
                            !circle(smallerCircle, camera).position.isInside(mouse)
                        ) {
                            indexes.push(id);
                        }
                        break;
                    }
                    case "rectangle": {

                        const biggerRect: RectangleShape = JSON.parse(JSON.stringify(shape));
                        const smallerRect: RectangleShape = JSON.parse(JSON.stringify(shape));
                        
                        biggerRect.top -= eraseSize;
                        biggerRect.bottom += eraseSize;
                        biggerRect.left -= eraseSize;
                        biggerRect.right += eraseSize;

                        smallerRect.top += eraseSize;
                        smallerRect.bottom -= eraseSize;
                        smallerRect.left += eraseSize;
                        smallerRect.right -= eraseSize;

                        if(
                            rectangle(biggerRect, camera).position.isInside(mouse) &&
                            !rectangle(smallerRect, camera).position.isInside(mouse)
                        ) {
                            indexes.push(id);
                        }

                    }
                }

            }

            const newShapes: Record<string, Shapes> = JSON.parse(JSON.stringify(shapes));

            for (const index of indexes) {
                delete newShapes[index];
            }

            if (indexes.length) {
                setShapes(newShapes);
                undoRedo.pushUndoStack({
                    shapes: newShapes
                });
            }
        }
    }, [rerenderCondition(mode === "erase")([undoRedo, shapes, mouse, camera])]);

    return <></>;

}