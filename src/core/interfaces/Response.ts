export class formattedResponse {
    public status: ResponseStatus;
    public value: any;
    public type: ResponseType;
    public headed: ResponseDirection;
    public responseHeader?: any;

    constructor(
        private _status: ResponseStatus,
        private _value: any,
        private _headed?: ResponseDirection,
        private _type?: ResponseType,
        private _responseHeader?: any
    ) {

        this.status = this._status;
        this.value = this._value;
        this.type = this._type || ResponseType.json;
        this.headed = this._headed || ResponseDirection.outputSystem;
        this.responseHeader = this._responseHeader;

    }



}
export enum ResponseDirection {
    inputAction = 'inputAction',
    inputModule = 'inputModule',
    inputSystem = 'inputSystem',
    outputAction = 'outputAction',
    outputModule = 'outputModule',
    outputSystem = 'outputSystem',
    controller = 'controller'
}
export enum ResponseStatus {
    succes = 200,
    badRequest = 400,
    unAuthorized = 401,

    notFound = 404,
    Forbidden = 403,
    NotAcceptable = 406,
    methodNotAllowed = 405,

    notImplemented = 501,
    gateWayTimeOut = 504,
    internalServerError = 500
}
export enum ResponseType {
    json = 'json',
    file = "file",
    tocsv = "csv",
    zipFiles = "zipFiles",
    string = "string",
    error = "error",
}