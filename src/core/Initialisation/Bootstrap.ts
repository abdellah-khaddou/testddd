 import { EventEmitter } from 'events';
const awilix = require('awilix')
import {sep} from 'path'
export class Store extends EventEmitter {
    path = __dirname.split(sep)[__dirname.split(sep).length-3]; 
    extension = this.path==='build'?'js':'ts'; 
    setupContainer
    Businesscontainer
     constructor() {
        super()
        this.Businesscontainer = awilix.createContainer({ });
        this.setupContainer = awilix.createContainer({});
         this.once('saveConfig',config=>{
            this.setupContainer.register('config',awilix.asValue(config))
        })
        this.once('expressApp',(app)=>this.setupContainer.register('app',awilix.asValue(app)))
         this.on('registerModule',(moduleContstructor)=>{
             this.Businesscontainer.register(moduleContstructor.name ,awilix.asClass(moduleContstructor ).singleton())
            });
            this.on('registerService',(moduleContstructor)=>{
            this.Businesscontainer
                .register(moduleContstructor.name ,
                    awilix
                        .asClass(moduleContstructor).singleton()
                 )
                 this.Businesscontainer.cradle[moduleContstructor.name]
            })
        this.once('bootstrapRequirement',({name,value})=>{
             this.setupContainer.register(name ,awilix.asValue(value ))
       });
       this.on('registerRepository',(moduleContstructor)=>{
         this.Businesscontainer.register(moduleContstructor.name ,awilix.asClass(moduleContstructor ).singleton())
        })
    }
    config = {
        staticPath: '',
        port: 3001
    }
    initializeModules() {
        this.setup()
        this.Businesscontainer.loadModules([[this.path+'/core/core-modules/*/Model.'+this.extension,{register:awilix.asClass}]]);
        this.Businesscontainer.loadModules([[this.path+'/core/core-modules/*/Controller.'+this.extension,{register:awilix.asClass}]]);
        this.Businesscontainer.loadModules([[this.path+'/app/modules/**/Model.'+this.extension,{register:awilix.asClass}]]);
        this.Businesscontainer.loadModules([[this.path+'/app/modules/**/Controller.'+this.extension,{register:awilix.asClass}]]);
        this.Businesscontainer.loadModules([[this.path+'/app/modules/**/Service.'+this.extension,{register:awilix.asClass}]]);
        this.Businesscontainer.loadModules([[this.path+'/app/modules/**/Middleware.'+this.extension,{register:awilix.asClass}]]);
        
        
    }
    setup(){
        this.setupContainer.loadModules([[this.path+'/core/store/mainResolver.'+this.extension]])
    }
    getConfig() {
        if(this.setupContainer.has('config')){

            return this.setupContainer.resolve('config')
        }
        return this.config
    }
    _globalVariable: any = {  middlewares: {}, allowedControllers: {} };
    get globalVariable() {
        return this._globalVariable;
    }
    getController(module: string, action: string) {
        return this.getModule(module)[action];
    }
    //module middleware Getters
    getModuleInput(module: string): Function[] {
        return this._globalVariable.middlewares['inputModule'][module] || [];
    }
    getModuleOutput(module: string): Function[] {
        return this._globalVariable.middlewares['inputModule'][module] || [];
    }
    checkModuleAction(module: string, action: string) {
        //console.log(this._globalVariable.allowedControllers[module],module,action,this._globalVariable.allowedControllers[module].includes(action))
        console.log(this._globalVariable.allowedControllers)
        if (this._globalVariable.allowedControllers[module] && this._globalVariable.allowedControllers[module].includes(action)) {
           return true
       }
       if(!this._globalVariable.allowedControllers[module]){
        throw Error('Invalid Module')
       }else if(this._globalVariable.allowedControllers[module] && !this._globalVariable.allowedControllers[module].includes(action)){
        throw Error('Invalid  Action')
       }else{
        throw Error('Invalid Module  Or Action')
       }
       
   }
    // action middleware getters
    getActionInput(module: string, action: string) {
        return this._globalVariable.middlewares['inputAction ' + module + ' ' + action] || [];
    }
    getActionOutput(module: string, action: string) {
        return this._globalVariable.middlewares['outputAction ' + module + ' ' + action] || [];
    }
    setActionEndPoint(module: string, action: string) {
        if (!this._globalVariable.allowedControllers[module]) this._globalVariable.allowedControllers[module] = [];
        this._globalVariable.allowedControllers[module].push(action);
    }
    //
    //module setters
    setModuleInput(module: string, inputModule: any) {
        this._globalVariable.middlewares['inputModule'] = this._globalVariable.middlewares['inputModule'] ? this._globalVariable.middlewares['inputModule'] : {};
        this._globalVariable.middlewares['inputModule'][module] = inputModule
    }
    setModuleOutput(module: string, outputModule: any) {
        this._globalVariable.middlewares['outputModule'] = this._globalVariable.middlewares['outputModule'] ? this._globalVariable.middlewares['outputModule'] : {}
        this._globalVariable.middlewares['outputModule'][module] = outputModule
    }
    //action setters
    setActionInput(module: string, action: string, inputAction: any) {
        this._globalVariable.middlewares= this._globalVariable.middlewares ?this._globalVariable.middlewares:{}; 
        this._globalVariable.middlewares['inputAction ' + module + ' ' + action] = inputAction
    }
    setActionOuput(module: string, action: string, inputAction: any) {
        this._globalVariable.middlewares['outputAction ' + module + ' ' + action] = inputAction
    }
  
    setActionController(module: string, action: string, value: Function) {
        console.log(module, action)
        if (!this._globalVariable.controllers[module]) this._globalVariable.controllers[module] = {};
        this._globalVariable.controllers[module][action] = value;
    }

     
    getModule(module){
        return this.Businesscontainer.resolve(module)
    }
}
