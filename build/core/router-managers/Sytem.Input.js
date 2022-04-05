"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSystem = void 0;
const __1 = require("..");
const Request_1 = require("../interfaces/Request");
const Response_1 = require("../interfaces/Response");
const System_Output_1 = require("./System.Output");
class InputSystemClass {
    constructor() {
        this.getMiddleWares = (req, res, next, globalControllers) => {
            this.formatRequest(req);
            try {
                __1.storeInstance.checkModuleAction(req.formattedRequest.Module, req.formattedRequest.Action);
            }
            catch (error) {
                console.error(error);
                return System_Output_1.OutputSytem.sendResponse(res, new Response_1.formattedResponse(Response_1.ResponseStatus.notImplemented, error, Response_1.ResponseDirection.outputSystem, Response_1.ResponseType.error));
            }
            if (!res.headersSent) {
                next();
            }
        };
        this.formatRequest = (request) => {
            request.formattedRequest = (new Request_1.requestFormat(request)).getFormattedRequest();
        };
        this.addSomeLogs = () => { };
    }
}
exports.InputSystem = new InputSystemClass();
//# sourceMappingURL=Sytem.Input.js.map