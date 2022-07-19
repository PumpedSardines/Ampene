import { useState, useEffect } from "react";

export default function useResize() {
  const [win, setWindow] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener("resize", (e) => {
      setWindow([window.innerWidth, window.innerHeight]);
    });
  }, []);

  return win;
}
