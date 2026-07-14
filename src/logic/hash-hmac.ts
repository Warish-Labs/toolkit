export interface HmacParams {
  message: string;
  key: string;
  algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
}

export async function generateHmac(params: HmacParams): Promise<string> {
  const { message, key, algo } = params;

  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this environment');
  }

  const enc = new TextEncoder();
  const keyData = enc.encode(key);
  const msgData = enc.encode(message);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algo },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    msgData
  );

  return arrayBufferToHex(signature);
}

export function compareHashes(hashA: string, hashB: string): boolean {
  const cleanA = hashA.trim().toLowerCase();
  const cleanB = hashB.trim().toLowerCase();
  return cleanA === cleanB && cleanA !== '';
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  return Array.from(byteArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}
