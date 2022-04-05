"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() { }
    hashPassword(password) {
        return bcrypt_1.default.hashSync(password, 16);
    }
    verifyPassword(passwordUser, passwordDb) {
        return bcrypt_1.default.compareSync(passwordUser, passwordDb);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user_service.js.map