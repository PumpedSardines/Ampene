import { atom } from "recoil";
import { Line } from "../types/types";

export const _lines = atom<Line[]>({
    key: "lineChunks",
    default: []
});

export const _currentLine = atom<Line | null>({

    key: "currentLine",
    default: null

});