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
        if (halt || !undoRedo || mode !== "rectangle") {
            return;
        }

        if (mouse.down) {
            if (!oldMouse) {
                return setOldMouse(mouse);
            }

            if (!currentShape) {
                setCurrentShape({
                    type: "rectangle",
                    meta: {
                        color
                    },
                    boundingBox: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    },
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                });
            } else {
                if (currentShape.type !== "rectangle") {
                    throw new Error("Current shape isn't of type path");
                }

                const pos = {
                    x: mouse.x - camera.x,
                    y: mouse.y - camera.y
                };

                const oldPos = {
                    x: oldMouse.x - camera.x,
                    y: oldMouse.y - camera.y
                };

                const rectangle = {
                    top: Math.min(pos.y, oldPos.y),
                    bottom: Math.max(pos.y, oldPos.y),
                    left: Math.min(pos.x, oldPos.x),
                    right: Math.max(pos.x, oldPos.x),
                }

                setCurrentShape({
                    ...currentShape,
                    boundingBox: rectangle,
                    ...rectangle
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
        rerenderCondition(mode === "rectangle")([halt, undoRedo, mouse, camera])
    ]);

    return <></>;

}