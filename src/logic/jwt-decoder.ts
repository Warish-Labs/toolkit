export interface DecodedJwt {
  header: any;
  payload: any;
  signature: string;
  isExpired: boolean;
  issuedAt?: Date;
  expiresAt?: Date;
}

export function decodeJwt(token: string): DecodedJwt {
  const trimmed = token.trim();
  if (!trimmed) {
    throw new Error('Token is empty');
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format. A JWT must consist of three parts separated by dots.');
  }

  try {
    const headerJson = base64UrlDecode(parts[0]);
    const payloadJson = base64UrlDecode(parts[1]);

    const header = JSON.parse(headerJson);
    const payload = JSON.parse(payloadJson);
    const signature = parts[2];

    let isExpired = false;
    let expiresAt: Date | undefined;
    let issuedAt: Date | undefined;

    if (payload.exp) {
      expiresAt = new Date(payload.exp * 1000);
      isExpired = expiresAt.getTime() < Date.now();
    }

    if (payload.iat) {
      issuedAt = new Date(payload.iat * 1000);
    }

    return {
      header,
      payload,
      signature,
      isExpired,
      issuedAt,
      expiresAt,
    };
  } catch (e) {
    throw new Error('Failed to parse JWT payload or header. Make sure the token is valid.');
  }
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  // Safely decode UTF-8 characters
  return decodeURIComponent(
    Array.prototype.map
      .call(binary, (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}
