import { Color } from "../../types/types";

export function getHex(color: Color, darkMode: boolean): string {
  if (darkMode) {
    return {
      [Color.Primary]: "#CCCCCC",
      [Color.Select]: "#00FF00",
      [Color.Yellow]: "#F9DC5C",
      [Color.Green]: "#729933",
      [Color.Red]: "#EA261F",
      [Color.Orange]: "#F0803C",
      [Color.Blue]: "#39A9DB",
    }[color];
  } else {
    return {
      [Color.Primary]: "#333333",
      [Color.Select]: "#00FF00",
      [Color.Yellow]: "#ECC209",
      [Color.Green]: "#729933",
      [Color.Red]: "#EA261F",
      [Color.Orange]: "#F0803C",
      [Color.Blue]: "#39A9DB",
    }[color];
  }
}
