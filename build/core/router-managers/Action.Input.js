"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputAction = exports.InputActionClass = void 0;
const Response_1 = require("../interfaces/Response");
const middlewareExecuter_1 = require("./middlewareExecuter");
const System_Output_1 = require("./System.Output");
class InputActionClass {
    constructor() {
        this.getMiddleWares = async (req, res, next, globalControllers) => {
            let formattedRequest = req.formattedRequest;
            if (formattedRequest.nextMiddleWare === Response_1.ResponseDirection.inputAction) {
                let Response = {
                    send: function (Response) {
                        if (Response.responseHeader === Response_1.ResponseDirection.outputSystem)
                            return System_Output_1.OutputSytem.sendResponse(res, Response);
                    }
                };
                let Request = {
                    ...req.formattedRequest,
                    addProperty: req.formattedRequest.addProperty,
                    getProperty: req.formattedRequest.getProperty
                };
                try {
                    await (0, middlewareExecuter_1.middleWareExecuter)(globalControllers.getActionInput(formattedRequest.Module, formattedRequest.Action), Request, Response);
                    formattedRequest.nextMiddleWare = Response_1.ResponseDirection.controller;
                }
                catch (error) {
                    console.error(error);
                    return Response.send(new Response_1.formattedResponse(Response_1.ResponseStatus.notImplemented, error, Response_1.ResponseDirection.outputSystem, Response_1.ResponseType.error));
                }
            }
            if (!res.headersSent) {
                next();
            }
        };
    }
}
exports.InputActionClass = InputActionClass;
exports.InputAction = new InputActionClass();
//# sourceMappingURL=Action.Input.js.map