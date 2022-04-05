import { requestFormat } from "../interfaces/Request";
import { ResponseDirection, formattedResponse, ResponseStatus, ResponseType } from "../interfaces/Response";
import { Store } from "../Initialisation/Bootstrap";
import { Request } from "express";
import { middleWareExecuter } from "./middlewareExecuter";
import { OutputSytem } from "./System.Output";

export class OutputActionClass{
    getMiddleWares=async(req:Request&{formattedRequest:requestFormat},res:any,next:any,globalControllers:Store)=>{
        let formattedRequest:requestFormat =  req.formattedRequest;
          if(formattedRequest.nextMiddleWare===ResponseDirection.outputAction){
         
        let Response = {
            send:function(Response:formattedResponse){
                return  OutputSytem.sendResponse(res,Response);
            }
        };
        let Request = {
            ...req.formattedRequest,
            addProperty : req.formattedRequest.addProperty,
            getProperty :req.formattedRequest.getProperty
        };
         try {
             
             await middleWareExecuter(globalControllers.getActionOutput(formattedRequest.Module,formattedRequest.Action),Request,Response);
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
export const OutputAction = new OutputActionClass()