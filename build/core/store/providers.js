"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunction = exports.checkModule = exports.getInjection = void 0;
const __1 = require("..");
function getInjection(module) {
    if (typeof module === 'function') {
        return __1.storeInstance.getModule(module.name);
    }
    return __1.storeInstance.getModule(module);
}
exports.getInjection = getInjection;
function checkModule(module) {
    return __1.storeInstance.Businesscontainer.has(module);
}
exports.checkModule = checkModule;
function getFunction(item) {
    return __1.storeInstance.setupContainer.resolve(item);
}
exports.getFunction = getFunction;
//# sourceMappingURL=providers.js.map