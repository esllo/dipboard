import { useEffect, useTransition } from "react";
import { UnlistenFn, listen } from "@tauri-apps/api/event";

type Clipboard = {
  Text?: string;
  Image?: {
    data: number[];
    width: number;
    height: number;
  };
};

type ClipboardChangePayload = {
  clipboard: Clipboard;
};

type ClipboardChangeOptions = {
  onChange: (clipboard: Clipboard) => void;
};

export function useClipboardChange({ onChange }: ClipboardChangeOptions): void {
  const [, startTransition] = useTransition();

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

          startTransition(() => onChange(clipboard));
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
  }, []);
}
