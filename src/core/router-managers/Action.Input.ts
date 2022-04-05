import { Request } from 'express';

import { Store } from '../Initialisation/Bootstrap';
import { requestFormat, stageRequest, stageResponse } from '../interfaces/Request';
import { formattedResponse, ResponseDirection, ResponseStatus, ResponseType } from '../interfaces/Response';
import { middleWareExecuter } from './middlewareExecuter';
import { OutputSytem } from './System.Output';

export class InputActionClass{
    getMiddleWares= async (req:Request&{formattedRequest:requestFormat},res:any,next:any,globalControllers:Store)=>{
        let formattedRequest:requestFormat =  req.formattedRequest;
          if(formattedRequest.nextMiddleWare===ResponseDirection.inputAction){
         
         let Response:stageResponse = {
             send:function(Response:formattedResponse){
                if(Response.responseHeader===ResponseDirection.outputSystem) return  OutputSytem.sendResponse(res,Response);
              }
         };
         let Request:stageRequest = {
             ...req.formattedRequest,
             addProperty : req.formattedRequest.addProperty,
             getProperty :req.formattedRequest.getProperty
         };
         try {
             
             await middleWareExecuter(globalControllers.getActionInput(formattedRequest.Module,formattedRequest.Action),Request,Response);
             formattedRequest.nextMiddleWare=ResponseDirection.controller;
         } catch (error) {  console.error(error);
            return Response.send(new formattedResponse(ResponseStatus.notImplemented,error,ResponseDirection.outputSystem,ResponseType.error))
        
             
         }
         }
         if(!res.headersSent){
            next()
        }    }
}

export const InputAction = new InputActionClass()