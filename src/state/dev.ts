import { atom } from "recoil";


export const _showBoundingBox = atom<boolean>({
    key: "show-bounding-box",
    default: false
});