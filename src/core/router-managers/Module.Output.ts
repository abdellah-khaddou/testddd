import { Request } from "express";
import { Store } from "../Initialisation/Bootstrap";
import { requestFormat, stageRequest, stageResponse } from "../interfaces/Request";
import { ResponseDirection, formattedResponse, ResponseStatus, ResponseType } from "../interfaces/Response";
import { middleWareExecuter } from "./middlewareExecuter";
import { OutputSytem } from "./System.Output";

export class OutputModuleClass {
    getMiddleWares = async (req: Request & { formattedRequest: requestFormat }, res: any, next: any, globalControllers: Store) => {
        let formattedRequest: requestFormat = req.formattedRequest;
        if (formattedRequest.nextMiddleWare === ResponseDirection.outputModule) {
            let Response :stageResponse = {
                send: function (Response: formattedResponse) {
                    return OutputSytem.sendResponse(res, Response);
                }
            };
            let Request  :stageRequest= {
                ...req.formattedRequest,
                addProperty: req.formattedRequest.addProperty,
                getProperty: req.formattedRequest.getProperty
            };
            try {
                
                await middleWareExecuter(globalControllers.getModuleOutput(formattedRequest.Module), Request, Response);
            } catch (error) {
                console.error(error);
                return Response.send(new formattedResponse(ResponseStatus.notImplemented,error,ResponseDirection.outputSystem,ResponseType.error))
            
            }
        }
        if(!res.headersSent){
            next()
        }
    }
}
export const OutputModule = new OutputModuleClass()