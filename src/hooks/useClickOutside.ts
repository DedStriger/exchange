import { RefObject, useEffect } from "react";
export function useClickOutside<T>(
  elem: RefObject<T | HTMLDivElement>,
  handler: () => void,
  attached: boolean
) {
  useEffect(() => {
    if (!attached) return;

    const handleClick = (e: Event) => {
      if (
        !elem.current ||
        /*@ts-expect-error*/
        (!!e.target?.className &&
          /*@ts-expect-error*/
          typeof e.target?.className === "string" &&
          /*@ts-expect-error*/
          !!e.target?.className?.match("lang"))
      )
        return;
      /*@ts-expect-error*/
      if (!elem.current.contains(e.target)) {
        handler();
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [elem, handler, attached]);
}
