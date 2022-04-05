"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const events_1 = require("events");
const awilix = require('awilix');
const path_1 = require("path");
class Store extends events_1.EventEmitter {
    constructor() {
        super();
        this.path = __dirname.split(path_1.sep)[__dirname.split(path_1.sep).length - 3];
        this.extension = this.path === 'build' ? 'js' : 'ts';
        this.config = {
            staticPath: '',
            port: 3001
        };
        this._globalVariable = { middlewares: {}, allowedControllers: {} };
        this.Businesscontainer = awilix.createContainer({});
        this.setupContainer = awilix.createContainer({});
        this.once('saveConfig', config => {
            this.setupContainer.register('config', awilix.asValue(config));
        });
        this.once('expressApp', (app) => this.setupContainer.register('app', awilix.asValue(app)));
        this.on('registerModule', (moduleContstructor) => {
            this.Businesscontainer.register(moduleContstructor.name, awilix.asClass(moduleContstructor).singleton());
        });
        this.on('registerService', (moduleContstructor) => {
            this.Businesscontainer
                .register(moduleContstructor.name, awilix
                .asClass(moduleContstructor).singleton());
            this.Businesscontainer.cradle[moduleContstructor.name];
        });
        this.once('bootstrapRequirement', ({ name, value }) => {
            this.setupContainer.register(name, awilix.asValue(value));
        });
        this.on('registerRepository', (moduleContstructor) => {
            this.Businesscontainer.register(moduleContstructor.name, awilix.asClass(moduleContstructor).singleton());
        });
    }
    initializeModules() {
        this.setup();
        this.Businesscontainer.loadModules([[this.path + '/core/core-modules/*/Model.' + this.extension, { register: awilix.asClass }]]);
        this.Businesscontainer.loadModules([[this.path + '/core/core-modules/*/Controller.' + this.extension, { register: awilix.asClass }]]);
        this.Businesscontainer.loadModules([[this.path + '/app/modules/**/Model.' + this.extension, { register: awilix.asClass }]]);
        this.Businesscontainer.loadModules([[this.path + '/app/modules/**/Controller.' + this.extension, { register: awilix.asClass }]]);
        this.Businesscontainer.loadModules([[this.path + '/app/modules/**/Service.' + this.extension, { register: awilix.asClass }]]);
        this.Businesscontainer.loadModules([[this.path + '/app/modules/**/Middleware.' + this.extension, { register: awilix.asClass }]]);
    }
    setup() {
        this.setupContainer.loadModules([[this.path + '/core/store/mainResolver.' + this.extension]]);
    }
    getConfig() {
        if (this.setupContainer.has('config')) {
            return this.setupContainer.resolve('config');
        }
        return this.config;
    }
    get globalVariable() {
        return this._globalVariable;
    }
    getController(module, action) {
        return this.getModule(module)[action];
    }
    //module middleware Getters
    getModuleInput(module) {
        return this._globalVariable.middlewares['inputModule'][module] || [];
    }
    getModuleOutput(module) {
        return this._globalVariable.middlewares['inputModule'][module] || [];
    }
    checkModuleAction(module, action) {
        //console.log(this._globalVariable.allowedControllers[module],module,action,this._globalVariable.allowedControllers[module].includes(action))
        console.log(this._globalVariable.allowedControllers);
        if (this._globalVariable.allowedControllers[module] && this._globalVariable.allowedControllers[module].includes(action)) {
            return true;
        }
        if (!this._globalVariable.allowedControllers[module]) {
            throw Error('Invalid Module');
        }
        else if (this._globalVariable.allowedControllers[module] && !this._globalVariable.allowedControllers[module].includes(action)) {
            throw Error('Invalid  Action');
        }
        else {
            throw Error('Invalid Module  Or Action');
        }
    }
    // action middleware getters
    getActionInput(module, action) {
        return this._globalVariable.middlewares['inputAction ' + module + ' ' + action] || [];
    }
    getActionOutput(module, action) {
        return this._globalVariable.middlewares['outputAction ' + module + ' ' + action] || [];
    }
    setActionEndPoint(module, action) {
        if (!this._globalVariable.allowedControllers[module])
            this._globalVariable.allowedControllers[module] = [];
        this._globalVariable.allowedControllers[module].push(action);
    }
    //
    //module setters
    setModuleInput(module, inputModule) {
        this._globalVariable.middlewares['inputModule'] = this._globalVariable.middlewares['inputModule'] ? this._globalVariable.middlewares['inputModule'] : {};
        this._globalVariable.middlewares['inputModule'][module] = inputModule;
    }
    setModuleOutput(module, outputModule) {
        this._globalVariable.middlewares['outputModule'] = this._globalVariable.middlewares['outputModule'] ? this._globalVariable.middlewares['outputModule'] : {};
        this._globalVariable.middlewares['outputModule'][module] = outputModule;
    }
    //action setters
    setActionInput(module, action, inputAction) {
        this._globalVariable.middlewares = this._globalVariable.middlewares ? this._globalVariable.middlewares : {};
        this._globalVariable.middlewares['inputAction ' + module + ' ' + action] = inputAction;
    }
    setActionOuput(module, action, inputAction) {
        this._globalVariable.middlewares['outputAction ' + module + ' ' + action] = inputAction;
    }
    setActionController(module, action, value) {
        console.log(module, action);
        if (!this._globalVariable.controllers[module])
            this._globalVariable.controllers[module] = {};
        this._globalVariable.controllers[module][action] = value;
    }
    getModule(module) {
        return this.Businesscontainer.resolve(module);
    }
}
exports.Store = Store;
//# sourceMappingURL=Bootstrap.js.map