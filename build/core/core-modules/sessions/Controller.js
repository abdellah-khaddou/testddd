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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = __importDefault(require("../../../core/base/Controller"));
const Response_1 = require("../../../core/interfaces/Response");
const action_metadata_1 = require("../../../core/metadata/action.metadata");
const module_metadata_1 = require("../../../core/metadata/module.metadata");
const Model_1 = require("./Model");
let sessionsCtrl = class sessionsCtrl extends Controller_1.default {
    constructor() {
        super(...arguments);
        this.moduleDB = Model_1.Sessions;
    }
    // @endPoint({ inputs: [midExample] })
    // async seed(params:any) {
    //     let result = await this.mainModel.create({})
    //     return new formattedResponse(ResponseStatus.succes, { result }, ResponseDirection.outputSystem)
    // }
    async registerSession(params) {
        let session = await this.moduleDB.create(params);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, session, Response_1.ResponseDirection.outputSystem);
    }
    async removeSessions(params) {
        let deletedSession = await this.moduleDB.deleteOne(params);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, deletedSession, Response_1.ResponseDirection.outputSystem);
    }
    async search(params) {
        return super.search(params);
    }
    async delete(params) {
        return super.delete(params);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        return super.save(params);
    }
};
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], sessionsCtrl.prototype, "registerSession", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], sessionsCtrl.prototype, "removeSessions", null);
sessionsCtrl = __decorate([
    (0, module_metadata_1.Module)({
        inputs: [Model_1.sessionsSchema.getModuleValidator]
    })
], sessionsCtrl);
exports.default = sessionsCtrl;
//# sourceMappingURL=Controller.js.map