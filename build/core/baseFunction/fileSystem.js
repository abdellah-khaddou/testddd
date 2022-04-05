"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileSystemInstance = void 0;
const fs_1 = __importDefault(require("fs"));
class fileSystem {
    file() {
        return fs_1.default;
    }
}
exports.fileSystemInstance = new fileSystem();
//# sourceMappingURL=fileSystem.js.map