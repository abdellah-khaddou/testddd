"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controllerManagerInstance = exports.controllerManager = void 0;
const Response_1 = require("../interfaces/Response");
const System_Output_1 = require("./System.Output");
class controllerManager {
    constructor() {
        this.getController = async (req, res, next, globalControllers) => {
            let formattedRequest = req.formattedRequest;
            let Response = {
                send: function (Response) {
                    return System_Output_1.OutputSytem.sendResponse(res, Response);
                }
            };
            let Request = {
                ...req.formattedRequest,
                addProperty: req.formattedRequest.addProperty,
                getProperty: req.formattedRequest.getProperty,
                getAllProperties: req.formattedRequest.getAllProperties
            };
            try {
                if (formattedRequest.nextMiddleWare === Response_1.ResponseDirection.controller) {
                    let result = await globalControllers.getController(formattedRequest.Module + 'Ctrl', formattedRequest.Action)({ ...Request.body, ...Request.jsonData, middleWareEffect: (Request.getAllProperties && Request.getAllProperties() || {}) });
                    if (result && result instanceof Response_1.formattedResponse) {
                        Response.send(result);
                    }
                }
            }
            catch (error) {
                console.error(error);
                return Response.send(new Response_1.formattedResponse(Response_1.ResponseStatus.notImplemented, error, Response_1.ResponseDirection.outputSystem, Response_1.ResponseType.error));
            }
            if (!res.headersSent) {
                next();
            }
        };
    }
}
exports.controllerManager = controllerManager;
exports.controllerManagerInstance = new controllerManager();
//# sourceMappingURL=controllerManager.js.map