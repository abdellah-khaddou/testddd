"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleWareExecuter = void 0;
const Response_1 = require("../interfaces/Response");
function middleWareExecuter(middleware, Request, Response) {
    console.log(middleware);
    return middleware.reduce((previousMiddleware, middleware) => {
        return previousMiddleware.then(() => {
            return middleware(Request, Response);
        })
            .catch(error => Response.send(new Response_1.formattedResponse(Response_1.ResponseStatus.internalServerError, error, Response_1.ResponseDirection.outputSystem, Response_1.ResponseType.error)));
    }, Promise.resolve());
}
exports.middleWareExecuter = middleWareExecuter;
//# sourceMappingURL=middlewareExecuter.js.map