import { DependencyList, useEffect } from "react";
import { UnlistenFn, listen } from "@tauri-apps/api/event";

export type ClipboardPayloadContent = {
  Text?: string;
  Image?: {
    hash: string;
    image_box: {
      data: number[];
      width: number;
      height: number;
    };
  };
};

export type ClipboardChangePayload = {
  clipboard: ClipboardPayloadContent;
};

type ClipboardChangeOptions = {
  onChange: (clipboard: ClipboardPayloadContent) => void;
  deps: DependencyList;
};

export function useClipboardChange({
  onChange,
  deps,
}: ClipboardChangeOptions): void {
  useEffect(() => {
    let unregister: UnlistenFn | null = null;
    let mount = true;

    async function register() {
      unregister = await listen<ClipboardChangePayload>(
        "clipboard_change",
        (event) => {
          if (!mount) {
            unregister?.();
            return;
          }
          const { clipboard } = event.payload;
          onChange(clipboard);
        }
      );
    }

    register();

    return () => {
      if (unregister) {
        unregister();
      }
      mount = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
