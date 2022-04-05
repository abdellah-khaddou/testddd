"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.kmSchema = void 0;
const mongoose_1 = require("mongoose");
const validatorjs_1 = __importDefault(require("validatorjs"));
const Response_1 = require("../interfaces/Response");
class kmSchema extends mongoose_1.Schema {
    constructor(definition, options) {
        super(definition, options);
        this.retrieveSchema = (srcObject) => {
            let schemaObject = {};
            Object.keys(srcObject).forEach(key => {
                var _a, _b;
                let valueType = typeof srcObject[key];
                if (valueType === 'function') {
                    if (srcObject[key].name == "Number")
                        return schemaObject[key] = "numeric";
                    else
                        return schemaObject[key] = srcObject[key].name.toLocaleLowerCase();
                }
                else if (valueType === 'object') {
                    if (Array.isArray(srcObject[key])) {
                        schemaObject[key] = [];
                        schemaObject[key][0] = this.retrieveSchema(srcObject[key][0]);
                    }
                    if (((_a = srcObject[key]) === null || _a === void 0 ? void 0 : _a.type) && typeof ((_b = srcObject[key]) === null || _b === void 0 ? void 0 : _b.type) === 'function') {
                        if (srcObject[key].type.name == "Number")
                            return schemaObject[key] = "numeric";
                        else
                            return schemaObject[key] = srcObject[key].type.name.toLocaleLowerCase();
                    }
                    else {
                        schemaObject[key] = this.retrieveSchema(srcObject[key]);
                    }
                }
                else {
                    console.log("res :", srcObject[key], valueType);
                    return schemaObject[key] = srcObject[key].name.toLocaleLowerCase();
                }
            });
            return schemaObject;
        };
        this.getValidatorRules = async (schema) => {
            return this.retrieveSchema(this.obj);
        };
        this.getModuleValidator = async (Request, Response) => {
            let schema = await this.retrieveSchema(this.obj);
            console.log(Request.body, schema);
            let validation = new validatorjs_1.default(Request.body, schema);
            validation.passes();
            if (Object.keys(validation.errors.errors).length > 0) {
                return Response.send(new Response_1.formattedResponse(Response_1.ResponseStatus.NotAcceptable, validation.errors, Response_1.ResponseDirection.outputSystem));
            }
        };
        this.validatorRules = this.retrieveSchema(this.obj);
    }
}
exports.kmSchema = kmSchema;
//# sourceMappingURL=schema.js.map