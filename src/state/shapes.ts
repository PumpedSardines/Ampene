import { atom } from "recoil";
import { Color, Path, Shapes } from "../types/types";

export const _shapes = atom<Record<string, Shapes>>({
    key: "all-shapes",
    default: {}
});

export const _currentShape = atom<Shapes | null>({
    key: "current-drawing-shape",
    default: null
});

export const _color = atom<Color>({
    key: "color",
    default: Color.Primary
});