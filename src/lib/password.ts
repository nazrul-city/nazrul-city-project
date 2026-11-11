import 'server-only';

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';

const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;

/**
 * Stored as scrypt$16384$8$1$<salt>$<hash>.
 * Salt and hash are base64url so the value never contains an extra `$`.
 */
const STORED_PREFIX = `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$`;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      KEY_LENGTH,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (error, derived) => {
        if (error) {
          reject(error);
          return;
        }

        if (!Buffer.isBuffer(derived)) {
          reject(new Error('Password hash failed.'));
          return;
        }

        resolve(derived);
      }
    );
  });
}

export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(STORED_PREFIX);
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    throw new Error('Password must be 8 to 72 characters.');
  }

  const salt = randomBytes(SALT_LENGTH);
  const derived = await deriveKey(password, salt);

  return `${STORED_PREFIX}${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

/**
 * Returns false when the stored value is not a scrypt hash, or the password does not match.
 * Comparison uses timingSafeEqual so the check does not stop at the first different byte.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!isHashedPassword(stored)) {
    await deriveKey(password, Buffer.alloc(SALT_LENGTH, 1));
    return false;
  }

  const parts = stored.split('$');
  const saltPart = parts[4];
  const hashPart = parts[5];

  if (parts.length !== 6 || !saltPart || !hashPart) {
    await deriveKey(password, Buffer.alloc(SALT_LENGTH, 1));
    return false;
  }

  const salt = Buffer.from(saltPart, 'base64url');
  const expected = Buffer.from(hashPart, 'base64url');

  if (salt.length !== SALT_LENGTH || expected.length !== KEY_LENGTH) {
    await deriveKey(password, Buffer.alloc(SALT_LENGTH, 1));
    return false;
  }

  const actual = await deriveKey(password, salt);

  return timingSafeEqual(actual, expected);
}
