import crypto from 'crypto';
import bs58 from 'bs58';

export const generatePlaintextKey = (): string => {
  const random = crypto.randomBytes(32);
  return `qpk_${bs58.encode(random)}`;
};

export const hashKey = (plaintext: string): string => crypto.createHash('sha256').update(plaintext).digest('hex');

export const extractPrefix = (plaintext: string): string => plaintext.slice(0, 8);

export const verifyKey = (plaintext: string, hashHex: string): boolean => {
  const computedHex = hashKey(plaintext);

  const a = Buffer.from(computedHex, 'hex');
  const b = Buffer.from(hashHex, 'hex');
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
};
