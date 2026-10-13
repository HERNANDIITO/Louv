import express from 'express';
import * as controller from './auth.controller.js';
import {
    RegisterSchema,
    LoginSchema,
    TotpConfirmSchema,
    TotpVerifySchema,
} from './auth.validators.js';
import { UpdateAccountPasswordSchema } from '../users/me/me.validators.js';
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
    validateRequestData,
} from '../../middlewares/index.js';

const authRouter = express.Router();
authRouter.use(validateJsonContentType);
authRouter.use(setJsonContentType);

authRouter.get('/me', authenticateAccessToken, controller.getAuthMe);

authRouter.post(
    '/register',
    validateRequestData(RegisterSchema),
    controller.postAuthRegister
);

authRouter.post('/login', validateRequestData(LoginSchema), controller.postAuthLogin);

authRouter.post('/logout', authenticateAccessToken, controller.postAuthLogout);

authRouter.post('/refresh', controller.postAuthRefresh);

authRouter.post(
    '/totp/setup',
    authenticateAccessToken,
    isAdmin,
    controller.postAuthTotpSetup
);

authRouter.post(
    '/totp/confirm',
    authenticateAccessToken,
    isAdmin,
    validateRequestData(TotpConfirmSchema),
    controller.postAuthTotpConfirm
);

authRouter.post(
    '/totp',
    validateRequestData(TotpVerifySchema),
    controller.postAuthTotpVerify
);

authRouter.get('/google', controller.getAuthGoogle);

authRouter.get('/google/callback', controller.getAuthGoogleCallback);

authRouter.post('/check-email', controller.postCheckUserEmail);

authRouter.put(
    '/password',
    validateJsonContentType,
    authenticateAccessToken,
    validateRequestData(UpdateAccountPasswordSchema),
    controller.updatePasswordById
);

export default authRouter;
