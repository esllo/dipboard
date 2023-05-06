#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    fs::{self, OpenOptions},
    io::Write,
    thread,
    time::Duration,
};
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use clipboard::{ClipboardContext, ClipboardProvider};
use tauri_plugin_autostart::MacosLauncher;

fn get_clipboard() -> String {
    let mut ctx: ClipboardContext = ClipboardProvider::new().unwrap();

    let raw_content = ctx.get_contents();

    match raw_content {
        Ok(content) => content,
        Err(_) => "".to_owned(),
    }
}

#[tauri::command]
fn write_file(app_handle: tauri::AppHandle, filename: String, content: String) -> Result<bool, i8> {
    let mut path = match app_handle.path_resolver().app_data_dir() {
        Some(dir) => dir,
        None => return Err(0),
    };
    path.push(filename);

    if let Some(parent) = std::path::Path::new(&path).parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).unwrap();
        }
    }

    let mut file = match OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(&path)
    {
        Ok(file) => file,
        Err(_e) => {
            return Err(3);
        }
    };

    match file.write_all(content.as_bytes()) {
        Ok(_) => Ok(true),
        Err(_) => Err(2),
    }
}

#[tauri::command]
fn read_file(app_handle: tauri::AppHandle, filename: String) -> Result<String, i8> {
    let mut path = match app_handle.path_resolver().app_data_dir() {
        Some(dir) => dir,
        None => return Err(0),
    };
    path.push(filename);

    if !path.exists() {
        return Err(1);
    };

    let content = match fs::read_to_string(&path) {
        Ok(content) => content,
        Err(_) => return Err(2),
    };

    Ok(content)
}

fn create_tray() -> SystemTray {
    let show = CustomMenuItem::new("show", "열기");
    let quit = CustomMenuItem::new("quit", "종료");

    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    tray
}

fn handle_system_event(app: &AppHandle, event: SystemTrayEvent) -> () {
    match event {
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            "show" => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
            }
            _ => {}
        },
        _ => {}
    }
}

#[derive(Clone, serde::Serialize)]
struct ClipboardPayload {
    clipboard: String,
}

fn listen_clipbaord(app_handle: tauri::AppHandle) {
    let _handle = thread::spawn(move || {
        let mut last_clipboard = get_clipboard();

        loop {
            let clipboard = get_clipboard();

            if clipboard != last_clipboard {
                last_clipboard = clipboard.clone();
                app_handle
                    .emit_all("clipboard_change", ClipboardPayload { clipboard })
                    .unwrap();
            }
            thread::sleep(Duration::from_millis(1000));
        }
    });
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.app_handle();
            listen_clipbaord(handle);
            Ok(())
        })
        .system_tray(create_tray())
        .on_system_tray_event(handle_system_event)
        .invoke_handler(tauri::generate_handler![write_file, read_file])
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
