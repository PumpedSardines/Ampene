import * as React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { _halt, _mode } from "../../state/mode";
import ClickAwayListener from 'react-click-away-listener';
import "./panel.scss";
import { _color } from "../../state/shapes";
import { rectangle } from "../../functions/rectangle/rectangle";
import useResize from "../../hooks/useResize";
import useHalt from "../../hooks/useHalt";
import { colors } from "../../config";
import { _darkTheme } from "../../state/design";
import { translateColor } from "../../functions/colors/translateColor";

function Panel() {
    const [mode, setMode] = useRecoilState(_mode);
    const darkTheme = useRecoilValue(_darkTheme);

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
            name: "Circle",
            id: "circle"
        },
        {
            name: "Rectangle",
            id: "rectangle"
        },
        {
            name: "Move",
            id: "move"
        }
    ] as const;

return <div id="panel" className={darkTheme ? "dark" : "ligth"}>
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
        <ColorPicker />
    </div>
}

function ColorPicker() {
    const [halt, startHalt, endHalt] = useHalt("color-picker");
    const [color, setColor] = useRecoilState(_color);
    const colorPickerRef = React.useRef<HTMLDivElement>(null);
    const darkTheme = useRecoilValue(_darkTheme);

    return <>
        {colorPickerRef.current && halt && <ClickAwayListener onClickAway={() => endHalt()}>
            <div
                className="select-color-picker"
                style={(() => {
                    // Calculate position of the selector
                    const rect = colorPickerRef.current.getBoundingClientRect();

                    const { x, y } = rectangle(rect).getOrigin();

                    console.log(x);

                    return {
                        right: -1,
                        // Since the panel is locked to the center
                        // We can use the innerHeight at any time
                        // Since y is gonna depend on it anyways
                        bottom: 60,
                    }
                })()}
            >
                {colors.map(v =>
                    <div
                        key={v}
                        className="color"
                        onClick={() => (setColor(v), endHalt())}
                        style={{ backgroundColor: translateColor(v, darkTheme) }}
                    ></div>
                )}
            </div>
        </ClickAwayListener>}
        <div
            ref={colorPickerRef}
            className="color-picker"
            style={{ backgroundColor: translateColor(color, darkTheme) }}
            onClick={() => {
                // Check so halt isn't already used for another component
                if (!halt) {
                    startHalt();
                };
            }}
        ></div>
    </>
}

export default Panel;