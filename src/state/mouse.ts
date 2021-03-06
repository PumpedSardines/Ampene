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