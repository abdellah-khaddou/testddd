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
const module_metadata_1 = require("../../../core/metadata/module.metadata");
const Controller_1 = __importDefault(require("../../../core/base/Controller"));
const Response_1 = require("../../../core/interfaces/Response");
const action_metadata_1 = require("../../../core/metadata/action.metadata");
const providers_1 = require("../../../core/store/providers");
let enum_valueCtrl = class enum_valueCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.moduleDB = options.enumsvaluesRepository['enumsvalues'];
        this.moduleDBEnum = options.enumsRepository['enums'];
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
    }
    async create(params) {
        // var enu:any;
        // var res:any;
        // if(!params._id){
        //     enu = await this.moduleDBEnum.find({name:params.name});
        //    res= await  this.moduleDB.create({ value: params.value, EnumID: enu[0]._id })
        //     return  new formattedResponse(ResponseStatus.succes, res , ResponseDirection.outputSystem)
        // }else{
        //     this.update()
        // }
        return this.save(params);
        // return  new formattedResponse(ResponseStatus.notImplemented, "errorr is hapen" , ResponseDirection.outputSystem)
    }
    async get(params) {
        let enumsvalues;
        if (params.name) {
            let enu = await this.moduleDBEnum.find({ name: params.name });
            enumsvalues = await this.moduleDB.find({ 'EnumID': enu[0]._id });
        }
        else {
            enumsvalues = await this.moduleDB.find();
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { enumsvalues }, Response_1.ResponseDirection.outputSystem);
    }
    async update(params) {
        if (params._id && params.value) {
            await this.moduleDB.updateOne({ _id: params._id }, { value: params.value });
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { res: "data update success" }, Response_1.ResponseDirection.outputSystem);
    }
    async delete(params) {
        let user = params.middleWareEffect.user;
        let res;
        delete params.middleWareEffect;
        if (params._id) {
            await this.moduleDB.deleteOne({ _id: params.id });
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { res: "data delted success" }, Response_1.ResponseDirection.outputSystem);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "data not delted success" }, Response_1.ResponseDirection.outputSystem);
    }
    async search(params) {
        let enumsvalue = await this.moduleDB.find();
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, enumsvalue, Response_1.ResponseDirection.outputSystem);
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
], enum_valueCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "create", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "get", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "update", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], enum_valueCtrl.prototype, "save", null);
enum_valueCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [providers_1.getInjection('enumsvaluesRepository').enumsvaluesSchema.getModuleValidator]
    }),
    __metadata("design:paramtypes", [Object])
], enum_valueCtrl);
exports.default = enum_valueCtrl;
//# sourceMappingURL=Controller.js.map