import * as React from "react";
import { selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { _mode } from "../../state/mode";
import ClickAwayListener from 'react-click-away-listener';
import { _color } from "../../state/shapes";
import { rectangle } from "../../functions/rectangle/rectangle";
import useResize from "../../hooks/useResize";
import { _darkTheme } from "../../state/design";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ColorPicker from "./components/ColorPicker";
import Default from "./panels/Default";

const panels = {
    "default": <Default />
} as const;

const _currentPanel = selector<keyof typeof panels>({
    key: "currentPanelSelector",
    get: ({ get }) => {
        return "default";
    }
})

function Panel() {
    const panel = useRecoilValue(_currentPanel);

    return panels[panel];
}




export default Panel;