import * as React from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { _color, _currentShape, _shapes } from "../../state/shapes";
import { _mode, _selectArea } from "../../state/mode";
import { _undoRedo } from "../managers/UndoRedo";
import { Mouse, Rectangle, Shapes } from "../../types/types";
import { _mouse } from "../../state/mouse";
import { rerenderCondition } from "../../lib/rerenderCondition";
import { _camera } from "../../state/camera";
import { v4 as uuid } from "uuid";

export default function Select() {

    const mouse = useRecoilValue(_mouse);
    const mode = useRecoilValue(_mode);
    const undoRedo = useRecoilValue(_undoRedo);
    const [selectArea, setSelectArea] = useRecoilState(_selectArea);
    const [oldMouse, setOldMouse] = React.useState<null | Mouse>(null);
    const camera = useRecoilValue(_camera);

    React.useEffect(() => {
        // Check if mode is halted
        // In this case something else is running on screen
        // And canvas should be "frozen"
        if (!undoRedo || mode !== "select") {
            return;
        }

        if (mouse.down) {
            if (!oldMouse) {
                return setOldMouse(mouse);
            }

            if (!selectArea) {
                setSelectArea({
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                });
            } else {
                const pos = {
                    x: mouse.x - camera.x,
                    y: mouse.y - camera.y
                };

                const oldPos = {
                    x: oldMouse.x - camera.x,
                    y: oldMouse.y - camera.y
                };

                setSelectArea({
                    top: Math.min(pos.y, oldPos.y),
                    bottom: Math.max(pos.y, oldPos.y),
                    left: Math.min(pos.x, oldPos.x),
                    right: Math.max(pos.x, oldPos.x),
                });
            }
        } else {
            if(oldMouse?.down) {

                console.log("SET");

            }

            setOldMouse(null);
            setSelectArea(null);
        }
    }, [rerenderCondition(mode === "select")([undoRedo, mouse, camera])]);

    return <></>;

}