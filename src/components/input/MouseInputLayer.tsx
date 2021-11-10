import * as React from "react";
import { useRecoilState } from "recoil";
import { _mouse } from "../../state/mouse";
import "./mouse-input-layer.scss";

function MouseInputLayer() {

    const [mouse, setMouse] = useRecoilState(_mouse);

    return <div
        id="mouse-input-layer"
        onMouseMove={(e) => {
            const isDown = e.buttons === 1;
            setMouse({
                ...mouse,
                down: isDown,
                x: e.pageX,
                y: e.pageY
            });
        }}
    >

    </div>

}

export default MouseInputLayer;