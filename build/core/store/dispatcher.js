"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeControllerAction = void 0;
const providers_1 = require("./providers");
const random_1 = require("../../helpers/random");
function executeControllerAction(options) {
    let appResolver = (0, providers_1.getInjection)('appResolver');
    let actionId = new Date().getTime() + ' ' + random_1.randomInstance.makeid(8);
    let response = (eventResponse) => {
        appResolver.emit(actionId, eventResponse);
    };
    let promiseAction = new Promise((resolve, reject) => {
        let resolved = false;
        appResolver.on(actionId, (response) => {
            resolved = true;
            resolve(response);
        });
        setTimeout(() => {
            if (resolved === false)
                reject('no response was provided in time');
        }, 30000);
    });
    // le
    appResolver.emit(options.module, { ...options, response });
    //console.log('before promise')
    return promiseAction;
}
exports.executeControllerAction = executeControllerAction;
// action => mainResolver => moduleResolver => dispatcher
// sendaction
// respond to action 
//# sourceMappingURL=dispatcher.js.map