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
const type_companies_1 = require("../companies/classes/type_companies");
const Middlewares_1 = require("./Middlewares");
const Model_1 = require("./Model");
let permissionCtrl = class permissionCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.moduleDB = Model_1.Permission;
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res = [];
        console.log(params, params.roleID);
        if (params.roleID || params.userID) {
            res = await this.moduleDB.aggregate([
                { $match: { $or: [{ roleID: params.roleID }, { userID: params.userID }] } },
            ]);
        }
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            res = await this.moduleDB.aggregate([
                { $match: { ...params } },
                { $match: { $or: [{ roleID: user.roleID }, { userID: user._id }] } },
            ]);
        }
        else {
            res = await this.moduleDB.aggregate([
                { $match: { ...params } },
                { $match: { $or: [{ roleID: user.roleID }, { userID: user._id }] } },
            ]);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
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
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], permissionCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], permissionCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], permissionCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], permissionCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], permissionCtrl.prototype, "save", null);
permissionCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [
            Middlewares_1.middleware.authenticateUser,
            Model_1.permissionSchema.getModuleValidator
        ]
    }),
    __metadata("design:paramtypes", [Object])
], permissionCtrl);
exports.default = permissionCtrl;
//# sourceMappingURL=Controller.js.map