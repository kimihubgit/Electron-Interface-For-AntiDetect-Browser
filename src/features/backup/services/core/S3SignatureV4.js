/**
 * S3SignatureV4 - AWS Signature Version 4 implementation using Web Crypto API.
 * Compatible with AWS S3, Cloudflare R2, BizflyCloud, Cloudfly, DigitalOcean Spaces, Wasabi, and MinIO.
 */

// Helper to convert ArrayBuffer to hex string
function toHex(buffer) {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// SHA-256 hash of a string or buffer -> hex string
async function sha256Hex(data) {
  const enc = new TextEncoder();
  const buffer = typeof data === 'string' ? enc.encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return toHex(hashBuffer);
}

// HMAC-SHA256
async function hmacSha256(keyBuffer, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const dataBuffer = typeof data === 'string' ? enc.encode(data) : data;
  return await crypto.subtle.sign('HMAC', key, dataBuffer);
}

/**
 * Generate AWS Signature Version 4 headers for S3 requests
 */
export async function signS3Request({
  method = 'GET',
  url,
  region = 'us-east-1',
  service = 's3',
  accessKeyId,
  secretAccessKey,
  headers = {},
  payload = ''
}) {
  const urlObj = new URL(url);
  const now = new Date();
  
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  const payloadHash = await sha256Hex(payload);

  const signedHeadersMap = {
    host: urlObj.host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': payloadHash,
    ...headers
  };

  // Canonical headers
  const sortedHeaderKeys = Object.keys(signedHeadersMap)
    .map(k => k.toLowerCase())
    .sort();

  let canonicalHeaders = '';
  for (const k of sortedHeaderKeys) {
    canonicalHeaders += `${k}:${signedHeadersMap[k].trim()}\n`;
  }
  const signedHeadersStr = sortedHeaderKeys.join(';');

  // Canonical query string
  const canonicalQuery = Array.from(urlObj.searchParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  // Canonical request
  const canonicalRequest = [
    method.toUpperCase(),
    urlObj.pathname || '/',
    canonicalQuery,
    canonicalHeaders,
    signedHeadersStr,
    payloadHash
  ].join('\n');

  const canonicalRequestHash = await sha256Hex(canonicalRequest);

  // String to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    canonicalRequestHash
  ].join('\n');

  // Derive signing key
  const enc = new TextEncoder();
  const kSecret = enc.encode('AWS4' + secretAccessKey);
  const kDate = await hmacSha256(kSecret, dateStamp);
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  const kSigning = await hmacSha256(kService, 'aws4_request');

  // Compute signature
  const signatureBuffer = await hmacSha256(kSigning, stringToSign);
  const signature = toHex(signatureBuffer);

  // Final authorization header
  const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeadersStr}, Signature=${signature}`;

  return {
    ...signedHeadersMap,
    Authorization: authHeader
  };
}
