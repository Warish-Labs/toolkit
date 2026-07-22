export interface JwtRsaKeyPair {
  publicKeyPem: string;
  privateKeyPem: string;
}

export function base64UrlEncode(str: string): string {
  // Safe Base64URL encoding supporting Unicode characters
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export function base64UrlEncodeBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function pemToBinary(pem: string): ArrayBuffer {
  const cleanPem = pem
    .replace(/-----BEGIN[^-]+-----/, '')
    .replace(/-----END[^-]+-----/, '')
    .replace(/\s/g, '');
  const binary = atob(cleanPem);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function arrayBufferToBase64Pem(buffer: ArrayBuffer, type: string): string {
  const b64 = arrayBufferToBase64(buffer);
  const lines = b64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${type}-----\n${lines.join('\n')}\n-----END ${type}-----`;
}

export async function generateJwt(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  secretOrPrivateKey: string
): Promise<string> {
  const alg = header.alg || 'HS256';
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  if (alg === 'none') {
    return `${signatureInput}.`;
  }

  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this environment.');
  }

  const enc = new TextEncoder();
  const msgData = enc.encode(signatureInput);

  if (typeof alg === 'string' && alg.startsWith('HS')) {
    const hashAlg = {
      HS256: 'SHA-256',
      HS384: 'SHA-384',
      HS512: 'SHA-512',
    }[alg as 'HS256' | 'HS384' | 'HS512'];

    if (!hashAlg) {
      throw new Error(`Unsupported HMAC algorithm: ${alg}`);
    }

    if (!secretOrPrivateKey) {
      throw new Error('A signing secret is required for HMAC algorithms.');
    }

    const keyData = enc.encode(secretOrPrivateKey);
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: hashAlg },
      false,
      ['sign']
    );

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const encodedSignature = base64UrlEncodeBuffer(signature);
    return `${signatureInput}.${encodedSignature}`;
  }

  if (alg === 'RS256') {
    if (!secretOrPrivateKey) {
      throw new Error('An RSA Private Key (PEM format) is required for RS256 signing.');
    }

    try {
      const der = pemToBinary(secretOrPrivateKey);
      const cryptoKey = await window.crypto.subtle.importKey(
        'pkcs8',
        der,
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256',
        },
        false,
        ['sign']
      );

      const signature = await window.crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, msgData);
      const encodedSignature = base64UrlEncodeBuffer(signature);
      return `${signatureInput}.${encodedSignature}`;
    } catch {
      throw new Error(
        'Failed to sign with RSA Private Key. Make sure it is a valid, unencrypted PKCS#8 private key in PEM format.'
      );
    }
  }

  throw new Error(`Unsupported algorithm: ${alg}`);
}

export async function generateJwtRsaKeyPair(): Promise<JwtRsaKeyPair> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this environment.');
  }

  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['sign', 'verify']
  );

  const exportedPublic = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const exportedPrivate = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKeyPem: arrayBufferToBase64Pem(exportedPublic, 'PUBLIC KEY'),
    privateKeyPem: arrayBufferToBase64Pem(exportedPrivate, 'PRIVATE KEY'),
  };
}
