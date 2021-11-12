import { atom } from "recoil";

export const _mode = atom<"draw" | "move" | "erase" | "circle" | "rectangle">({
    key: "mode",
    default: "draw"
})

export const _halt = atom<boolean>({
    key: "halt",
    default: false
});

export const _haltReason = atom<string>({
    key: "haltreason",
    default: ""
});