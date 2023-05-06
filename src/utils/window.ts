import { appWindow } from "@tauri-apps/api/window";

export async function showWindow() {
  await appWindow.show();
}

export async function hideWindow() {
  await appWindow.hide();
}

export async function focusWindow() {
  await appWindow.setFocus();
}

export async function setAot(value: boolean) {
  await appWindow.setAlwaysOnTop(value);
}
