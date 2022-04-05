"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseType = exports.ResponseStatus = exports.ResponseDirection = exports.formattedResponse = void 0;
class formattedResponse {
    constructor(_status, _value, _headed, _type, _responseHeader) {
        this._status = _status;
        this._value = _value;
        this._headed = _headed;
        this._type = _type;
        this._responseHeader = _responseHeader;
        this.status = this._status;
        this.value = this._value;
        this.type = this._type || ResponseType.json;
        this.headed = this._headed || ResponseDirection.outputSystem;
        this.responseHeader = this._responseHeader;
    }
}
exports.formattedResponse = formattedResponse;
var ResponseDirection;
(function (ResponseDirection) {
    ResponseDirection["inputAction"] = "inputAction";
    ResponseDirection["inputModule"] = "inputModule";
    ResponseDirection["inputSystem"] = "inputSystem";
    ResponseDirection["outputAction"] = "outputAction";
    ResponseDirection["outputModule"] = "outputModule";
    ResponseDirection["outputSystem"] = "outputSystem";
    ResponseDirection["controller"] = "controller";
})(ResponseDirection = exports.ResponseDirection || (exports.ResponseDirection = {}));
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["succes"] = 200] = "succes";
    ResponseStatus[ResponseStatus["badRequest"] = 400] = "badRequest";
    ResponseStatus[ResponseStatus["unAuthorized"] = 401] = "unAuthorized";
    ResponseStatus[ResponseStatus["notFound"] = 404] = "notFound";
    ResponseStatus[ResponseStatus["Forbidden"] = 403] = "Forbidden";
    ResponseStatus[ResponseStatus["NotAcceptable"] = 406] = "NotAcceptable";
    ResponseStatus[ResponseStatus["methodNotAllowed"] = 405] = "methodNotAllowed";
    ResponseStatus[ResponseStatus["notImplemented"] = 501] = "notImplemented";
    ResponseStatus[ResponseStatus["gateWayTimeOut"] = 504] = "gateWayTimeOut";
    ResponseStatus[ResponseStatus["internalServerError"] = 500] = "internalServerError";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["json"] = "json";
    ResponseType["file"] = "file";
    ResponseType["tocsv"] = "csv";
    ResponseType["zipFiles"] = "zipFiles";
    ResponseType["string"] = "string";
    ResponseType["error"] = "error";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
//# sourceMappingURL=Response.js.map