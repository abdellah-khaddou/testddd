"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.PartMiddlewares = void 0;
const middleware_1 = require("../../base/middleware");
class PartMiddlewares extends middleware_1.Middlewares {
    constructor() {
        super(...arguments);
        this.accessMethods = [''];
    }
}
exports.PartMiddlewares = PartMiddlewares;
exports.middleware = new PartMiddlewares();
//# sourceMappingURL=Middlewares.js.map