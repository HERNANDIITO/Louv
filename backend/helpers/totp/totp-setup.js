import { authenticator } from 'otplib';
import QRCode from 'qrcode';

authenticator.options = {
    step: 30,
    window: 1,
};

export const generateTotpSetup = async (email) => {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, 'Louv', secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

    return { secret, qrCodeDataUrl };
};

export const verifyTotpCode = (token, secret) => {
    return authenticator.check(token, secret);
};
