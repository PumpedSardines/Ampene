import { atom } from "recoil";
import { Path, Shapes } from "../types/types";

export const _shapes = atom<Shapes[]>({
    key: "all-shapes",
    default: []
});

export const _currentShape = atom<Shapes | null>({
    key: "current-drawing-shape",
    default: null
});

export const _color = atom<string>({
    key: "color",
    default: "#333333"
});