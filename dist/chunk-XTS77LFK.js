// src/crypto/_crypto.ts
async function digestHex(input, algorithm) {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function hmacSha256Hex(key, message) {
  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const msgData = enc.encode(message);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function nonCryptographicHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = hash * 31 + input.charCodeAt(i) | 0;
  }
  return (hash >>> 0).toString(16);
}
async function sha256(input, nonCryptographicFallback = true) {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    if (!nonCryptographicFallback) throw "crypto not found in this contex";
    console.warn(
      `[crypto not found] using unsafe non-cryptographic fallback, useful only as weak "checksum"`
    );
    return nonCryptographicHash(input);
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
function encodeBase64(input) {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunkSize = 32768;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}
function decodeBase64(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
function generateRandomInitializationVector() {
  return crypto.getRandomValues(new Uint8Array(12));
}
async function aesGcmEncrypt(plaintext, key, iv) {
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return new Uint8Array(ciphertext);
}
async function aesGcmDecrypt(ciphertext, key, iv) {
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}
var cryptoTools = {
  digest: {
    digestHex,
    sha256,
    hmacSha256Hex,
    nonCryptographicHash
  },
  base64: {
    encode: encodeBase64,
    decode: decodeBase64
  },
  AES: {
    encode: aesGcmEncrypt,
    decode: aesGcmDecrypt,
    randomInitializationVector: generateRandomInitializationVector
  }
};

export {
  nonCryptographicHash,
  sha256,
  cryptoTools
};
//# sourceMappingURL=chunk-XTS77LFK.js.map