import { storeInstance } from '..';
import { stageRequest, stageResponse } from '../interfaces/Request';

export function bind<T extends Function>(target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
  if(!descriptor || (typeof descriptor.value !== 'function')) {
      throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
  }
  
  return {
      configurable: true,
      get(this: T): T {
          const bound: T = descriptor.value!.bind(this);
          // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
          Object.defineProperty(this, propertyKey, {
              value: bound,
              configurable: true,
              writable: true
          });
          return bound;
      }
  };
}

export default bind;
// descriptor
 

 export function endPoint(metadata: endPointMetaData) {        
  return <T extends Function>(target: object, propertyKey: any, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void =>{
    if(!descriptor || (typeof descriptor.value !== 'function')) {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }
    // console.log(descriptor.value.toString())
    storeInstance.setActionInput(target.constructor.name.replace('Ctrl',''),propertyKey,metadata.inputs)
    // console.log(descriptor.value)
    storeInstance.setActionEndPoint(target.constructor.name.replace('Ctrl',''),propertyKey);

    return {
        configurable: true,
        get(this: T): T {
            const bound: T = descriptor.value!.bind(this);
             Object.defineProperty(this, propertyKey, {
                value: bound,
                configurable: true,
                writable: true
            });

            return bound;
        }
    };
  }
 }
 export function atLeaseOne(...functions:((a: any) => any)[]){
  return functions[0]
}
export class endPointMetaData{
  inputs?:((req: stageRequest,res:stageResponse) => any)[] ;
  outputs?:((req: stageRequest,res:stageResponse) => any)[] ;
}
  