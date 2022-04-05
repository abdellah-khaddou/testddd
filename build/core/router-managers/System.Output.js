"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputSytem = exports.OutputSytemClass = void 0;
const Response_1 = require("../interfaces/Response");
class OutputSytemClass {
    sendResponse(res, response) {
        //  let Response:requestFormat = res.
        if (response.type === Response_1.ResponseType.json) {
            return res.status(response.status).json(response.value);
        }
        if (response.type === Response_1.ResponseType.error) {
            // this.handleErrors()
            console.error(response.value);
            if (process.env.NODE_ENV === 'developement') {
                let element = response.value;
                return res.status(response.status).send({ name: element.name, stack: element.stack, message: element.message });
            }
            else {
                let element = response.value;
                return res.status(response.status).send({ name: element.name, stack: element.stack, message: element.message });
                //return res.status(ResponseStatus.notImplemented).send('Method Not Found')
            }
        }
        if (response.type === 'file') {
            return res.status(response.status).sendFile(response.value);
        }
        if (response.type === Response_1.ResponseType.tocsv) {
            res.header('Content-Type', 'text/csv');
            res.attachment('file.csv');
            return res.send(response.value);
        }
        if (response.type === 'zipFiles') {
            return res.status(response.status).zip({ files: response.value });
        }
        return res.status(Response_1.ResponseStatus.internalServerError).send('Something Went Wrong');
    }
    handleErrors(error, req, res, next) {
        console.error(error);
        if (!res.headersSent) {
            if (process.env.NODE_ENV === 'developement') {
                let element = error;
                return res.status(Response_1.ResponseStatus.internalServerError).send({ name: element.name, stack: element.stack, message: element.message });
            }
            else {
                return res.status(Response_1.ResponseStatus.notImplemented).send('Method Not Found');
            }
            // return res.status(ResponseStatus.notImplemented).send('Method Not Found')
        }
    }
}
exports.OutputSytemClass = OutputSytemClass;
exports.OutputSytem = new OutputSytemClass();
//# sourceMappingURL=System.Output.js.map