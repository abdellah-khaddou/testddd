"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
var request = require('request');
class httpRequest {
    get(options) {
        //    return request({
        //        method:method,
        //        url:url,
        //        data:{
        //            ...body
        //        },
        //     //    headers: {'Content-Type': 'multipart/form-data' }
        //     }) 
        return request(options, function (error, response) {
            if (error)
                throw new Error('eroor' + error);
            // console.log('response',response);
        });
    }
}
exports.http = new httpRequest();
//# sourceMappingURL=httpRequest.js.map