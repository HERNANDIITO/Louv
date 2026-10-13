import createError from 'http-errors';
import verifyToken from '../../helpers/jwt/verify-access-token.js';

const handleJwtError = (error, next) => {
    if (error.name === 'TokenExpiredError') {
        return next(createError.Unauthorized('Token caducado. Por favor inicia sesión.'));
    }

    if (error.name === 'JsonWebTokenError') {
        return next(createError.BadRequest('El token no cumple con el formato esperado.'));
    }
    next(error);
};

const authenticateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return next(createError.Unauthorized('Token no encontrado. Por favor inicia sesión.'));
    }

    try {
        const { iat, exp, ...subject } = verifyToken(accessToken);
        req.session = subject;
        next();
    } catch (error) {
        handleJwtError(error, next);
    }
};

export default authenticateToken;
