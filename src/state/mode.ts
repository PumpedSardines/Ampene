import { atom } from "recoil";

export const _mode = atom<"draw" | "move" | "erase">({
    key: "mode",
    default: "draw"
})