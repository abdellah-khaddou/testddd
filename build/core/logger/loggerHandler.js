"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerHandler = exports.Logger = exports.logsSchema = void 0;
const console_1 = require("console");
const fs_1 = require("fs");
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("../db-manager/schema");
exports.logsSchema = new schema_1.kmSchema({
    dateCreation: { type: Date, default: Date.now() },
    timeStamp: Number,
    message: schema_1.kmSchema.Types.Mixed,
    type: String
});
exports.Logger = mongoose_1.default.model('logs', exports.logsSchema, 'Logs');
class LoggerHandlerRepository extends console_1.Console {
    constructor(stdout, stderr, ignoreErrors) {
        let logStream = (0, fs_1.createWriteStream)(stdout);
        let errorStream = (0, fs_1.createWriteStream)(stderr);
        super(logStream, errorStream, ignoreErrors);
    }
    log(...optionalParams) {
        exports.Logger.create({ timeStamp: new Date().getTime(), message: optionalParams, type: "log" }).then().catch();
        process.stdout.write('[log] ' + (new Date().toISOString()).toString() + ' : \n\t ' + ((typeof optionalParams === 'object' || typeof optionalParams === 'function') ? optionalParams.map(element => JSON.stringify(element)).join('  ') : optionalParams) + "\n");
        return super.log(JSON.stringify({ timeStamp: new Date().getTime(), message: optionalParams, type: "log" }), ...optionalParams);
    }
    error(...optionalParams) {
        exports.Logger.create({ timeStamp: new Date().getTime(), message: optionalParams, type: "error" }).then().catch();
        process.stderr.write('\x1b[31m' + '[error] ' + new Date().toISOString() + ' : \n\t' + optionalParams.map(element => JSON.stringify(element)).join('  ') + '\x1b[0m\n');
        return super.error({ timeStamp: new Date().getTime(), message: optionalParams, type: "error" });
    }
    info(...optionalParams) {
        exports.Logger.create({ timeStamp: new Date().getTime(), message: optionalParams, type: "info" }).then().catch();
        process.stdout.write('\x1b[32m' + '[info] ' + new Date().toISOString() + ' : \n\t ' + optionalParams.map(element => JSON.stringify(element)).join('  ') + '\x1b[0m\n');
        return super.info({ timeStamp: new Date().getTime(), message: optionalParams, type: "info" });
    }
    warn(...optionalParams) {
        exports.Logger.create({ timeStamp: new Date().getTime(), message: optionalParams, type: "warn" }).then().catch();
        process.stdout.write('\x1b[33m' + '[warn] ' + new Date().toISOString() + ' : \n \t' + optionalParams.map(element => JSON.stringify(element)).join('  ') + '\x1b[0m\n');
        return super.warn({ timeStamp: new Date().getTime(), message: optionalParams, type: "warn" });
    }
    trace(message) {
        exports.Logger.create({ message, type: "trace" }).then().catch();
        process.stderr.write('\x1b[31m' + '[trace] ' + new Date().toISOString() + ' : \n \t' + ((typeof message === 'object' || typeof message === 'function') ? JSON.stringify(message) : message) + '\x1b[0m\n');
        return super.trace({ message, type: "trace" });
    }
}
;
if (process.env.NODE_ENV !== 'test') {
    exports.LoggerHandler = new LoggerHandlerRepository(process.env.infoLogs || "", process.env.errorLogs || '', false);
}
// logStream.end(()=>{});
// errorStream.end(()=>{});
// process.on('beforeExit', function(){
//      logStream.end();
//      errorStream.end()
//      // LoggerHandler =new LoggerHandlerRepository(process.stdout,process.stderr,false);
//       process.exit(1);
//  });
//# sourceMappingURL=loggerHandler.js.map