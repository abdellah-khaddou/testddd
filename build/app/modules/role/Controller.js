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
const Model_1 = require("../permission/Model");
const Middlewares_1 = require("./Middlewares");
let roleCtrl = class roleCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.modulePermissionDB = Model_1.Permission;
        this.moduleDB = options.roleRepository['role'];
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res;
        res = await this.moduleDB.find({ ...params, "$or": [{ company: "all" }, { company: user.company._id }] });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async delete(params) {
        return super.delete(params);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        var _a;
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let role;
        if (params._id) {
            role = await this.moduleDB.updateOne({ _id: (params._id) }, { ...params });
            await this.modulePermissionDB.deleteMany({ roleID: params._id });
        }
        else {
            role = await this.moduleDB.create({ ...params, company: user.company._id });
        }
        let permissions = [];
        await ((_a = params.permission) === null || _a === void 0 ? void 0 : _a.filter(el => {
            permissions.push({ userID: "null", roleID: params._id || role._id, company: user.company._id, permission: el });
        }));
        let per = await this.modulePermissionDB.insertMany(permissions);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { role, per, permissions, params }, Response_1.ResponseDirection.outputSystem);
    }
};
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], roleCtrl.prototype, "seed", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], roleCtrl.prototype, "search", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], roleCtrl.prototype, "delete", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], roleCtrl.prototype, "duplicate", null);
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], roleCtrl.prototype, "save", null);
roleCtrl = __decorate([
    (0, module_metadata_1.Module)({
        inputs: [
            (0, providers_1.getInjection)('roleRepository').roleSchema.getModuleValidator,
            Middlewares_1.middleware.authenticateUser,
            // middleware.hasPermission
        ]
    }),
    __metadata("design:paramtypes", [Object])
], roleCtrl);
exports.default = roleCtrl;
//# sourceMappingURL=Controller.js.map