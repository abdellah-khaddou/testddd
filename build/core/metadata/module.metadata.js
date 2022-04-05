"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moduleMetaData = exports.Module = void 0;
const __1 = require("..");
function Module(metadata) {
    return function (constructor) {
        __1.storeInstance.emit('registerModule', constructor);
        __1.storeInstance.setModuleInput(constructor.name.replace('Ctrl', ''), metadata.inputs);
        __1.storeInstance.setModuleOutput(constructor.name.replace('Ctrl', ''), metadata.outputs);
    };
}
exports.Module = Module;
class moduleMetaData {
}
exports.moduleMetaData = moduleMetaData;
//# sourceMappingURL=module.metadata.js.map