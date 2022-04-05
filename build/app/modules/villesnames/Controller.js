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
let villesnamesCtrl = class villesnamesCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.moduleDB = options.villesnamesRepository['villesnames'];
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        let res;
        delete params.middleWareEffect;
        res = await this.moduleDB.aggregate([
            {
                $addFields: {
                    _id: {
                        $toString: "$_id"
                    }
                }
            },
            {
                $match: { ...params },
            },
            {
                $lookup: {
                    from: "networks",
                    let: {
                        idhub: {
                            $convert: {
                                input: "$hubID",
                                to: "objectId",
                                onError: "",
                                onNull: "",
                            },
                        },
                    },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$idhub"] } } },
                    ],
                    as: "HubLivreur",
                },
            },
        ]);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
        //} 
        //return new formattedResponse(ResponseStatus.methodNotAllowed, user.company.type == TypesCompanies.admin, ResponseDirection.outputSystem)
    }
    async delete(params) {
        let user = params.middleWareEffect.user;
        let res;
        delete params.middleWareEffect;
        return super.delete(params);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        return super.save(params);
    }
    async distinct(params) {
        let res = await this.moduleDB.distinct("ville_depart");
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
};
__decorate([
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], villesnamesCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], villesnamesCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], villesnamesCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], villesnamesCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], villesnamesCtrl.prototype, "save", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], villesnamesCtrl.prototype, "distinct", null);
villesnamesCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [
            providers_1.getInjection('villesnamesRepository').villesnamesSchema.getModuleValidator,
            Middlewares_1.middleware.authenticateUser,
        ]
    }),
    __metadata("design:paramtypes", [Object])
], villesnamesCtrl);
exports.default = villesnamesCtrl;
//# sourceMappingURL=Controller.js.map