export type TokenFormat = 'hex' | 'base64' | 'base64url' | 'alphanumeric' | 'alphanumeric_symbols';

export interface TokenOptions {
  size: number;
  sizeType: 'bytes' | 'chars';
  format: TokenFormat;
}

export interface EnvPreset {
  name: string;
  envVar: string;
  description: string;
  defaultSize: number;
  defaultSizeType: 'bytes' | 'chars';
  defaultFormat: TokenFormat;
}

export const ENV_PRESETS: EnvPreset[] = [
  {
    name: 'JWT Secret Key',
    envVar: 'JWT_SECRET',
    description: 'Used to sign and verify JSON Web Tokens securely. Recommended 32 bytes (256-bit) or 64 bytes (512-bit) in Hex/Base64.',
    defaultSize: 32,
    defaultSizeType: 'bytes',
    defaultFormat: 'base64url',
  },
  {
    name: 'NextAuth Secret',
    envVar: 'NEXTAUTH_SECRET',
    description: 'Used by NextAuth.js (Auth.js) to encrypt session cookies and tokens. Recommended 32 bytes in Base64/Base64URL.',
    defaultSize: 32,
    defaultSizeType: 'bytes',
    defaultFormat: 'base64url',
  },
  {
    name: 'Laravel App Key',
    envVar: 'APP_KEY',
    description: 'Used by Laravel to encrypt user sessions and other encrypted data. Must be exactly 32 bytes in Base64 (base64:...) format.',
    defaultSize: 32,
    defaultSizeType: 'bytes',
    defaultFormat: 'base64',
  },
  {
    name: 'Django Secret Key',
    envVar: 'SECRET_KEY',
    description: 'Used for Django cryptographic signing (sessions, CSRF tokens). Recommended 50 characters with alphanumeric and symbols.',
    defaultSize: 50,
    defaultSizeType: 'chars',
    defaultFormat: 'alphanumeric_symbols',
  },
  {
    name: 'Rails Secret Key Base',
    envVar: 'SECRET_KEY_BASE',
    description: 'Used to encrypt and sign cookie-based sessions in Ruby on Rails. Must be a 64-byte Hex key.',
    defaultSize: 64,
    defaultSizeType: 'bytes',
    defaultFormat: 'hex',
  },
  {
    name: 'Generic API Key',
    envVar: 'API_KEY',
    description: 'A standard API authentication token. Usually Alphanumeric or Hex of 32 or 40 characters.',
    defaultSize: 40,
    defaultSizeType: 'chars',
    defaultFormat: 'alphanumeric',
  },
];

export function generateRandomToken(options: TokenOptions): string {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) {
    throw new Error('Web Crypto API is not supported in this environment.');
  }

  const { size, sizeType, format } = options;

  if (size <= 0) return '';

  if (sizeType === 'bytes') {
    const bytes = new Uint8Array(size);
    window.crypto.getRandomValues(bytes);

    if (format === 'hex') {
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } else if (format === 'base64') {
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    } else if (format === 'base64url') {
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    } else {
      // Fallback to generating characters for formats not naturally byte-based
      return generateChars(size, format);
    }
  } else {
    // sizeType === 'chars'
    return generateChars(size, format);
  }
}

function generateChars(length: number, format: TokenFormat): string {
  const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = '';
  if (format === 'hex') {
    charset = '0123456789abcdef';
  } else if (format === 'base64' || format === 'base64url') {
    charset = alpha + digits + '-_';
  } else if (format === 'alphanumeric') {
    charset = alpha + digits;
  } else {
    charset = alpha + digits + symbols;
  }

  const bytes = new Uint32Array(length);
  window.crypto.getRandomValues(bytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}

export function calculateTokenEntropy(token: string, options: TokenOptions): number {
  if (
    options.sizeType === 'bytes' &&
    (options.format === 'hex' || options.format === 'base64' || options.format === 'base64url')
  ) {
    return options.size * 8;
  }

  const len = token.length;
  if (len === 0) return 0;

  let poolSize = 62;
  if (options.format === 'hex') poolSize = 16;
  else if (options.format === 'base64' || options.format === 'base64url') poolSize = 64;
  else if (options.format === 'alphanumeric') poolSize = 62;
  else if (options.format === 'alphanumeric_symbols') poolSize = 88;

  return Math.round(len * Math.log2(poolSize));
}
