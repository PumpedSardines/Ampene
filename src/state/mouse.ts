import { atom } from "recoil";
import { Mouse } from "../types/types";

export const _mouse = atom<Mouse>({
    key: "mouse",
    default: {
        x: 0,
        y: 0,
        down: false
    }
});

export const _oldMouse = atom<null | Mouse>({
    key: "oldMouse",
    default: null
});