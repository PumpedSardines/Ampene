import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { _shapes } from "../../state/shapes";
import { _halt, _mode } from "../../state/mode";
import { _undoRedo } from "../managers/UndoRedo";
import { CircleShape, Mouse, RectangleShape } from "../../types/types";
import { _mouse } from "../../state/mouse";
import { rerenderCondition } from "../../lib/rerenderCondition";
import { rectangle } from "../../functions/rectangle/rectangle";
import { _camera } from "../../state/camera";
import { circle } from "../../functions/circle/circle";

export default function Erase() {

    const mouse = useRecoilValue(_mouse);
    const mode = useRecoilValue(_mode);
    const halt = useRecoilValue(_halt);
    const undoRedo = useRecoilValue(_undoRedo);
    const [shapes, setShapes] = useRecoilState(_shapes);
    const camera = useRecoilValue(_camera);


    React.useEffect(() => {
        // Check if mode is halted
        // In this case something else is running on screen
        // And canvas should be "frozen"
        if (halt) {
            return;
        }

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

            const indexes: number[] = []
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];

                const bb = rectangle(shape.boundingBox, camera);
                if (!bb.rectangle.overlap(mouseRect)) {
                    continue;
                }

                switch (shape.type) {
                    case "path": {

                        for (const position of shape.positions) {
                            if (rectangle(mouseRect).position.isInside(position, camera)) {
                                indexes.push(i);
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
                            indexes.push(i);
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
                            indexes.push(i);
                        }

                    }
                }

            }

            const newShapes = JSON.parse(JSON.stringify(shapes));

            for (const index of indexes) {
                newShapes.splice(index, 1);
            }

            if (indexes.length) {
                setShapes(newShapes);
                undoRedo.pushUndoStack({
                    shapes: newShapes
                });
            }
        }
    }, [rerenderCondition(mode === "erase")([halt, undoRedo, shapes, mouse, camera])]);

    return <></>;

}