import {
  register,
  isRegistered,
  ShortcutHandler,
} from "@tauri-apps/api/globalShortcut";

export async function registerShortcut(
  key: string,
  callback: ShortcutHandler
): Promise<boolean> {
  try {
    if (!(await isRegistered(key))) {
      await register(key, callback);
    }
  } catch (e) {
    return false;
  } finally {
    return true;
  }
}

// 말치님 .,
