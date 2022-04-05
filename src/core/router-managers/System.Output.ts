import { Response } from 'express';

import { formattedResponse, ResponseStatus, ResponseType } from '../interfaces/Response';

export class OutputSytemClass {
    sendResponse(res, response: formattedResponse) {
        //  let Response:requestFormat = res.
        if (response.type===ResponseType.json) {
            return res.status(response.status).json(response.value)
        }

        if (response.type===ResponseType.error) {
            // this.handleErrors()
            console.error(response.value);

            if(process.env.NODE_ENV==='developement'){
            let element: Error = response.value;
                return res.status(response.status).send({name:element.name,stack:element.stack,message:element.message})
            }
            else{
              let element: Error = response.value;
              return res.status(response.status).send({name:element.name,stack:element.stack,message:element.message})
                //return res.status(ResponseStatus.notImplemented).send('Method Not Found')
            }
        }
        if (response.type === 'file') {
           return res.status(response.status).sendFile(response.value)
        }
        if (response.type === ResponseType.tocsv) {
            res.header('Content-Type', 'text/csv');
            res.attachment('file.csv');
            return res.send(response.value);
        }
        if (response.type === 'zipFiles') {
            return res.status(response.status).zip({ files: response.value });
        }
        return res.status(ResponseStatus.internalServerError).send('Something Went Wrong');
    }
    handleErrors(error:any,req:any,res:Response,next:any){
           console.error(error);

        if(!res.headersSent){
            if(process.env.NODE_ENV==='developement'){
                let element: Error = error;
                    return res.status(ResponseStatus.internalServerError).send({name:element.name,stack:element.stack,message:element.message})
                }
                else{
                    return res.status(ResponseStatus.notImplemented).send('Method Not Found')
                }
            // return res.status(ResponseStatus.notImplemented).send('Method Not Found')
        }
     }
}
export const OutputSytem = new OutputSytemClass()
