// lib/crypto.js

const ENCRYPT_KEY = "TEFLU0hJVF9BUEVYX1NfQ09SRV8yMDI2";

export async function signResponseDynamic(text) {
  const timestamp = Date.now().toString();
  const secret = atob(ENCRYPT_KEY) + timestamp;
  
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const hexSig = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `v7.${timestamp}.${hexSig}`;
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateTraceId = () => {
  return 'req_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};
  
