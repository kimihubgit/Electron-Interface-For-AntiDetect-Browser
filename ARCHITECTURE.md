# CẤU TRÚC VÀ KIẾN TRÚC DỰ ÁN ANTIDETECT BROWSER

Tài liệu này mô tả chi tiết cách tổ chức mã nguồn, phân chia các tầng trách nhiệm (Separation of Concerns), quy trình giao tiếp giữa các thành phần và hướng dẫn đóng gói ứng dụng.

---

## 1. Sơ đồ Kiến trúc 3 Tầng (3-Tier Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    TẦNG 1: GIAO DIỆN (UI)                   │
│          React 19 + Vite + CSS Variables (Giao diện)        │
└──────────────┬───────────────────────────────┬──────────────┘
               │ (window.electronAPI)          │ (fetch: 127.0.0.1:50325)
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│    TẦNG 2: ELECTRON MAIN     │ │   TẦNG 3: LOCAL DAEMON     │
│   (Quản lý cửa sổ, Dock,    │ │       (LÕI ENGINE RUST)    │
│    IPC, Native Filesystem)   │ │  (CDP Sync, IPv6 Proxy,    │
│                              │ │   Forwarder bảo mật)       │
└──────────────┬───────────────┘ └─────────────┬──────────────┘
               │                               │
               └───────────────┬───────────────┘
                               ▼
        ┌──────────────────────────────────────────────┐
        │       TIẾN TRÌNH CHROMIUM & TRÌNH DUYỆT      │
        │   (Khởi chạy độc lập, tiêm fingerprint,     │
        │    kết nối proxy, nhận lệnh CDP từ Rust)     │
        └──────────────────────────────────────────────┘
```

---

## 2. Tổ chức thư mục chi tiết

```text
AntidetectBrowser/
├── crates/                                 # [MÃ NGUỒN RUST THUẦN TÚY]
│   └── local-daemon/                       # Local Core Daemon Engine (127.0.0.1:50325)
│       ├── Cargo.toml                      # Cấu hình Tokio, Axum, Tungstenite, Reqwest
│       └── src/
│           ├── main.rs                     # Entrypoint & Axum HTTP/WebSocket Server
│           ├── config.rs                   # Đọc cấu hình cổng & URL Cloud Server
│           ├── models/                     # DTO & Cấu trúc dữ liệu chuẩn (Type-Safe)
│           │   ├── types.rs
│           │   └── mod.rs
│           ├── services/                   # Các dịch vụ logic ngầm độc lập:
│           │   ├── browser_manager.rs      # Quản lý tiến trình & cổng CDP Chrome
│           │   ├── sync_engine.rs          # Động cơ đồng bộ chuột/phím Tokio zero-latency
│           │   ├── proxy_service.rs        # Test ping proxy TCP siêu tốc
│           │   ├── ipv6_proxy_server.rs    # Máy chủ phát proxy SOCKS5/HTTP Local & LAN
│           │   └── mod.rs
│           └── routes/                     # Các Endpoint API nội bộ:
│               ├── browser.rs              # /api/v1/browser (launch, stop, active)
│               ├── sync.rs                 # /api/v1/sync (start, stop, status)
│               ├── proxy.rs                # /api/v1/proxy (test)
│               ├── ipv6.rs                 # /api/v1/ipv6 (start, stop, status)
│               ├── cloud.rs                # /api/v1/cloud (Ký số HMAC gửi lên Cloud)
│               └── mod.rs
│
├── electron/                               # [RUNTIME ĐIỀU KHIỂN & ĐÓNG GÓI WINDOWS]
│   ├── bin/                                # Thư mục chứa file binary Rust đã build (.exe)
│   │   └── .gitkeep
│   ├── daemon/
│   │   ├── daemonManager.cjs               # Tự động nạp Rust exe (ưu tiên) hoặc fallback server
│   │   └── localDaemonServer.cjs           # Server Local Daemon tích hợp sẵn
│   ├── ipc/                                # Các bộ xử lý IPC giao tiếp hệ thống
│   │   ├── browserIpc.cjs                  # Khởi chạy/dừng Chromium, User Data Dir
│   │   ├── engineIpc.cjs                   # Quản lý tải nhân Chromium
│   │   ├── extensionIpc.cjs                # Quản lý tiện ích mở rộng Chrome
│   │   ├── proxyIpc.cjs                    # Kiểm tra & quản lý proxy
│   │   ├── systemIpc.cjs                   # Thống kê phần cứng CPU/RAM
│   │   ├── updateIpc.cjs                   # Tự động cập nhật phần mềm
│   │   ├── windowIpc.cjs                   # Thu nhỏ/phóng to/đóng cửa sổ
│   │   └── index.cjs                       # Gom toàn bộ IPC
│   ├── services/
│   │   └── localIpv6ProxyServer.cjs        # Bộ phát proxy HTTP/HTTPS Socket Local & LAN
│   ├── utils/                              # Tiện ích bổ trợ
│   ├── main.cjs                            # Entrypoint chính của Electron
│   ├── miniDock.cjs                        # Thanh điều khiển thu nhỏ nổi trên màn hình
│   ├── preload.cjs                         # Cầu nối an toàn ContextBridge (window.electronAPI)
│   └── window.cjs                          # Khởi tạo cửa sổ chính
│
├── src/                                    # [GIAO DIỆN REACT / VITE]
│   ├── config/
│   │   └── apiConfig.js                    # Cấu hình trỏ về http://127.0.0.1:50325
│   ├── services/
│   │   └── localDaemonApi.js               # REST Client giao tiếp với Local Daemon
│   ├── features/                           # Các module màn hình chức năng:
│   │   ├── profiles/                       # Quản lý hồ sơ trình duyệt
│   │   ├── proxies/                        # Quản lý kho Proxy & Tab Sinh IPv6
│   │   ├── synchronizer/                   # Tab Đồng bộ hóa (Master / Slaves)
│   │   ├── extensions/                     # Quản lý tiện ích
│   │   ├── groups/                         # Quản lý nhóm hồ sơ
│   │   ├── scripts/                        # Kịch bản tự động hóa
│   │   ├── backup/                         # Sao lưu dữ liệu
│   │   └── team/                           # Quản lý thành viên nhóm
│   ├── store/                              # Quản lý State toàn cục (React Context)
│   ├── components/                         # Các UI Components tái sử dụng
│   └── layouts/                            # Khung bố cục điều hướng
│
└── package.json                            # Scripts build & electron-builder packaging
```

---

## 3. Luồng dữ liệu khi thực thi các tác vụ chính

### A. Khởi chạy Profile Chrome:
1. Người dùng bấm **"Mở"** trên giao diện React.
2. React gọi `window.electronAPI.launchBrowser(profile)` (hoặc `POST /api/v1/browser/launch`).
3. Core Engine:
   * Tìm file thực thi Chromium phù hợp.
   * Tạo thư mục User Data riêng biệt cách ly cookie/cache.
   * Cấp cổng Debugging CDP riêng (`--remote-debugging-port=XXXX`).
   * Gán proxy, user-agent, độ phân giải màn hình.
   * Bật trình duyệt và theo dõi trạng thái PID.

### B. Đồng bộ hóa thao tác (Synchronizer):
1. Người dùng vào tab **Đồng bộ**, chọn 1 Profile làm **Master** qua nút 3 chấm.
2. Bấm nút **"Bắt đầu đồng bộ"**.
3. Rust Sync Engine:
   * Kết nối WebSocket vào cổng CDP của Master và các Slaves.
   * Lắng nghe sự kiện chuột (`Input.dispatchMouseEvent`) và bàn phím (`Input.dispatchKeyEvent`).
   * Phát thanh song song (Multi-thread broadcast) tới toàn bộ Slaves với độ trễ < 1ms.

### C. Phát Proxy IPv6 (Local & LAN):
1. Người dùng vào tab **Sinh Proxy IPv6**, chọn `0.0.0.0` (mạng LAN) hoặc `127.0.0.1` (máy này).
2. Bấm **"Bật Máy Chủ Proxy"**.
3. Proxy Server:
   * Mở các cổng TCP (ví dụ `20000 -> 20020`).
   * Lắng nghe kết nối HTTP CONNECT Tunnel.
   * Cho phép máy tính này và các thiết bị khác trong mạng LAN kết nối vào dùng chung.

---

## 4. Hướng dẫn Đóng gói và Mở rộng

* **Chạy môi trường phát triển (Dev Mode)**:
  ```bash
  npm run dev          # Chạy Vite dev server
  npm run app          # Chạy Electron app
  ```

* **Biên dịch Rust Engine (Khi có cài đặt Rust)**:
  ```bash
  npm run build:daemon # Biên dịch mã nguồn Rust sang release binary
  npm run copy:daemon  # Copy file binary vào electron/bin/
  ```

* **Đóng gói ra bộ cài đặt Windows (.exe installer)**:
  ```bash
  npm run build:exe    # Tự động build React bundle và đóng gói qua electron-builder
  ```
  File cài đặt `.exe` hoàn chỉnh sẽ nằm trong thư mục `release/`.
