// Security & Encryption Logic

// ── Password Strength Checker ────────────────────────────────────────
export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0 = very weak, 4 = very strong
  entropy: number;
  suggestions: string[];
  crackTimeDesc: string;
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const suggestions: string[] = [];
  if (!password) {
    return { score: 0, entropy: 0, suggestions: ['Type a password to evaluate.'], crackTimeDesc: 'instant' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = Math.round(password.length * Math.log2(poolSize || 1));

  // Build suggestions
  if (password.length < 8) suggestions.push('Make it at least 8 characters long.');
  if (!/[A-Z]/.test(password)) suggestions.push('Add uppercase letters.');
  if (!/[a-z]/.test(password)) suggestions.push('Add lowercase letters.');
  if (!/[0-9]/.test(password)) suggestions.push('Add numbers.');
  if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push('Add special characters.');

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (entropy > 35) score = 1;
  if (entropy > 50) score = 2;
  if (entropy > 70) score = 3;
  if (entropy > 80 && password.length >= 10) score = 4;

  let crackTimeDesc = 'instant';
  if (entropy > 25) crackTimeDesc = 'a few seconds';
  if (entropy > 45) crackTimeDesc = 'a few hours';
  if (entropy > 60) crackTimeDesc = 'a few months';
  if (entropy > 75) crackTimeDesc = 'centuries';

  return { score, entropy, suggestions, crackTimeDesc };
}

// ── AES Encryption / Decryption ──────────────────────────────────────
export async function aesEncrypt(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(message)
  );

  // Pack salt + iv + ciphertext together in base64
  const packed = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  packed.set(salt, 0);
  packed.set(iv, salt.length);
  packed.set(new Uint8Array(encrypted), salt.length + iv.length);

  return arrayBufferToBase64(packed.buffer);
}

export async function aesDecrypt(ciphertextB64: string, secret: string): Promise<string> {
  const enc = new TextDecoder();
  const packed = new Uint8Array(base64ToArrayBuffer(ciphertextB64));

  if (packed.length < 28) {
    throw new Error('Invalid ciphertext payload');
  }

  const salt = packed.slice(0, 16);
  const iv = packed.slice(16, 28);
  const encrypted = packed.slice(28);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 1000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );

  return enc.decode(decrypted);
}

// ── RSA Keypair Generator & Demo ──────────────────────────────────────
export interface RsaKeyPair {
  publicKeyPem: string;
  privateKeyPem: string;
}

export async function generateRsaKeyPair(): Promise<RsaKeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedPublic = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const exportedPrivate = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKeyPem: arrayBufferToBase64Pem(exportedPublic, 'PUBLIC KEY'),
    privateKeyPem: arrayBufferToBase64Pem(exportedPrivate, 'PRIVATE KEY')
  };
}

// Helper converters
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64Pem(buffer: ArrayBuffer, type: string): string {
  const b64 = arrayBufferToBase64(buffer);
  const lines = b64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`;
}
