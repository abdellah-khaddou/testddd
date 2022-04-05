"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Action_Input_1 = require("./Action.Input");
const Action_Output_1 = require("./Action.Output");
const controllerManager_1 = require("./controllerManager");
const Module_Input_1 = require("./Module.Input");
const Module_Output_1 = require("./Module.Output");
const System_Output_1 = require("./System.Output");
const Sytem_Input_1 = require("./Sytem.Input");
// const MainCtrlInstance = new MainCtrl();
function setRoutes(app, globalControllers) {
    //inputMiddlewares
    try {
        app.use((req, res, next) => Sytem_Input_1.InputSystem.getMiddleWares(req, res, next, globalControllers)); //middlewareInputSystem
        app.use((req, res, next) => Module_Input_1.InputModule.getMiddleWares(req, res, next, globalControllers)); //middlewareInputModule
        app.use((req, res, next) => Action_Input_1.InputAction.getMiddleWares(req, res, next, globalControllers)); //middlewareInputAction
        //route
        app.route('/').all((req, res, next) => controllerManager_1.controllerManagerInstance.getController(req, res, next, globalControllers));
        app.use((req, res, next) => Action_Output_1.OutputAction.getMiddleWares(req, res, next, globalControllers)); //middlewareInputModule
        app.use((req, res, next) => Module_Output_1.OutputModule.getMiddleWares(req, res, next, globalControllers)); //middlewareInputAction
        app.use((error, req, res, next) => System_Output_1.OutputSytem.handleErrors(error, req, res, next)); //middlewareOutputSystem
    }
    catch (error) {
        // app.use((error:any,req: any, res: any, next: any) => OutputSytem.handleErrors(error,req,res,next));//middlewareOutputSystem
    }
    // app.route('/').all((req: any, res: any, next: any) => MainCtrlInstance.getCtrl(req, res, next, globalControllers));
    //output Middlewares
    // app.use((req: any, res: any, next: any) => OutputAction.getMiddleWares(req, res, next, globalControllers)); //middlewareOutputAction
    // app.use((req: any, res: any, next: any) => OutputModule.getMiddleWares(req, res, next, globalControllers));//middlewareOutputModule
}
exports.default = setRoutes;
//# sourceMappingURL=index.js.map