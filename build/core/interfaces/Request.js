"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestFormat = void 0;
const Response_1 = require("./Response");
class requestFormat {
    constructor(req) {
        var _a, _b;
        this.propertyList = [];
        this.getFormattedRequest = () => {
            return {
                ...this
            };
        };
        this.addProperty = (key, value) => {
            this._inputEffect[key] = value;
        };
        this.getProperty = (key) => {
            return this._inputEffect[key];
        };
        this.getAllProperties = (key) => {
            return this._inputEffect;
        };
        if (req instanceof requestFormat) {
            this.jsonData = req.jsonData,
                this.body = req.body,
                this.headerToken = req.headerToken,
                this.Token = req.Token,
                this.Module = req.Module,
                this.Action = req.Action,
                this.host = req.host,
                this.origin = req.origin;
            this.nextMiddleWare = req.nextMiddleWare,
                this.lastMiddleWare = req.lastMiddleWare,
                this._inputEffect = {};
            this._outputEffect = {};
        }
        else {
            this.jsonData = JSON.parse(req.query['jsonData'] && req.query['jsonData'].toString() || "{}"),
                this.body = req.body,
                this.headerToken = req.headers.token && req.headers.token.toString(),
                this.Token = req.query['Token'] && req.query['Token'].toString() || '',
                this.Module = ((_a = req.query['Module']) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                this.Action = ((_b = req.query['Action']) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                this.host = req.get('host') || '',
                this.origin = req.get('origin') || '',
                this.nextMiddleWare = Response_1.ResponseDirection.inputModule,
                this.lastMiddleWare = Response_1.ResponseDirection.inputModule,
                this._inputEffect = {};
            this._outputEffect = {};
            // this.inputEffect = req.inpu
        }
    }
}
exports.requestFormat = requestFormat;
//# sourceMappingURL=Request.js.map