import { getInjection } from './providers';
import { appResolver } from './mainResolver'
import { randomInstance } from '../../helpers/random';
export function executeControllerAction(options: { module: string, action: string, params: any }) {
    let appResolver: appResolver = getInjection('appResolver');
    let actionId =new Date().getTime()+' '+randomInstance.makeid(8) ;
   let response =(eventResponse)=>{
         appResolver.emit(actionId,eventResponse)        
    } 
     let promiseAction = new Promise((resolve, reject) => {
        let resolved = false;
        appResolver.on(actionId, (response) => {
            resolved=true
             resolve(response)
        })
        setTimeout(() => {
            if (resolved === false)
                reject('no response was provided in time')
        },30000)
    })
    // le
     appResolver.emit(options.module, { ...options ,response});

     //console.log('before promise')
     return promiseAction;
}


// action => mainResolver => moduleResolver => dispatcher
// sendaction
// respond to action 