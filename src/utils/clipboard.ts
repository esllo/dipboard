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
