import { invoke } from "@tauri-apps/api";

export async function writeClipboard(text: string): Promise<boolean> {
  if (!("navigator" in window)) return false;
  if (!("clipboard" in navigator)) return false;
  if (!navigator.clipboard) return false;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

export async function readClipboard(): Promise<string | boolean> {
  if (!("navigator" in window)) return false;
  if (!("clipboard" in navigator)) return false;
  if (!navigator.clipboard) return false;

  try {
    return await navigator.clipboard.readText();
  } catch (e) {
    return false;
  }
}

export function writeClipboardImage(image: number[]): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await invoke<true>("copy_image", {
        image,
      });
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}
