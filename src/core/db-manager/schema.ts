import { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';
import Validator from 'validatorjs'
import { requestFormat, stageRequest, stageResponse } from '../interfaces/Request';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../interfaces/Response';

export class kmSchema extends Schema{
    private validatorRules:any;
    constructor(definition?: SchemaDefinition | undefined, options?: SchemaOptions | undefined){
        super(definition,options);
        this.validatorRules = this.retrieveSchema(this.obj);
    }

    retrieveSchema=(srcObject:any) =>{
        let schemaObject:any={}
     
            Object.keys(srcObject).forEach(key=>{
                let valueType = typeof srcObject[key];
                if (valueType==='function'){
                    
                    if(srcObject[key].name == "Number") return schemaObject[key]="numeric";
                    else return schemaObject[key]=srcObject[key].name.toLocaleLowerCase();
                
                }
                else if (valueType==='object'){
                    if(Array.isArray(srcObject[key])){

                        schemaObject[key]=[];schemaObject[key][0]= this.retrieveSchema(srcObject[key][0])
                    }
                    
                    if(srcObject[key]?.type&&typeof srcObject[key]?.type==='function'){
                        if(srcObject[key].type.name == "Number") return schemaObject[key]="numeric";
                        else return schemaObject[key]=srcObject[key].type.name.toLocaleLowerCase();
                    
                    }else{
                        schemaObject[key] =  this.retrieveSchema(srcObject[key])
                    }
                }else{
                    console.log("res :",srcObject[key],valueType)
                    return schemaObject[key]=srcObject[key].name.toLocaleLowerCase()
                }
            })
            return schemaObject;
       
        
    }
    getValidatorRules=async(schema:any)=>{
        return this.retrieveSchema(this.obj);
    }
    getModuleValidator=async(Request:stageRequest,Response:stageResponse)=>{
         let schema = await this.retrieveSchema(this.obj);
         console.log(Request.body,schema)
          let validation = new Validator(Request.body,schema);
         validation.passes();
         if(Object.keys(validation.errors.errors).length>0){
             return  Response.send(new formattedResponse(ResponseStatus.NotAcceptable,validation.errors,ResponseDirection.outputSystem));
         }
          
    }
}   
