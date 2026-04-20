// lib/crypto.js

const ENCRYPT_KEY = "VDEzX1RVUkJPX0xBS1NISVRfQ09SRQ==";

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateTraceId = () => {
  return 'req_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

export async function signResponseDynamic(text) {
  const ts = Date.now().toString();
  const secret = atob(ENCRYPT_KEY) + ts;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return `v13.TURBO.${ts}.${signatureArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
}
