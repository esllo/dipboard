import { invoke } from "@tauri-apps/api";

export function writeAppData<T>(filename: string, object: T): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const content = JSON.stringify(object);
      const result = await invoke<true>("write_file", {
        filename,
        content,
      });

      resolve(result);
    } catch (e) {
      reject(false);
    }
  });
}

export function readAppData<T>(filename: string, defaultValue?: T): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await invoke<string>("read_file", {
        filename,
      });

      const content = JSON.parse(result);

      resolve(content);
    } catch (e) {
      reject(defaultValue || null);
    }
  });
}
