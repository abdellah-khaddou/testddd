// import { GlobalVariable } from "../..";

export function middleWare(metadata: MiddleWareMetaData) {        
    return (target: any, propertyKey: string, descriptor?: TypedPropertyDescriptor<any>) => { 
    //   console.log(metadata.inputs);
    //   if(!metadata.inputs)metadata.inputs=  [userMiddlewareInstance.authenticateUser]
    //   GlobalVariable.setActionInput(target.constructor.name.replace('Ctrl',''),propertyKey,metadata.inputs)
    //   GlobalVariable.setActionOuput(target.constructor.name.replace('Ctrl',''),propertyKey,metadata.outputs)
    }
  }
export interface MiddleWareMetaData{
  signature:string;
}