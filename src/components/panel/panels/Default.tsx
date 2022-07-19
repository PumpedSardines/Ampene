import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRecoilState, useRecoilValue } from "recoil";
import { _mode } from "../../../state/mode";
import ColorPicker from "../components/ColorPicker";

import classes from "./default.module.scss";
import { classMates } from "../../../lib/classMates";
import Shapes from "../components/Shapes";
import { _mouse } from "../../../state/mouse";

function Default() {
    const [mode, setMode] = useRecoilState(_mode);
    const { down: mouseDown } = useRecoilValue(_mouse);

    const buttons = [
        {
            icon: "pen",
            id: "draw"
        },
        {
            icon: "eraser",
            id: "erase"
        },
        {
            icon: "object-ungroup",
            id: "select"
        },
        {
            icon: "arrows-alt",
            id: "move"
        }
    ] as const;

    return <div className={classMates([
        classes.panel,
        mouseDown && classes["mouse-down"]
    ])}>
        <div className={classes.buttons}>
            {buttons.map(v => {
                return <button
                    key={v.id}
                    onClick={() => {
                        setMode(v.id);
                    }}
                    className={
                        classMates([
                            classes["mode-button"],
                            v.id === mode && classes["selected"]
                        ])}>
                    <FontAwesomeIcon icon={["fas", v.icon]} />
                </button>
            })}
        </div>
        <ColorPicker width={2} />
        <Shapes />
    </div>
}

export default Default;