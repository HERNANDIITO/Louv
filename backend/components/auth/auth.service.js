import createError from 'http-errors';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { google } from 'googleapis';

import * as AuthRepository from './auth.repository.js';
import * as UserService from '../users/users.service.js';
import * as MeService from "../users/me/me.service.js";
import * as EmployeeService from '../employees/employees.service.js';

import signAccessToken from '../../helpers/jwt/sign-access-token.js';
import { generateTotpSetup, verifyTotpCode } from '../../helpers/totp/totp-setup.js';
import { encrypt, decrypt } from '../../helpers/totp/totp-crypto.js';

/* -------------------------------------------------------------------------- */
/*                                CONSTANTES                                  */
/* -------------------------------------------------------------------------- */

const GOOGLE_SCOPES = ['openid', 'email', 'profile'];

const googleOAuthClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                    */
/* -------------------------------------------------------------------------- */

const getGoogleProfile = async (code) => {
    const { tokens } = await googleOAuthClient.getToken(code);
    googleOAuthClient.setCredentials(tokens);

    const oauth2 = google.oauth2({
        version: 'v2',
        client: googleOAuthClient,
        auth: googleOAuthClient,
    });

    const { data } = await oauth2.userinfo.get();
    return { id: data.id, email: data.email, name: data.name };
};

const verifyPassword = async (plain, hashed) => {
    return hashed ? await bcrypt.compare(plain, hashed) : false;
};

const findSubjectBySession = async (session) => {
    const servicePromise = session.isAdmin
        ? EmployeeService.findEmployeeById({ employeeId: session._id })
        : UserService.findUserById({ userId: session._id });

    return servicePromise
        .then((user) => user)
        .catch(() => {
            throw createError.NotFound('Usuario no encontrado.');
        });
};

const enforceSessionLimit = (subjectId) => {
    return AuthRepository.enforceLimit(subjectId, 3);
};

const generateRefreshToken = async (subject, rememberMe, userAgent) => {
    const plainToken = crypto.randomBytes(64).toString('hex');
    const tokenHash = await bcrypt.hash(plainToken, 10);

    const maxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const isEmployee = Boolean(subject.permissions);

    await AuthRepository.upsert({
        user: isEmployee ? null : subject._id,
        employee: isEmployee ? subject._id : null,
        tokenHash,
        userAgent,
        rememberMe,
        expiresAt: new Date(Date.now() + maxAge),
    });

    return plainToken;
};

const generateAuthTokens = async (subject, rememberMe, userAgent) => ({
    accessToken: signAccessToken({
        _id: subject._id,
        email: subject.email,
        isAdmin: Boolean(subject.permissions),
    }),
    refreshToken: await generateRefreshToken(subject, rememberMe, userAgent),
    rememberMe: rememberMe,
});

const validateRefreshToken = async (refreshToken, userAgent) => {
    if (!refreshToken) throw createError.Unauthorized('No hay token de refresco.');

    // 1. Buscamos candidatos por User Agent
    const candidates = await AuthRepository.findValidToken(userAgent);

    if (!candidates || candidates.length === 0) {
        throw createError.Unauthorized('Sesión inválida o expirada.');
    }

    let matchedToken = null;

    // 2. Buscamos el match
    for (const tokenDoc of candidates) {
        const isMatch = await bcrypt.compare(refreshToken, tokenDoc.tokenHash);
        if (isMatch) {
            matchedToken = tokenDoc;
            break; // Salimos del bucle porque ya lo tenemos
        }
    }

    if (!matchedToken) {
        throw createError.Unauthorized('Token de refresco inválido.');
    }

    return matchedToken; // Devolvemos el documento encontrado
};

/* -------------------------------------------------------------------------- */
/*                                  USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const getAuthMe = async ({ session }) => {
    return findSubjectBySession(session);
};

export const register = async ({ userData }) => {
    return UserService.createUser({ userData });
};

export const login = async ({ email, password, rememberMe, userAgent }) => {
    let account = null;

    await Promise.any([
        UserService.findUserByEmail({ userEmail: email }),
        EmployeeService.findEmployeeByEmail({ employeeEmail: email }),
    ])
        .then((result) => {
            account = result;
        })
        .catch((err) => {
            account = null;
        });

    if (!account || !(await verifyPassword(password, account.password))) {
        throw createError.Unauthorized('Email o contraseña incorrectos');
    }

    await enforceSessionLimit(account._id);

    return account.totp?.enabled
        ? { accessToken: null, refreshToken: null }
        : generateAuthTokens(account, rememberMe, userAgent);
};

export const refresh = async ({ refreshToken, userAgent }) => {
    const tokenDoc = await validateRefreshToken(refreshToken, userAgent);

    // Identificamos si es un usuario o un empleado
    const subjectId = tokenDoc.user || tokenDoc.employee;
    const isAdmin = !!tokenDoc.employee;

    // Buscamos el perfil completo
    const subject = isAdmin
        ? await EmployeeService.findEmployeeById({ employeeId: subjectId })
        : await UserService.findUserById({ userId: subjectId });

    if (!subject) {
        throw createError.NotFound('Usuario no encontrado.');
    }

    // Generamos y devolvemos los nuevos tokens
    // Importante: usamos el rememberMe que estaba guardado originalmente
    return generateAuthTokens(subject, tokenDoc.rememberMe, userAgent);
};

export const logout = async ({ refreshToken, userAgent }) => {
    try {
        const tokenDoc = await validateRefreshToken(refreshToken, userAgent);
        if (tokenDoc) {
            await AuthRepository.deleteById(tokenDoc._id);
        }
    } catch {
    }
};

export const setupTotp = async ({ employeeId }) => {
    const employee = await EmployeeService.findEmployeeById({ employeeId });

    if (employee.totp?.enabled) {
        throw createError.BadRequest('TOTP ya configurado');
    }

    const { secret, qrCodeDataUrl } = await generateTotpSetup(employee.email);

    await EmployeeService.updateEmployeeById({
        employeeId,
        employeeUpdateData: {
            totp: { secret: encrypt(secret), enabled: false, lastSetup: new Date() },
        },
    });

    return { qrCodeDataUrl };
};

export const confirmTotp = async ({ employeeId, totpCode }) => {
    const employee = await EmployeeService.findEmployeeById({ employeeId });

    if (!employee.totp?.secret) {
        throw createError.BadRequest('TOTP no configurado');
    }

    const secret = decrypt(employee.totp.secret);

    if (!verifyTotpCode(totpCode, secret)) {
        throw createError.Unauthorized('Código inválido');
    }

    await EmployeeService.updateEmployeeById({
        employeeId,
        employeeUpdateData: { 'totp.enabled': true, 'totp.lastSetup': new Date() },
    });
};

export const verifyTotp = async ({ email, totpCode, userAgent }) => {
    const employee = await EmployeeService.findEmployeeByEmail({ employeeEmail: email });

    if (!employee.totp?.secret) {
        throw createError.BadRequest('TOTP no configurado');
    }

    const secret = decrypt(employee.totp.secret);

    if (!verifyTotpCode(totpCode, secret)) {
        throw createError.Unauthorized('Código inválido');
    }

    return generateAuthTokens(employee, true, userAgent);
};

export const getGoogleAuthUrl = ({ requireConsent }) => {
    return googleOAuthClient.generateAuthUrl({
        access_type: 'online',
        prompt: requireConsent ? 'consent' : 'select_account',
        scope: GOOGLE_SCOPES,
    });
};

export const handleGoogleCallback = async ({ code, error, session, userAgent }) => {
    if (!code || error) {
        throw createError.BadRequest('Código de Google inválido');
    }

    return getGoogleProfile(code)
        .then((googleProfile) => {
            // Intentamos buscar el usuario por Google ID
            return UserService.findUserByGoogleId({
                userGoogleId: googleProfile.id,
            }).catch(() => {
                // Si hay sesión con email, intentamos vincular
                if (session?.email) {
                    return UserService.findUserByEmail({ userEmail: session.email }).then(
                        (currentUser) => {
                            if (currentUser.googleId) {
                                throw createError.Conflict(
                                    'Google ya vinculado a esta cuenta.'
                                );
                            }
                            return UserService.updateUserById({
                                userId: currentUser._id,
                                updateData: { googleId: googleProfile.id },
                            });
                        }
                    );
                }
                // Si no hay sesión, creamos usuario nuevo
                return UserService.createUser({
                    userData: {
                        name: googleProfile.name,
                        email: googleProfile.email,
                        googleId: googleProfile.id,
                    },
                });
            });
        })
        .then((user) => generateAuthTokens(user, true, userAgent));
};

export const checkEmail = async ({ email }) => {
    return Promise.any([
        UserService.findUserByEmail({ userEmail: email }),
        EmployeeService.findEmployeeByEmail({ employeeEmail: email }),
    ])
        .then(() => {
            return { result: 'OK', exists: true };
        })
        .catch(() => {
            return { result: 'OK', exists: false };
        });
};

export const updatePasswordById = async ({ id, updateData }) => {
    const [user, employee] = await Promise.all([
        UserService.findUserById({ userId: id }).catch(() => null),
        EmployeeService.findEmployeeById({ employeeId: id }).catch(() => null),
    ]);

    if (user) {
        return await MeService.updateUserPasswordById({
            userId: id,
            userUpdateData: updateData,
        });
    }

    if (employee) {
        return await EmployeeService.updateEmployeePasswordById({
            employeeId: id,
            employeeUpdateData: updateData,
        });
    }

    throw createError.NotFound('No se encontró el usuario.');
};
