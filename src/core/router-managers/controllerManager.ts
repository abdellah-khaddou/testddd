import { Store } from '../Initialisation/Bootstrap';
import { requestFormat, stageRequest, stageResponse } from '../interfaces/Request';
import { formattedResponse, ResponseDirection, ResponseStatus, ResponseType } from '../interfaces/Response';
import { OutputSytem } from './System.Output';

export class controllerManager {
    constructor() { }
    getController = async (req: any, res: any, next: any, globalControllers: Store) => {
        let formattedRequest: requestFormat = req.formattedRequest;
        let Response: stageResponse = {
            send: function (Response: formattedResponse) {
                return OutputSytem.sendResponse(res, Response);
            }
        };
        let Request: stageRequest = {
            ...req.formattedRequest,
            addProperty: req.formattedRequest.addProperty,
            getProperty: req.formattedRequest.getProperty,
            getAllProperties: req.formattedRequest.getAllProperties
        };
        try {

            if (formattedRequest.nextMiddleWare === ResponseDirection.controller) {

                let result = await globalControllers.getController(formattedRequest.Module+'Ctrl', formattedRequest.Action)({ ...Request.body, ...Request.jsonData, middleWareEffect: (Request.getAllProperties && Request.getAllProperties() || {}) });
                if (result && result instanceof formattedResponse) {
                    Response.send(result);
                }
            }
        } catch (error) {
            console.error(error);
            return Response.send(new formattedResponse(ResponseStatus.notImplemented, error, ResponseDirection.outputSystem, ResponseType.error))
        }
        if (!res.headersSent) {
            next()
        }

    }
}
export const controllerManagerInstance = new controllerManager()