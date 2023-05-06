import { useEffect, useTransition } from "react";
import { UnlistenFn, listen } from "@tauri-apps/api/event";

type ClipboardChangePayload = {
  clipboard: string;
};

type ClipboardChangeOptions = {
  onChange: (clipboard: string) => void;
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
          startTransition(() => onChange(event.payload.clipboard));
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
