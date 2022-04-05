import { EventEmitter } from 'events';
import { Service } from '../metadata/Service.metadata';
import { checkModule } from './providers';

@Service()
export class appResolver extends EventEmitter {
    constructor(){
        super()
          this.on('actionDispatched',(options:{module:string,action:string,params:object,id:string})=>{
         if(checkModule(options.module+'Ctrl')){
             this.emit(options.module,options)
         }
         });
    }
};