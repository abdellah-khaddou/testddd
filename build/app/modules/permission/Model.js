"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = exports.permissionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("../../../core/db-manager/schema");
exports.permissionSchema = new schema_1.kmSchema({
    userID: {
        type: String,
        ref: "users",
        required: true,
        default: "null"
    },
    roleID: {
        type: String,
        ref: "role",
        required: true,
        default: "null"
    },
    permission: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        ref: "companies",
        required: true
    },
    createdBy: {
        type: String,
        ref: "users",
        required: true,
        default: "null"
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date()
    }
}).index({ userID: 1, roleID: 1, permission: 1, company: 1 }, { unique: true });
exports.Permission = mongoose_1.default.model('permission', exports.permissionSchema, 'permission');
//# sourceMappingURL=Model.js.map