import crypto from 'crypto';
import 'dotenv/config';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.TOTP_SECRET_KEY, 'hex');

export function encrypt(text) {
    const iv = crypto.randomBytes(12); // GCM usa 12 bytes
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    const authTag = cipher.getAuthTag();

    return [iv.toString('hex'), encrypted.toString('hex'), authTag.toString('hex')].join(':');
}

export function decrypt(payload) {
    const [ivHex, encryptedHex, authTagHex] = payload.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString('utf8');
}
