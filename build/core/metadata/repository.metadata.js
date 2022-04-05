"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = void 0;
const __1 = require("..");
function Repository() {
    return function (constructor) {
        __1.storeInstance.emit('registerRepository', constructor);
    };
}
exports.Repository = Repository;
//# sourceMappingURL=repository.metadata.js.map