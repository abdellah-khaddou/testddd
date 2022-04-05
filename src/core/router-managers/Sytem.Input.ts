import { storeInstance } from '..';
import { requestFormat } from '../interfaces/Request';
import { formattedResponse, ResponseDirection, ResponseStatus, ResponseType } from '../interfaces/Response';
import { OutputSytem } from './System.Output';

class InputSystemClass {
    getMiddleWares = (req: any, res: any, next: any, globalControllers: any) => {
        this.formatRequest(req);
        try {
            storeInstance.checkModuleAction(req.formattedRequest.Module, req.formattedRequest.Action)
        } catch (error) {
            console.error(error);
            return OutputSytem.sendResponse(res, new formattedResponse(ResponseStatus.notImplemented, error, ResponseDirection.outputSystem, ResponseType.error))
        }
        if (!res.headersSent) {
            next()
        }
    }
    formatRequest = (request: any) => {
        
        request.formattedRequest = (new requestFormat(request)).getFormattedRequest();
        
    }
    addSomeLogs = () => { };
}

export const InputSystem = new InputSystemClass()