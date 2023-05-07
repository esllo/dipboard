#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    borrow::Cow,
    fs::{self, OpenOptions},
    io::Write,
    thread,
    time::Duration,
};
use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

use arboard::{Clipboard, ImageData};

use tauri_plugin_autostart::MacosLauncher;

use image::{GenericImageView, ImageBuffer, ImageOutputFormat, Pixel, Rgba};
use sha1::{Digest, Sha1};

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
struct ImageBox {
    width: usize,
    height: usize,
    data: Vec<u8>,
}

#[derive(Clone, serde::Serialize)]
struct HashImageBox {
    hash: String,
    image_box: ImageBox,
}

#[derive(Clone, serde::Serialize)]
enum Clip {
    Text(String),
    Image(HashImageBox),
}

#[derive(Clone, serde::Serialize)]
struct ClipboardPayload {
    clipboard: Clip,
}

fn get_clipboard_image() -> Option<ImageData<'static>> {
    let mut clipboard = Clipboard::new().unwrap();
    match clipboard.get_image() {
        Ok(image_data) => Some(image_data),
        Err(_) => None,
    }
}

fn get_clipboard_text() -> Option<String> {
    let mut clipboard = Clipboard::new().unwrap();
    match clipboard.get_text() {
        Ok(text_data) => Some(text_data),
        Err(_) => None,
    }
}

#[derive(Clone, serde::Serialize)]
struct TickPayload {
    clipboard: String,
}

fn convert_image(image: ImageData) -> ImageBox {
    let data = Vec::from(image.bytes.as_ref().to_owned());
    let width = image.width;
    let height = image.height;

    ImageBox {
        width,
        height,
        data,
    }
}

fn get_sha1(vec: Vec<u8>) -> String {
    let mut hasher = Sha1::new();

    hasher.update(vec);

    let result = hasher.finalize();

    let mut hex_string = String::new();
    for byte in result {
        hex_string.push_str(&format!("{:02x}", byte));
    }
    hex_string
}

fn get_image_sha1(image: ImageBox) -> String {
    let max_length = image.width * image.height * 4;
    let slice = if max_length < 200 { max_length } else { 200 };

    let width_bytes = image.width.to_le_bytes();
    let height_bytes = image.height.to_le_bytes();
    let mut target_vec = Vec::new();

    target_vec.extend(width_bytes);
    target_vec.extend(height_bytes);
    target_vec.extend(image.data[..slice].to_vec());

    let sha1 = get_sha1(target_vec);

    sha1
}

fn rgba_to_png(image: &[u8], width: usize, height: usize) -> Vec<u8> {
    let image = ImageBuffer::<Rgba<u8>, _>::from_raw(width as u32, height as u32, image).unwrap();

    let mut png_buffer = std::io::Cursor::new(Vec::new());

    image
        .write_to(&mut png_buffer, ImageOutputFormat::Png)
        .unwrap();

    png_buffer.into_inner()
}

fn png_to_rgba(image: &[u8]) -> ImageData {
    let image = image::load_from_memory(image).unwrap();

    let width = image.width();
    let height = image.height();

    let mut rgba = ImageBuffer::<Rgba<u8>, _>::new(width, height);
    for (x, y, px) in image.pixels() {
        rgba.put_pixel(x, y, px.to_rgba());
    }

    let bytes = Cow::Owned(rgba.into_raw());

    ImageData {
        width: width as usize,
        height: height as usize,
        bytes,
    }
}

#[tauri::command]
fn copy_image(image: Vec<u8>) -> Result<bool, i8> {
    let image_array = image.as_slice();
    let image_data = png_to_rgba(image_array);
    let mut clipboard = Clipboard::new().unwrap();

    match clipboard.set_image(image_data) {
        Ok(()) => Ok(true),
        Err(_) => Err(1),
    }
}

fn listen_clipbaord(app_handle: tauri::AppHandle) {
    let _handle = thread::spawn(move || {
        let mut last_clipboard = "".to_owned();

        loop {
            let clip_text = get_clipboard_text();
            let clip_image = get_clipboard_image();

            match clip_text {
                Some(text) => {
                    if text != last_clipboard {
                        last_clipboard = text.clone();
                        app_handle
                            .emit_all(
                                "clipboard_change",
                                ClipboardPayload {
                                    clipboard: Clip::Text(text),
                                },
                            )
                            .unwrap();
                    }
                }
                None => {}
            };

            match clip_image {
                Some(image) => {
                    let image_box = convert_image(image);

                    // only accept image smaller than 2000 * 1200
                    if image_box.width * image_box.height > 2000 * 1200 {
                        continue;
                    }

                    let image_sha1 = get_image_sha1(image_box.clone());

                    if image_sha1 != last_clipboard {
                        last_clipboard = image_sha1.clone();
                        let image_box = ImageBox {
                            data: rgba_to_png(&image_box.data, image_box.width, image_box.height),
                            ..image_box
                        };
                        app_handle
                            .emit_all(
                                "clipboard_change",
                                ClipboardPayload {
                                    clipboard: Clip::Image(HashImageBox {
                                        hash: image_sha1.clone(),
                                        image_box,
                                    }),
                                },
                            )
                            .unwrap();
                    }
                }
                None => {}
            };

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
        .invoke_handler(tauri::generate_handler![write_file, read_file, copy_image])
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
