 import { storeInstance } from "..";

 
export function getInjection(module:Function|string){
  if(typeof module==='function'){
    return storeInstance.getModule (module.name);
  }
  return storeInstance.getModule (module);
}
export function checkModule(module:Function|string):boolean{
    return storeInstance.Businesscontainer.has(module)
}
export function getFunction(item){
  return storeInstance.setupContainer.resolve(item)
}

