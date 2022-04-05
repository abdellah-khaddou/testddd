"use strict";
// import { GlobalVariable } from "../..";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleWare = void 0;
function middleWare(metadata) {
    return (target, propertyKey, descriptor) => {
        //   console.log(metadata.inputs);
        //   if(!metadata.inputs)metadata.inputs=  [userMiddlewareInstance.authenticateUser]
        //   GlobalVariable.setActionInput(target.constructor.name.replace('Ctrl',''),propertyKey,metadata.inputs)
        //   GlobalVariable.setActionOuput(target.constructor.name.replace('Ctrl',''),propertyKey,metadata.outputs)
    };
}
exports.middleWare = middleWare;
//# sourceMappingURL=middleware.metadata.js.map