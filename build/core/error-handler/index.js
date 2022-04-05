"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
function handleErrors() {
    process.on('uncaughtException', (reason) => {
        console.trace('uncaughtException', reason);
    });
    process.on('unhandledRejection', (promise, reason) => {
        console.trace('unhandledRejection', Promise, reason);
    });
    process.on('exit', (promise) => {
        console.trace("exit", Promise);
    });
    process.on('beforeExit', (promise) => {
        console.trace("beforeExit", Promise);
    });
    process.on('uncaughtExceptionMonitor', (reason) => { console.trace(reason); });
    process.on('message', (msg, error) => console.log("message", msg, error));
    process.on('rejectionHandled', (reason) => console.error("rejectionHandled", reason));
}
exports.handleErrors = handleErrors;
//# sourceMappingURL=index.js.map