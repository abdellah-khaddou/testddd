"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenManager {
    constructor() {
        this.algorithm = "HS512";
        this.secretKey = process.env.SecretKey || '';
        this.generateToken = async (ObjectToCode, expiration) => {
            const issued = Date.now();
            const fifteenMinutesInMs = 15 * 60 * 1000;
            const expires = issued + fifteenMinutesInMs;
            const session = {
                issued: issued,
                expires: expires,
                ...ObjectToCode
            };
            return {
                token: jsonwebtoken_1.default.sign(session, this.secretKey, { expiresIn: expiration || '30d' }),
                issued: issued,
                expires: expires
            };
        };
        this.verifyToken = async (token, Expiration) => {
            return jsonwebtoken_1.default.verify(token, this.secretKey, { ignoreExpiration: !Expiration });
        };
        this.decoreToken = async (token) => {
            return jsonwebtoken_1.default.decode(token);
        };
    }
}
let tokenMangager = new TokenManager();
exports.default = tokenMangager;
//# sourceMappingURL=TokenManager.js.map