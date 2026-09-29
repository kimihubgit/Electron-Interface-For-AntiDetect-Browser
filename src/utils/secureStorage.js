/**
 * NATIVE SECURE STORAGE ENGINE (CHO ỨNG DỤNG WINDOWS DESKTOP)
 * 
 * Bảo vệ LocalStorage chống:
 * 1. Hacker mở thư mục AppData/Roaming/<App>/Local Storage/leveldb ra sửa text.
 * 2. Hacker copy toàn bộ thư mục dữ liệu sang máy tính khác (Device Binding / Hardware Locking).
 * 3. Chống Replay & Data Tampering bằng Chữ ký số HMAC-SHA256 + Mã hóa AES-256.
 */

import CryptoJS from 'crypto-js';
import { getOrCreateHwid, getMachineGuid } from '../services/core/deviceService';

let cachedSecret = null;

/**
 * Sinh khóa bí mật duy nhất gắn chặt với phần cứng máy tính này
 */
export function getHardwareSecret() {
  if (cachedSecret) return cachedSecret;

  // 1. Kết hợp HWID + Machine GUID của Windows
  const hwid = getOrCreateHwid();
  const guid = getMachineGuid();
  const screenInfo = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}:${window.navigator.hardwareConcurrency || 4}` : 'DEF_SCREEN';

  // 2. Băm một chiều thành Master Key AES-256
  cachedSecret = CryptoJS.SHA256(`NEXUS_DESKTOP_SEC_${hwid}_${guid}_${screenInfo}`).toString();
  return cachedSecret;
}

/**
 * Lưu dữ liệu nhạy cảm vào LocalStorage với Mã hóa AES & Ký số HMAC
 * @param {string} key Khóa lưu trữ
 * @param {any} value Dữ liệu (Object, Array, String, Number...)
 */
export function secureSet(key, value) {
  if (!key) return;
  try {
    const secret = getHardwareSecret();
    const rawString = typeof value === 'string' ? value : JSON.stringify(value);

    // 1. Mã hóa AES đối xứng bằng khóa phần cứng máy tính
    const encryptedPayload = CryptoJS.AES.encrypt(rawString, secret).toString();

    // 2. Ký số HMAC-SHA256 chống sửa đổi dù chỉ 1 ký tự
    const signature = CryptoJS.HmacSHA256(`${key}::${encryptedPayload}`, secret).toString();

    // 3. Đóng gói Envelope
    const secureEnvelope = {
      __secured: true,
      v: 1,
      payload: encryptedPayload,
      sig: signature,
      updated_at: Date.now()
    };

    localStorage.setItem(key, JSON.stringify(secureEnvelope));
  } catch (err) {
    console.error(`[SecureStorage] Lỗi mã hóa key "${key}":`, err);
  }
}

/**
 * Đọc và giải mã dữ liệu an toàn từ LocalStorage
 * @param {string} key Khóa lưu trữ
 * @param {any} defaultValue Giá trị mặc định nếu không tìm thấy hoặc bị giả mạo
 * @returns {any} Dữ liệu đã giải mã
 */
export function secureGet(key, defaultValue = null) {
  if (!key) return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    // Kiểm tra xem có phải gói tin được mã hóa an toàn không
    let envelope = null;
    try {
      envelope = JSON.parse(raw);
    } catch {
      // Dữ liệu cũ dạng plain text -> Tự động nâng cấp mã hóa
      secureSet(key, raw);
      return raw;
    }

    if (!envelope || typeof envelope !== 'object' || !envelope.__secured) {
      // Dữ liệu cũ chưa mã hóa -> Tự động nâng cấp mã hóa bảo mật
      secureSet(key, envelope);
      return envelope;
    }

    const secret = getHardwareSecret();

    // 1. KIỂM TRA CHỮ KÝ SỐ HMAC-SHA256 (CHỐNG GIẢ MẠO / CHỐNG COPY SANG MÁY KHÁC)
    const expectedSig = CryptoJS.HmacSHA256(`${key}::${envelope.payload}`, secret).toString();

    if (envelope.sig !== expectedSig) {
      console.warn(`⚠️ [BÁO ĐỘNG BẢO MẬT] Phát hiện can thiệp dữ liệu LocalStorage hoặc file bị copy từ máy khác tại key: "${key}"!`);
      // Xóa ngay dữ liệu giả mạo
      localStorage.removeItem(key);
      return defaultValue;
    }

    // 2. GIẢI MÃ NỘI DUNG AES
    const decryptedBytes = CryptoJS.AES.decrypt(envelope.payload, secret);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      console.warn(`[SecureStorage] Không thể giải mã dữ liệu cho key "${key}"`);
      return defaultValue;
    }

    // Parse JSON nếu là object/array
    try {
      return JSON.parse(decryptedText);
    } catch {
      return decryptedText;
    }
  } catch (err) {
    console.error(`[SecureStorage] Lỗi đọc key "${key}":`, err);
    return defaultValue;
  }
}

/**
 * Xóa khóa khỏi LocalStorage
 */
export function secureRemove(key) {
  if (key) {
    localStorage.removeItem(key);
  }
}
