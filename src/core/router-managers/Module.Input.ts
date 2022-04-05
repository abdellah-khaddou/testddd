import { Request } from 'express';

import { Store } from '../Initialisation/Bootstrap';
import { requestFormat, stageRequest, stageResponse } from '../interfaces/Request';
import { formattedResponse, ResponseDirection, ResponseStatus, ResponseType } from '../interfaces/Response';
import { middleWareExecuter } from './middlewareExecuter';
import { OutputSytem } from './System.Output';

export class InputModuleClass{
    getMiddleWares=async (req:Request&{formattedRequest:requestFormat},res:any,next:any,globalControllers:Store)=>{
       let formattedRequest:requestFormat =  req.formattedRequest;
         if(formattedRequest.nextMiddleWare===ResponseDirection.inputModule){
        
        let Response:stageResponse = {
            send:function(Response:formattedResponse){
                return  OutputSytem.sendResponse(res,Response);
            }
        };
        let Request :stageRequest = {
            ...req.formattedRequest,
            addProperty : req.formattedRequest.addProperty,
            getProperty :req.formattedRequest.getProperty
        };
        try {
            
         let result=  await middleWareExecuter(globalControllers.getModuleInput(formattedRequest.Module),Request,Response);
            
         formattedRequest.nextMiddleWare=ResponseDirection.inputAction;
        } catch (error) {
            console.error(error);
            return Response.send(new formattedResponse(ResponseStatus.notImplemented,error,ResponseDirection.outputSystem,ResponseType.error))
        
        }

        }
        if(!res.headersSent){
            next()
        }        }
    }
export const InputModule = new InputModuleClass();
