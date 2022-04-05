"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.endPointMetaData = exports.atLeaseOne = exports.endPoint = exports.bind = void 0;
const __1 = require("..");
function bind(target, propertyKey, descriptor) {
    if (!descriptor || (typeof descriptor.value !== 'function')) {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }
    return {
        configurable: true,
        get() {
            const bound = descriptor.value.bind(this);
            // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
            Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true
            });
            return bound;
        }
    };
}
exports.bind = bind;
exports.default = bind;
// descriptor
function endPoint(metadata) {
    return (target, propertyKey, descriptor) => {
        if (!descriptor || (typeof descriptor.value !== 'function')) {
            throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
        }
        // console.log(descriptor.value.toString())
        __1.storeInstance.setActionInput(target.constructor.name.replace('Ctrl', ''), propertyKey, metadata.inputs);
        // console.log(descriptor.value)
        __1.storeInstance.setActionEndPoint(target.constructor.name.replace('Ctrl', ''), propertyKey);
        return {
            configurable: true,
            get() {
                const bound = descriptor.value.bind(this);
                Object.defineProperty(this, propertyKey, {
                    value: bound,
                    configurable: true,
                    writable: true
                });
                return bound;
            }
        };
    };
}
exports.endPoint = endPoint;
function atLeaseOne(...functions) {
    return functions[0];
}
exports.atLeaseOne = atLeaseOne;
class endPointMetaData {
}
exports.endPointMetaData = endPointMetaData;
//# sourceMappingURL=action.metadata.js.map