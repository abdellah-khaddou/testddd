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
let marketsCtrl = class marketsCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.moduleDB = options.marketsRepository['markets'];
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
    }
    async create(params) {
        var res;
        // if(params._id && params.name){
        //     res = await this.moduleDB.updateOne(
        //         { _id: params.id },
        //         { name:params.name }
        //       );
        // }else{
        //     res = await this.moduleDB.create({name:params.name});
        // }
        return this.save(params);
        //return  new formattedResponse(ResponseStatus.succes, res , ResponseDirection.outputSystem)
    }
    async searchPaginationProduct(params) {
        return this.searchPagination(params, "procucts");
    }
    async searchPaginationService(params) {
        return this.searchPagination(params, "service");
    }
    async searchPagination(params, type) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res;
        let event = this.filterAndSort(params.event);
        delete params.event;
        res = await this.moduleDB.aggregate([
            {
                $match: { ...params, type: type },
            },
            {
                $match: { ...event === null || event === void 0 ? void 0 : event.filters },
            },
            {
                $facet: {
                    totalCount: [
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    markets: [
                        {
                            $match: { ...params },
                        },
                        {
                            $match: { ...event === null || event === void 0 ? void 0 : event.filters },
                        },
                        {
                            $sort: event.multiSortMeta,
                        },
                        {
                            $skip: event.first,
                        },
                        {
                            $limit: event.rows,
                        },
                    ],
                },
            },
        ]);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async saveProduct(params) {
        params.type = "procucts";
        return this.save(params);
    }
    async saveService(params) {
        params.type = "service";
        return this.save(params);
    }
    async get(params) {
        let markets;
        if (params.name) {
            markets = await this.moduleDB.find({ 'name': params.name });
        }
        else {
            markets = await this.moduleDB.find();
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { markets }, Response_1.ResponseDirection.outputSystem);
    }
    async update(params) {
        if (params.id && params.name) {
            await this.moduleDB.updateOne({ _id: params._id }, { name: params.name });
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { res: "data update success" }, Response_1.ResponseDirection.outputSystem);
    }
    async delete(params) {
        let user = params.middleWareEffect.user;
        let res;
        delete params.middleWareEffect;
        if (params._id) {
            await this.moduleDB.deleteOne({ _id: params._id });
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { res: "data delted success" }, Response_1.ResponseDirection.outputSystem);
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res = await this.moduleDB.find({ ...params });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
        //return super.search(params)
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
], marketsCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "create", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "searchPaginationProduct", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "searchPaginationService", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "searchPagination", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "saveProduct", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "saveService", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "get", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "update", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], marketsCtrl.prototype, "save", null);
marketsCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [providers_1.getInjection('marketsRepository').marketsSchema.getModuleValidator]
    }),
    __metadata("design:paramtypes", [Object])
], marketsCtrl);
exports.default = marketsCtrl;
//# sourceMappingURL=Controller.js.map