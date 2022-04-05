
// import MainCtrl from './mainCtrl';
import Express from 'express'
import { InputAction } from "./Action.Input";
import { OutputAction } from './Action.Output';
import { controllerManagerInstance } from "./controllerManager";
import { InputModule } from "./Module.Input";
import { OutputModule } from './Module.Output';
import { OutputSytem } from "./System.Output";
import { InputSystem } from "./Sytem.Input";

// const MainCtrlInstance = new MainCtrl();
export default function setRoutes(app: Express.Application, globalControllers: any) {
    //inputMiddlewares

        try {
           

            app.use((req: any, res: any, next: any) => InputSystem.getMiddleWares(req, res, next, globalControllers));//middlewareInputSystem
            app.use((req: any, res: any, next: any) => InputModule.getMiddleWares(req, res, next, globalControllers));//middlewareInputModule
            app.use((req: any, res: any, next: any) => InputAction.getMiddleWares(req, res, next, globalControllers));//middlewareInputAction
            //route
            app.route('/').all((req:any,res:any,next:any)=>controllerManagerInstance.getController(req,res,next,globalControllers));

            app.use((req: any, res: any, next: any) => OutputAction.getMiddleWares(req, res, next, globalControllers));//middlewareInputModule
            app.use((req: any, res: any, next: any) => OutputModule.getMiddleWares(req, res, next, globalControllers));//middlewareInputAction

            app.use((error:any,req: any, res: any, next: any) => OutputSytem.handleErrors(error,req,res,next));//middlewareOutputSystem
        } catch (error) {
            // app.use((error:any,req: any, res: any, next: any) => OutputSytem.handleErrors(error,req,res,next));//middlewareOutputSystem

        }

    // app.route('/').all((req: any, res: any, next: any) => MainCtrlInstance.getCtrl(req, res, next, globalControllers));
    //output Middlewares
    // app.use((req: any, res: any, next: any) => OutputAction.getMiddleWares(req, res, next, globalControllers)); //middlewareOutputAction
    // app.use((req: any, res: any, next: any) => OutputModule.getMiddleWares(req, res, next, globalControllers));//middlewareOutputModule

}

