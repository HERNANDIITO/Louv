import * as AuthService from './auth.service.js';

const cookieOptions = {
    httpOnly: true, // Solo por HTTPS
    secure: true, // No puede ser leído por JavaScript
    sameSite: 'strict', // Solo se puede enviar en la misma dominio
};

const setAuthCookies = (res, { accessToken, refreshToken, rememberMe }) => {
    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            path: '/api/auth', // Solo puede viajar a partir de una ruta con el prefijo /api/auth.
            maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 7 días si se recuerda, 1 día si no
        });
    }

    if (accessToken) {
        res.cookie('accessToken', accessToken, {
            ...cookieOptions,
            path: '/', // Puede viajar por cualquier ruta
            maxAge: 15 * 60 * 1000, // 15 minutos
        });
    }
};

const clearAuthCookies = (res) => {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/api/auth' });
};

/* -------------------------------------------------------------------------- */
export const getAuthMe = async (req, res) => {
    const user = await AuthService.getAuthMe({
        session: req.session,
    });

    res.json({ result: 'OK', user });
};

export const postAuthRegister = async (req, res) => {
    await AuthService.register({ userData: req.body });
    res.status(200).json({ result: 'OK' });
};

export const postAuthLogin = async (req, res) => {
    const tokens = await AuthService.login({
        email: req.body.email,
        password: req.body.password,
        rememberMe: req.body.rememberMe,
        userAgent: req.headers['user-agent'],
    });

    setAuthCookies(res, tokens);

    res.json({
        result: tokens.accessToken ? 'OK' : 'TOTP_REQUIRED',
    });
};

export const postAuthRefresh = async (req, res) => {
    const tokens = await AuthService.refresh({
        refreshToken: req.cookies.refreshToken,
        userAgent: req.headers['user-agent'],
    });

    setAuthCookies(res, tokens);
    res.sendStatus(204);
};

export const postAuthLogout = async (req, res) => {
    await AuthService.logout({
        refreshToken: req.cookies.refreshToken,
        userAgent: req.headers['user-agent'],
    });

    clearAuthCookies(res);
    res.json({ result: 'OK' });
};

export const postAuthTotpSetup = async (req, res) => {
    const qrCodeDataUrl = await AuthService.setupTotp({ employeeId: req.session._id });
    res.json({ result: 'OK', qrCodeDataUrl });
};

export const postAuthTotpConfirm = async (req, res) => {
    await AuthService.confirmTotp({
        employeeId: req.session._id,
        totpCode: req.body.totpCode,
    });
    res.json({ result: 'OK' });
};

export const postAuthTotpVerify = async (req, res) => {
    const tokens = await AuthService.verifyTotp({
        email: req.body.email,
        totpCode: req.body.totpCode,
        userAgent: req.headers['user-agent'],
    });

    setAuthCookies(res, tokens);
    res.json({ result: 'OK' });
};

export const getAuthGoogle = (req, res) => {
    const authUrl = AuthService.getGoogleAuthUrl({
        requireConsent: Boolean(req.query.consent),
    });

    res.redirect(authUrl);
};

export const getAuthGoogleCallback = async (req, res) => {
    const tokens = await AuthService.handleGoogleCallback({
        code: req.query.code,
        error: req.query.error,
        session: req.session,
        userAgent: req.headers['user-agent'],
    });

    setAuthCookies(res, tokens);
    res.redirect(`${process.env.CLIENT_BASE_URI}`);
};

export const postCheckUserEmail = async (req, res) => {
    const { exists } = await AuthService.checkEmail({
        email: req.body.email,
    });

    res.json({ result: 'OK', exists });
};

export const updatePasswordById = async (req, res) => {
    await AuthService.updatePasswordById({
        id: req.session._id,
        updateData: req.body,
    });
    res.status(204).end();
};
