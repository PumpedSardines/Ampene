import * as React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getHex } from "../../../functions/colors/getHex";
import { _darkTheme } from "../../../state/design";
import { _color } from "../../../state/shapes";
import { Color } from "../../../types/types";

import classes from "./colorPicker.module.scss";
interface Props {
    width?: number
}

function ColorPicker(props: Props) {
    const [color, setColor] = useRecoilState(_color);
    const darkTheme = useRecoilValue(_darkTheme);

    const colors = [
        Color.Primary,
        Color.Red,
        Color.Green,
        Color.Orange,
        Color.Yellow,
        Color.Blue,
    ]

    const columns = props.width ?? 3;
    const rows = Math.ceil(colors.length / columns);


    const colorPickerStyle = {
        gridAutoRows: new Array(rows).fill("50px").join(" "),
        gridTemplateColumns: new Array(columns).fill("50px").join(" "),
        display: "grid",
        gridGap: "8px",
        gridArea: `auto / auto / span ${rows} / span ${columns}`
    } as const

    return <div style={colorPickerStyle}>
        {colors.map(v => (
            <div
                style={{ backgroundColor: getHex(v, darkTheme) }}
                className={classes.color}
                onClick={() => {
                    setColor(v);
                }}
            >
                {color === v && <div className={classes["select-point"]}></div>}
            </div>
        ))}
    </div>
}

export default ColorPicker;