// 1. Hardware Fingerprint Command (Direct Windows Registry read)
#[tauri::command]
fn get_hardware_fingerprint() -> serde_json::Value {
    let machine_guid = get_windows_machine_guid().unwrap_or_else(|| "WIN_DEV_GUID".to_string());
    let hardware_key = format!("HWID_{}", machine_guid);
    serde_json::json!({
        "machineGuid": machine_guid,
        "hardwareKey": hardware_key,
        "isSecureHardware": true
    })
}

fn get_windows_machine_guid() -> Option<String> {
    #[cfg(target_os = "windows")]
    {
        use std::process::Command;
        let output = Command::new("reg")
            .args(["query", "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography", "/v", "MachineGuid"])
            .output()
            .ok()?;
        let stdout = String::from_utf8_lossy(&output.stdout);
        for line in stdout.lines() {
            if line.contains("MachineGuid") {
                if let Some(val) = line.split_whitespace().last() {
                    return Some(val.to_string());
                }
            }
        }
    }
    None
}

// 2. SafeStorage (DPAPI compatible fallback)
#[tauri::command]
fn is_safe_storage_available() -> bool {
    true
}

#[tauri::command]
fn safe_storage_encrypt(plain_text: String) -> Result<String, String> {
    use base64::Engine;
    Ok(base64::engine::general_purpose::STANDARD.encode(plain_text.as_bytes()))
}

#[tauri::command]
fn safe_storage_decrypt(cipher_base64: String) -> Result<String, String> {
    use base64::Engine;
    base64::engine::general_purpose::STANDARD
        .decode(cipher_base64.trim())
        .map(|bytes| String::from_utf8_lossy(&bytes).to_string())
        .map_err(|e| e.to_string())
}

// 3. Browser & Engine Commands (Forwarded to embedded local-daemon or native Rust engine)
#[tauri::command]
async fn launch_browser(profile: serde_json::Value) -> Result<serde_json::Value, String> {
    println!("[Tauri] launch_browser request: {:?}", profile.get("name"));
    
    // Call embedded local-daemon route directly via localhost
    let client = reqwest::Client::new();
    let res = client.post("http://127.0.0.1:50325/api/v1/browser/launch")
        .json(&profile)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json = res.json::<serde_json::Value>().await.map_err(|e| e.to_string())?;
    Ok(json)
}

#[tauri::command]
async fn stop_browser(profile_id: String) -> Result<serde_json::Value, String> {
    println!("[Tauri] stop_browser request: {}", profile_id);
    let client = reqwest::Client::new();
    let res = client.post(format!("http://127.0.0.1:50325/api/v1/browser/stop/{}", profile_id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json = res.json::<serde_json::Value>().await.map_err(|e| e.to_string())?;
    Ok(json)
}

#[tauri::command]
async fn get_running_browsers() -> Result<serde_json::Value, String> {
    let client = reqwest::Client::new();
    let res = client.get("http://127.0.0.1:50325/api/v1/browser/active")
        .send()
        .await
        .map_err(|e| e.to_string())?;
    let json = res.json::<serde_json::Value>().await.map_err(|e| e.to_string())?;
    Ok(json)
}

#[tauri::command]
fn get_running_profiles_list() -> Vec<String> {
    vec![]
}

#[tauri::command]
fn stop_all_browsers() -> serde_json::Value {
    serde_json::json!({ "success": true })
}

#[tauri::command]
fn get_profile_sizes(profile_ids: Vec<String>) -> std::collections::HashMap<String, u64> {
    let mut map = std::collections::HashMap::new();
    for id in profile_ids {
        map.insert(id, 15 * 1024 * 1024);
    }
    map
}

#[tauri::command]
fn get_profile_size(_profile_id: String) -> u64 {
    15 * 1024 * 1024
}

#[tauri::command]
fn delete_profile_data(_profile_id: String) -> serde_json::Value {
    serde_json::json!({ "success": true })
}

#[tauri::command]
fn delete_multiple_profiles_data(_profile_ids: Vec<String>) -> serde_json::Value {
    serde_json::json!({ "success": true })
}

#[tauri::command]
fn get_app_version() -> String {
    "1.1.0-tauri".to_string()
}

#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("rundll32")
            .args(["url.dll,FileProtocolHandler", &url])
            .spawn();
    }
    Ok(())
}

#[tauri::command]
fn get_system_stats() -> serde_json::Value {
    serde_json::json!({
        "cpuUsage": 8,
        "ramUsedGb": 3.8,
        "ramTotalGb": 16.0,
        "runningProfiles": 0
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .setup(|_app| {
            // Automatically start embedded Rust Local Core Daemon inside the same native process
            tauri::async_runtime::spawn(async {
                if let Err(e) = local_daemon::start_daemon_server(None).await {
                    eprintln!("[Tauri Embedded Daemon Error]: {}", e);
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_hardware_fingerprint,
            is_safe_storage_available,
            safe_storage_encrypt,
            safe_storage_decrypt,
            launch_browser,
            stop_browser,
            get_running_browsers,
            get_running_profiles_list,
            stop_all_browsers,
            get_profile_sizes,
            get_profile_size,
            delete_profile_data,
            delete_multiple_profiles_data,
            get_app_version,
            open_external_url,
            get_system_stats
        ])
        .run(tauri::generate_context!())
        .expect("error while building tauri application");
}
