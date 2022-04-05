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
const providers_1 = require("../../../core/store/providers");
const Middlewares_1 = require("./Middlewares");
const type_companies_1 = require("../companies/classes/type_companies");
let resourcesCtrl = class resourcesCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.moduleDB = options.resourcesRepository['resources'];
        this.moduleEnumValueDB = options.enumsvaluesRepository['enumsvalues'];
        this.moduleEnumDB = options.enumsRepository['enums'];
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res = [], enums;
        if (user.company.type == type_companies_1.TypesCompanies.admin && params.type == true) {
            let enuma = await this.moduleEnumDB.findOne({ name: params.name });
            enums = await this.moduleEnumValueDB.find({ enumeration: enuma._id });
            let resources = [];
            enums.forEach((el) => {
                resources.push(el.value);
            });
            res.push({ resources: resources });
        }
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            res = await this.moduleDB.find({ ...params });
        }
        else {
            delete params.type;
            delete params.name;
            res = await this.moduleDB.find({ ...params, companyType: user.company.type });
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
        let user = params.middleWareEffect.user;
        let info = params.middleWareEffect;
        delete params.middleWareEffect;
        if (user.company.type == type_companies_1.TypesCompanies.admin) {
            let res = await this.moduleDB.findOne({ companyType: params.companyType });
            if (res) {
                res.resources = params.resources;
                res.save();
                return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
            }
            else
                return super.save(params);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.methodNotAllowed, { error: "your companie not allowed this Methode or Module", info: info }, Response_1.ResponseDirection.outputSystem);
    }
};
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], resourcesCtrl.prototype, "seed", null);
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], resourcesCtrl.prototype, "search", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], resourcesCtrl.prototype, "delete", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], resourcesCtrl.prototype, "duplicate", null);
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], resourcesCtrl.prototype, "save", null);
resourcesCtrl = __decorate([
    (0, module_metadata_1.Module)({
        inputs: [
            (0, providers_1.getInjection)('resourcesRepository').resourcesSchema.getModuleValidator,
            Middlewares_1.middleware.authenticateUser,
            // middleware.hasPermission
        ]
    }),
    __metadata("design:paramtypes", [Object])
], resourcesCtrl);
exports.default = resourcesCtrl;
//# sourceMappingURL=Controller.js.map