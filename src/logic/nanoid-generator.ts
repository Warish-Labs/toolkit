export interface IdGenerationParams {
  type: 'uuid' | 'nanoid' | 'snowflake';
  count: number;
  nanoAlphabet?: string;
  nanoSize?: number;
}

export function generateIds(params: IdGenerationParams): string[] {
  const { type, count, nanoAlphabet = 'use-lowercase-uppercase-numbers-underscore-dash', nanoSize = 21 } = params;
  const ids: string[] = [];

  for (let i = 0; i < count; i++) {
    if (type === 'uuid') {
      ids.push(generateUuidV4());
    } else if (type === 'nanoid') {
      ids.push(generateNanoId(nanoAlphabet, nanoSize));
    } else if (type === 'snowflake') {
      ids.push(generateSnowflake());
    }
  }

  return ids;
}

function generateUuidV4(): string {
  // RFC4122 version 4 compliant UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateNanoId(alphabet: string, size: number): string {
  const chars = alphabet || 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
  let id = '';
  for (let i = 0; i < size; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

function generateSnowflake(): string {
  // Simple JavaScript mock of Snowflake ID: (timestamp - custom epoch) << 22 | worker << 17 | process << 12 | sequence
  const customEpoch = 1420070400000; // 2015-01-01
  const timestamp = Date.now() - customEpoch;
  const workerId = 1;
  const processId = 1;
  const sequence = Math.floor(Math.random() * 4096);
  
  // Calculate using BigInt to prevent bitwise limit overflow in JS
  const snowflakeBigInt = (BigInt(timestamp) << BigInt(22)) |
                           (BigInt(workerId) << BigInt(17)) |
                           (BigInt(processId) << BigInt(12)) |
                           BigInt(sequence);
  return snowflakeBigInt.toString();
}
