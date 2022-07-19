import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { _mode } from "../../state/mode";
import { Mouse } from "../../types/types";
import { _mouse } from "../../state/mouse";
import { rerenderCondition } from "../../lib/rerenderCondition";
import { _camera } from "../../state/camera";

export default function Move() {

    const mouse = useRecoilValue(_mouse);
    const mode = useRecoilValue(_mode);
    const [oldMouse, setOldMouse] = React.useState<null | Mouse>(null);
    const [camera, setCamera] = useRecoilState(_camera);

    React.useEffect(() => {
        // Check if mode is halted
        // In this case something else is running on screen
        // And canvas should be "frozen"
        if (mode !== "move") {
            return;
        }

        
        if (mouse.down && oldMouse?.down) {
            const changeX = mouse.x - oldMouse.x;
            const changeY = mouse.y - oldMouse.y;

            setCamera({
                x: camera.x + changeX,
                y: camera.y + changeY,
            });
        }

        setOldMouse(mouse);
    }, [
        rerenderCondition(mode === "move")([mouse])
    ]);

    return <></>;

}