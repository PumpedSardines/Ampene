import { atom } from "recoil";

export const _darkTheme = atom<boolean>({
    key: "dark theme",
    default: false
});