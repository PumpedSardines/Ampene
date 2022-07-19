import { atom, selector } from "recoil";

export const _darkTheme = atom<boolean>({
  key: "dark theme",
  default: true,
});

interface Theme {
  background: string;
  backgroundAlt: string;
  contrast: string;
  contrastAlt: string;
  highlight: string;
}

export const _theme = selector<Theme>({
  key: "_theme aosdh",
  get: ({ get }) => {

    if(get(_darkTheme)) {
        return {
            background: "#333",
            backgroundAlt: "#444",
            contrast: "#ccc",
            contrastAlt: "#aaa",
            highlight: "#ccc4",
        }
    } else {
        return {
            background: "#eee",
            backgroundAlt: "#ddd",
            contrast: "#555",
            contrastAlt: "#333",
            highlight: "#5554",
        }
    }

  },
});
