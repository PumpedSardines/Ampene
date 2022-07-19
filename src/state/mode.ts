import { atom } from "recoil";
import { Rectangle } from "../types/types";

export const _mode = atom<"draw" | "move" | "erase" | "circle" | "rectangle" | "select">({
    key: "mode",
    default: "draw"
});

export const _selected = atom<string[]>({
    key: "selected",
    default: []
});

export const _selectArea = atom<Rectangle | null>({
    key: "selectArea",
    default: null
});