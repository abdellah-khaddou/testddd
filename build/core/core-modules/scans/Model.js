"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scans = exports.scansSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("../../db-manager/schema");
exports.scansSchema = new schema_1.kmSchema({
    dateCreation: { type: Date, default: Date.now() },
    url: String,
    linkedTo: String,
    type: String
});
exports.Scans = mongoose_1.default.model('scans', exports.scansSchema, 'scans');
//# sourceMappingURL=Model.js.map