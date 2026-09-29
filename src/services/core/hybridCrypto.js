/**
 * Application-Layer Hybrid Crypto Engine
 * Client-side implementation for Go Backend's Crypto Middleware:
 * - Asymmetric Key Exchange: RSA-OAEP with SHA-256
 * - Symmetric Encryption: AES-256-GCM (12-byte IV / Nonce, 16-byte Auth Tag)
 * - Anti-Replay Protection: Epoch timestamp (_ts)
 */

import { ENABLE_API_ENCRYPTION, DEFAULT_SERVER_PUBLIC_KEY } from '../../config/apiConfig';
import { getDeobfuscatedCryptoKey } from '../../utils/keyVault';

let cachedRsaPublicKey = null;
let cachedRawPublicKeyPem = DEFAULT_SERVER_PUBLIC_KEY || '';

/**
 * Convert Base64 string to Uint8Array buffer
 */
export function base64ToUint8Array(base64) {
  const binaryString = atob(base64.replace(/\s+/g, ''));
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert ArrayBuffer or Uint8Array to Base64 string
 */
export function bufferToBase64(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Import PEM formatted RSA Public Key into WebCrypto CryptoKey
 */
export async function importRsaPublicKey(pem) {
  if (!pem || typeof pem !== 'string') return null;
  try {
    const cleanPem = pem
      .replace(/-----BEGIN[^-]+-----/g, '')
      .replace(/-----END[^-]+-----/g, '')
      .replace(/\s+/g, '');
    
    const derBytes = base64ToUint8Array(cleanPem);
    const cryptoSubtle = (typeof window !== 'undefined' ? window.crypto : globalThis.crypto)?.subtle;
    if (!cryptoSubtle) return null;

    return await cryptoSubtle.importKey(
      'spki',
      derBytes,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      false,
      ['encrypt']
    );
  } catch (err) {
    console.warn('[HybridCrypto] Failed to import RSA Public Key:', err.message);
    return null;
  }
}

/**
 * Set and cache Server Public Key
 */
export async function setServerPublicKey(pem) {
  if (!pem) return;
  cachedRawPublicKeyPem = pem;
  cachedRsaPublicKey = await importRsaPublicKey(pem);
}

/**
 * Get or fetch Server Public Key from server if missing
 */
export async function getOrFetchServerPublicKey(serverUrl) {
  if (cachedRsaPublicKey) {
    return cachedRsaPublicKey;
  }

  // 1. Check if we have an explicit override in environment variable
  if (cachedRawPublicKeyPem) {
    cachedRsaPublicKey = await importRsaPublicKey(cachedRawPublicKeyPem);
    if (cachedRsaPublicKey) return cachedRsaPublicKey;
  }

  // 2. Load from In-Memory Obfuscated KeyVault (Zero-String Protection)
  try {
    const vaultKey = await getDeobfuscatedCryptoKey();
    if (vaultKey) {
      cachedRsaPublicKey = vaultKey;
      return cachedRsaPublicKey;
    }
  } catch (err) {
    console.warn('[HybridCrypto] KeyVault load skipped:', err?.message);
  }

  // 3. Fallback: fetch from server endpoint: GET /api/v1/auth/public-key
  try {
    const url = serverUrl
      ? `${serverUrl.replace(/\/$/, '')}/api/v1/auth/public-key`
      : '/api/v1/auth/public-key';
    const res = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      const json = await res.json();
      const pem = json?.data?.public_key || json?.public_key || json?.data;
      if (typeof pem === 'string' && pem.includes('PUBLIC KEY')) {
        await setServerPublicKey(pem);
        return cachedRsaPublicKey;
      }
    }
  } catch (err) {
    console.warn('[HybridCrypto] Could not fetch public key from server:', err.message);
  }

  return null;
}

/**
 * Encrypt request payload:
 * 1. Generates ephemeral 256-bit AES key.
 * 2. Encrypts JSON data using AES-256-GCM with 12-byte IV.
 * 3. Encrypts AES key using Server's RSA-OAEP SHA-256 Public Key.
 * 4. Injects anti-replay timestamp _ts.
 *
 * Returns: { encryptedPayload, sessionAesKey } or null if crypto unavailable
 */
export async function encryptRequestPayload(data, serverUrl) {
  if (!ENABLE_API_ENCRYPTION) return null;

  const cryptoObj = (typeof window !== 'undefined' ? window.crypto : globalThis.crypto);
  const cryptoSubtle = cryptoObj?.subtle;
  if (!cryptoSubtle) return null;

  const serverPubKey = await getOrFetchServerPublicKey(serverUrl);
  if (!serverPubKey) {
    // Cannot encrypt without server's public key; return null for fallback
    return null;
  }

  try {
    // 1. Generate random 256-bit AES-GCM Key
    const sessionAesKey = await cryptoSubtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true, // extractable so we can export & wrap with RSA
      ['encrypt', 'decrypt']
    );

    // 2. Export raw 32-byte AES key
    const rawAesKeyBuffer = await cryptoSubtle.exportKey('raw', sessionAesKey);

    // 3. Encrypt raw AES key using Server RSA-OAEP
    const encryptedKeyBuffer = await cryptoSubtle.encrypt(
      { name: 'RSA-OAEP' },
      serverPubKey,
      rawAesKeyBuffer
    );

    // 4. Generate 12-byte (96-bit) IV / Nonce
    const iv = cryptoObj.getRandomValues(new Uint8Array(12));

    // 5. Serialize plaintext with anti-replay timestamp
    const now = Date.now();
    const payloadToEncrypt = (typeof data === 'object' && data !== null)
      ? { ...data, _ts: now }
      : { value: data, _ts: now };
    const encodedPlaintext = new TextEncoder().encode(JSON.stringify(payloadToEncrypt));

    // 6. Encrypt plaintext via AES-256-GCM (128-bit / 16-byte tag)
    const encryptedCipher = await cryptoSubtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      sessionAesKey,
      encodedPlaintext
    );

    const cipherBytes = new Uint8Array(encryptedCipher);
    const ciphertextBytes = cipherBytes.slice(0, cipherBytes.length - 16);
    const tagBytes = cipherBytes.slice(cipherBytes.length - 16);

    const encryptedPayload = {
      enc_key: bufferToBase64(encryptedKeyBuffer),
      iv: bufferToBase64(iv),
      ciphertext: bufferToBase64(ciphertextBytes),
      tag: bufferToBase64(tagBytes),
      _ts: now
    };

    return {
      encryptedPayload,
      sessionAesKey
    };
  } catch (err) {
    console.error('[HybridCrypto] Encryption failed:', err);
    return null;
  }
}

/**
 * Decrypt server response payload using the session's AES key
 */
export async function decryptResponsePayload(responseObj, sessionAesKey) {
  if (!responseObj || !sessionAesKey) return responseObj;

  const { iv, ciphertext, tag } = responseObj;
  if (!iv || !ciphertext) {
    // Not an encrypted response payload
    return responseObj;
  }

  const cryptoSubtle = (typeof window !== 'undefined' ? window.crypto : globalThis.crypto)?.subtle;
  if (!cryptoSubtle) return responseObj;

  try {
    const ivBytes = base64ToUint8Array(iv);
    const ciphertextBytes = base64ToUint8Array(ciphertext);
    const tagBytes = tag ? base64ToUint8Array(tag) : null;

    // In WebCrypto subtle.decrypt, ciphertext and tag must be concatenated
    let combinedCiphertext;
    if (tagBytes && tagBytes.length > 0) {
      combinedCiphertext = new Uint8Array(ciphertextBytes.length + tagBytes.length);
      combinedCiphertext.set(ciphertextBytes, 0);
      combinedCiphertext.set(tagBytes, ciphertextBytes.length);
    } else {
      combinedCiphertext = ciphertextBytes;
    }

    const decryptedBuffer = await cryptoSubtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes, tagLength: 128 },
      sessionAesKey,
      combinedCiphertext
    );

    const decryptedText = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedText);
  } catch (err) {
    console.error('[HybridCrypto] Response decryption failed:', err);
    throw new Error('Không thể giải mã dữ liệu an toàn từ máy chủ (Decryption Error)');
  }
}
