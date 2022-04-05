"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientshistoryService = void 0;
const Service_metadata_1 = require("../../../core/metadata/Service.metadata");
let clientshistoryService = class clientshistoryService {
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.clientshistoryCtrl = options.clientshistoryCtrl;
        this.mainResolver.addListener('clientshistory', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.clientshistoryCtrl[action] && typeof this.clientshistoryCtrl[action] === 'function')
                return response(await this.clientshistoryCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module);
        });
    }
};
clientshistoryService = __decorate([
    Service_metadata_1.Service(),
    __metadata("design:paramtypes", [Object])
], clientshistoryService);
exports.clientshistoryService = clientshistoryService;
//# sourceMappingURL=Service.js.map