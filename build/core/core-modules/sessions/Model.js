"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = exports.sessionsSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("./../../../core/db-manager/schema");
exports.sessionsSchema = new schema_1.kmSchema({
    dateCreation: { type: Date, default: Date.now() },
    UID: String,
    Platform: String,
    username: String,
    devicePlatform: String,
    registrationId: String,
    deviceId: String,
    MarketCode: String,
    IsPartner: String,
    CompanyID: String,
    CompanyName: String,
    isSA: String,
    hosturl: String,
    token: String,
    permissions: [String]
});
exports.Sessions = mongoose_1.default.model('sessions', exports.sessionsSchema, 'sessions');
//# sourceMappingURL=Model.js.map