import { atom } from "recoil";

export const _saveLocation = atom<string | null>({
    key: "saveFolder",
    default: null
});