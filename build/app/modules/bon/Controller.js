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
const type_companies_1 = require("../companies/classes/type_companies");
const Middlewares_1 = require("./Middlewares");
let bonCtrl = class bonCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.moduleDB = options.bonRepository['bon'];
        this.colisModel = options.colisRepository['colis'];
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res;
        if ((user === null || user === void 0 ? void 0 : user.company.type) == type_companies_1.TypesCompanies.admin) {
            res = await this.moduleDB.find({ ...params }).populate("company");
        }
        else if ((user === null || user === void 0 ? void 0 : user.company.type) == type_companies_1.TypesCompanies.vendeur) {
            res = await this.moduleDB.find({ ...params, company: user.company._id }).populate("company");
        }
        else if ((user === null || user === void 0 ? void 0 : user.company.type) == type_companies_1.TypesCompanies.livreur) {
            res = await this.moduleDB.find({ ...params, company: user.company._id }).populate("company");
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async getColisInBon(params) {
        let res;
        try {
            res = await this.moduleDB.aggregate([
                { $addFields: { bonID: { $toObjectId: params.bon._id } } },
                { $match: { $expr: { $eq: ["$_id", "$bonID"] } } },
                {
                    $unwind: "$colis"
                },
                {
                    $lookup: {
                        from: "colis",
                        let: {
                            idcolis: {
                                $convert: {
                                    input: "$colis",
                                    to: "objectId",
                                    onError: "",
                                    onNull: "",
                                },
                            },
                        },
                        pipeline: [
                            { $match: { $expr: { $eq: ["$_id", "$$idcolis"] } } },
                            { $project: { ...params.project } }
                        ],
                        as: "colisInBon",
                    },
                },
                {
                    $unwind: "$colisInBon"
                },
                {
                    $group: {
                        _id: "$_id",
                        "colisInBon": {
                            "$push": "$colisInBon"
                        }
                    }
                }
            ]);
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
        }
        catch (exception) {
            console.error("getColisInBon Exception:", exception);
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, exception, Response_1.ResponseDirection.outputSystem);
        }
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
    async saveByStatus(params) {
        if (!params.colis && params.colis.length < 1)
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "pas de colis" }, Response_1.ResponseDirection.outputSystem);
        let code = await this.genereateCode(params.type);
        let status = "NON_ENVOYE";
        if (params.type == "BL") {
            status = "ENVOYE";
        }
        let bon = {
            code: code || "BL-12345",
            type: params.type,
            company: params.companyID,
            colis: [],
            status: status,
            network: params.network,
            createdAt: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }))
        };
        let coisIds = params.colis.map(coli => coli._id);
        bon.colis.push(...coisIds); //...params.colis
        if (code)
            return this.moduleDB.create({ ...bon });
        else
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "pas de code" }, Response_1.ResponseDirection.outputSystem);
    }
    async save(params) {
        //return new formattedResponse(ResponseStatus.badRequest, {error:params}, ResponseDirection.outputSystem);
        if (params.colis.length < 1)
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "pas de colis" }, Response_1.ResponseDirection.outputSystem);
        let code;
        do {
            code = await this.genereateCode(params.type);
        } while (!code);
        let status = "NON_ENVOYE";
        if (params.type == "BL") {
            status = "ENVOYE";
        }
        let bon = {
            code: code || "BL-12345",
            type: params.type,
            company: params.companyID,
            colis: [],
            status: status
        };
        let coisIds = params.colis.map(coli => coli._id);
        bon.colis.push(...coisIds); //...params.colis
        if (code)
            return super.save(bon);
        else
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "pas de code" }, Response_1.ResponseDirection.outputSystem);
    }
    async genereateCode(type) {
        let str = type + "-";
        let count = await this.moduleDB.count({});
        str += (count + 1).toString();
        return str;
    }
};
__decorate([
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], bonCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], bonCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], bonCtrl.prototype, "getColisInBon", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], bonCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], bonCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], bonCtrl.prototype, "save", null);
bonCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [
            providers_1.getInjection('bonRepository').bonSchema.getModuleValidator,
            Middlewares_1.middleware.authenticateUser,
        ]
    }),
    __metadata("design:paramtypes", [Object])
], bonCtrl);
exports.default = bonCtrl;
//# sourceMappingURL=Controller.js.map