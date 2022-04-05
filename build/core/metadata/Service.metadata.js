"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const __1 = require("..");
function Service() {
    return function (constructor) {
        __1.storeInstance.emit('registerService', constructor);
    };
}
exports.Service = Service;
//# sourceMappingURL=Service.metadata.js.map