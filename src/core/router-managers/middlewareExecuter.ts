import { formattedResponse, ResponseDirection, ResponseStatus, ResponseType } from "../interfaces/Response";
import { OutputSytem } from "./System.Output";

 
export function middleWareExecuter(middleware:Function[],Request:any,Response:any){
    console.log(middleware)
    return middleware.reduce((previousMiddleware,middleware)=>{
        return previousMiddleware.then(()=>{
            
            return middleware(Request,Response);
        })
        .catch(error=>
            Response.send(new formattedResponse(ResponseStatus.internalServerError,error,ResponseDirection.outputSystem,ResponseType.error))
            )
    },Promise.resolve());
}