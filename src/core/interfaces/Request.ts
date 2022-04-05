import { Request } from 'express';

import { ResponseDirection } from './Response';

export class requestFormat {
    public propertyList: string[] = [];
    public jsonData: any;
    public body: any;
    public headerToken: any;
    public Token: string;
    public Module: string;
    public Action: string;
    public host: string;
    public origin: string;
    public lastMiddleWare: ResponseDirection;
    public nextMiddleWare: ResponseDirection;
    public _inputEffect:any;
    public _outputEffect:any;
    constructor(req: Request | requestFormat) {

        if (req instanceof requestFormat) {
            this.jsonData = req.jsonData,
                this.body = req.body,
                this.headerToken = req.headerToken,
                this.Token = req.Token,
                this.Module = req.Module,
                this.Action = req.Action,
                this.host = req.host,
                this.origin = req.origin
                this.nextMiddleWare = req.nextMiddleWare,
                this.lastMiddleWare = req.lastMiddleWare,
                this._inputEffect={};
                this._outputEffect={};
        }
        else {
                this.jsonData = JSON.parse(req.query['jsonData']&&req.query['jsonData'].toString()||"{}"),
                this.body = req.body,
                this.headerToken = req.headers.token && req.headers.token.toString(),
                this.Token  = req.query['Token']&&req.query['Token'].toString() || '',
                this.Module = req.query['Module']?.toString() || '',
                this.Action = req.query['Action']?.toString() || '',
                this.host = req.get('host') || '',
                this.origin = req.get('origin') || '',
                this.nextMiddleWare = ResponseDirection.inputModule,
                this.lastMiddleWare = ResponseDirection.inputModule,
                this._inputEffect={};
                this._outputEffect={};
                // this.inputEffect = req.inpu
        }

    }
    getFormattedRequest=()=> {
        return {
            ...this
        }
    }
    addProperty =(key:string,value:any)=>{
        this._inputEffect[key] =value
    }
    getProperty=(key:string)=>{
        return this._inputEffect[key];
    }
    getAllProperties=(key:string)=>{
        return this._inputEffect
    }
}
export interface stageRequest{
    jsonData:any,
    body:any,
    headerToken:string,
    Token:string,
    Module:string,
    Action:string,
    host:string,
    origin:string,
    nextMiddleWare:ResponseDirection,
    lastMiddleWare:ResponseDirection,
    addProperty:Function,
    getProperty:Function,
    getAllProperties?:Function
}
export interface stageResponse{
    send : Function
}
