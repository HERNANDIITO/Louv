import jwt from "jsonwebtoken";
import { PRIVATE_KEY } from "./load-jwt-keys.js";

const signAccessToken = (payload) => {
    return jwt.sign(payload, PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "15m",
    });
};

export default signAccessToken;
