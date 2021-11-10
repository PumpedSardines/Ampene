import { atom } from "recoil";
import { Position } from "../types/types";

export const _camera = atom<Position>({
    key: "camera",
    default: {
        x: 0,
        y: 0
    }
});