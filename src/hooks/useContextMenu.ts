import { useEffect } from "react";

export function useContextMenu() {
  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    // TODO: context menu?
  }

  useEffect(() => {
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
}
