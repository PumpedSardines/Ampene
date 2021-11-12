import { colorMap } from "../../config";
import { invertColor } from "../../lib/invertHexcolor";

export function translateColor(hex: string, darkTheme: boolean) {

    if(!darkTheme) {
        if(hex in colorMap) {
            return colorMap[hex];
        }
    }
    return hex;
}