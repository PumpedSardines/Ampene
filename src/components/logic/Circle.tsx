import * as React from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { _color, _currentShape, _shapes } from "../../state/shapes";
import { _halt, _mode } from "../../state/mode";
import { _undoRedo } from "../managers/UndoRedo";
import { Mouse, Rectangle, Shapes } from "../../types/types";
import { _mouse } from "../../state/mouse";
import { rerenderCondition } from "../../lib/rerenderCondition";
import { _camera } from "../../state/camera";

export default function Circle() {

    const mouse = useRecoilValue(_mouse);
    const mode = useRecoilValue(_mode);
    const halt = useRecoilValue(_halt);
    const color = useRecoilValue(_color);
    const undoRedo = useRecoilValue(_undoRedo);
    const [currentShape, setCurrentShape] = useRecoilState(_currentShape);
    const [oldMouse, setOldMouse] = React.useState<null | Mouse>(null);
    const camera = useRecoilValue(_camera);

    const addShape = useRecoilCallback(({ snapshot, set }) => async (path: Shapes) => {

        const allShapes = await snapshot.getPromise(_shapes);

        set(_shapes, [...allShapes, path]);

    });

    React.useEffect(() => {
        // Check if mode is halted
        // In this case something else is running on screen
        // And canvas should be "frozen"
        if (halt || !undoRedo || mode !== "circle") {
            return;
        }

        if (mouse.down) {
            if (!oldMouse) {
                return setOldMouse(mouse);
            }

            if (!currentShape) {
                setCurrentShape({
                    type: "circle",
                    meta: {
                        color
                    },
                    boundingBox: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    },
                    radius: 0,
                    origin: {
                        x: mouse.x - camera.x,
                        y: mouse.y - camera.y,
                    }
                });
            } else {
                if (currentShape.type !== "circle") {
                    throw new Error("Current shape isn't of type path");
                }

                const { origin } = currentShape;

                const pos = {
                    x: mouse.x - camera.x,
                    y: mouse.y - camera.y
                };

                const radius = Math.sqrt(Math.abs(pos.x - origin.x)**2 + Math.abs(pos.y - origin.y)**2);


                const boundingBox: Rectangle = {
                    top: origin.y - radius,
                    bottom: origin.y + radius,
                    left: origin.x - radius,
                    right: origin.x + radius
                }

                setCurrentShape({
                    ...currentShape,
                    boundingBox,
                    radius
                });
            }
        } else {
            if (currentShape) {
                addShape(currentShape)
                    .then(v => {
                        setCurrentShape(null);
                        undoRedo.pushUndoStack();
                        setOldMouse(null)
                    });
            }
        }
    }, [
        rerenderCondition(mode === "circle")([halt, undoRedo, mouse, camera])
    ]);

    return <></>;

}