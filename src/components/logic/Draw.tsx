import * as React from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { _color, _currentShape, _shapes } from "../../state/shapes";
import { _mode } from "../../state/mode";
import { _undoRedo } from "../managers/UndoRedo";
import { Mouse, Shapes } from "../../types/types";
import { _mouse } from "../../state/mouse";
import { rerenderCondition } from "../../lib/rerenderCondition";
import { _camera } from "../../state/camera";
import { v4 as uuid } from "uuid";

export default function Draw() {

    const mouse = useRecoilValue(_mouse);
    const mode = useRecoilValue(_mode);
    const color = useRecoilValue(_color);
    const undoRedo = useRecoilValue(_undoRedo);
    const [currentShape, setCurrentShape] = useRecoilState(_currentShape);
    const [oldMouse, setOldMouse] = React.useState<null | Mouse>(null);
    const camera = useRecoilValue(_camera);

    const addShape = useRecoilCallback(({ snapshot, set }) => async (path: Shapes) => {

        const allShapes = JSON.parse(JSON.stringify(await snapshot.getPromise(_shapes)));

        allShapes[uuid()] = path;

        set(_shapes, allShapes);

    });

    React.useEffect(() => {
        // Check if mode is halted
        // In this case something else is running on screen
        // And canvas should be "frozen"
        if (!undoRedo || mode !== "draw") {
            return;
        }

        if (mouse.down && oldMouse?.down) {
            if (!currentShape) {
                setCurrentShape({
                    type: "path",
                    meta: {
                        color
                    },
                    boundingBox: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    },
                    positions: []
                });
            } else {
                if (currentShape.type !== "path") {
                    throw new Error("Current shape isn't of type path");
                }

                const position = {
                    x: mouse.x - camera.x,
                    y: mouse.y - camera.y
                };

                const boundingBox = (() => {

                    if (currentShape.positions.length === 0) {
                        return {
                            top: position.y,
                            bottom: position.y,
                            left: position.x,
                            right: position.x
                        }
                    }

                    const cbb = currentShape.boundingBox;

                    return {
                        top: Math.min(cbb.top, position.y),
                        bottom: Math.max(cbb.bottom, position.y),
                        left: Math.min(cbb.left, position.x),
                        right: Math.max(cbb.right, position.x),
                    }

                })();

                setCurrentShape({
                    ...currentShape,
                    boundingBox,
                    positions: [
                        ...currentShape.positions,
                        position
                    ]
                });
            }
        } else {
            if (currentShape) {
                addShape(currentShape)
                    .then(v => {
                        setCurrentShape(null);
                        undoRedo.pushUndoStack();
                    });
            }
        }

        setOldMouse(mouse);
    }, [
        rerenderCondition(mode === "draw")([undoRedo, mouse, camera])
    ]);

    return <></>;

}