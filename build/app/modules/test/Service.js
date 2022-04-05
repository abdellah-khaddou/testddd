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
exports.networksService = void 0;
const Service_metadata_1 = require("../../../core/metadata/Service.metadata");
let networksService = class networksService {
    constructor(options) {
        this.mainResolver = options.appResolver;
        this.networksCtrl = options.networksCtrl;
        this.mainResolver.addListener('networks', async ({ response, action, module, params }) => {
            //handling action with function from the controllers
            if (this.networksCtrl[action] && typeof this.networksCtrl[action] === 'function')
                return response(await this.networksCtrl[action](params));
            //handle other actions
            return response(action + " not implemented in " + module);
        });
    }
};
networksService = __decorate([
    Service_metadata_1.Service(),
    __metadata("design:paramtypes", [Object])
], networksService);
exports.networksService = networksService;
//# sourceMappingURL=Service.js.map