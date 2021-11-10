import * as React from "react";
import { useRecoilState } from "recoil";
import { _mode } from "../../state/mode";
import "./panel.scss";

function Panel() {
    const [mode, setMode] = useRecoilState(_mode);

    const buttons = [
        {
            name: "Draw",
            id: "draw"
        },
        {
            name: "Erase",
            id: "erase"
        },
        {
            name: "Move",
            id: "move"
        }
    ] as const;

    return <div id="panel">
        <div className="buttons">
            {buttons.map(v => {
                return <button
                    key={v.id}
                    onClick={() => {
                        setMode(v.id);
                    }}
                    className={v.id === mode ? "selected" : ""}>
                    {v.name}
                </button>
            })}
        </div>
    </div>
}

export default Panel;