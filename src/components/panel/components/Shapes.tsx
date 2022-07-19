import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useRecoilState } from "recoil";
import { classMates } from "../../../lib/classMates";
import { _mode } from "../../../state/mode";
import classes from "./shapes.module.scss";

function Shapes() {
    const [mode, setMode] = useRecoilState(_mode);

    return <div className={classes.box}>
        <div
            onClick={() => setMode("circle")}
            className={classMates([
                classes.button,
                mode === "circle" && classes.selected
            ])}
        >
            <FontAwesomeIcon icon={["fas", "circle"]} />
        </div>
        <div
            onClick={() => setMode("rectangle")}
            className={classMates([
                classes.button,
                mode === "rectangle" && classes.selected
            ])}
        >
            <FontAwesomeIcon icon={["fas", "square"]} />
        </div>
    </div>
}

export default Shapes;