import jwt from 'jsonwebtoken';
import { PUBLIC_KEY } from './load-jwt-keys.js';

const verifyToken = (token) => {
    return jwt.verify(token, PUBLIC_KEY, { algorithm: 'RS256' });
};

export default verifyToken;
