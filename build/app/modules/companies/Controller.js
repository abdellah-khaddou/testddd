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
const user_service_1 = require("../users/user_service");
const Controller_2 = __importDefault(require("../users/Controller"));
const Middlewares_1 = require("./Middlewares");
const type_companies_1 = require("./classes/type_companies");
let companiesCtrl = class companiesCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.userService = new user_service_1.UserService();
        this.userCtrl = new Controller_2.default(options);
        this.moduleDB = options.companiesRepository["companies"];
        this.userModel = options.userRepository["user"];
        this.roleDB = options.roleRepository["role"];
        //this.userService=options.UserService
    }
    ;
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    async register(params) {
        var _a;
        // const { companie, user } = params;
        let role = await this.roleDB.findOne({ name: type_companies_1.TypesRoles.admin });
        let login = await this.userModel.find({ login: params.login });
        if (login.length > 0) {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.NotAcceptable, { message: "this logain exsiste" }, Response_1.ResponseDirection.outputSystem);
        }
        var companie = {
            name: params.name_companie,
            type: params.type,
            subdomain: params.subdomain,
            adresse: params.adresse,
            tel: params.tel_companie,
            email: params.email_companie,
            RC: params.RC,
            banque: params.banque,
            RIB: params.RIB,
            ville: params.ville,
            active: false
        };
        let res = await this.moduleDB.create({ ...companie });
        ;
        if (res) {
            var user = {
                name: params.name_user,
                login: params.login,
                password: params.password,
                company: res === null || res === void 0 ? void 0 : res._doc._id,
                companyName: (_a = res === null || res === void 0 ? void 0 : res._doc) === null || _a === void 0 ? void 0 : _a.name,
                tel: params.tel_user,
                role: type_companies_1.TypesRoles.admin,
                roleID: role === null || role === void 0 ? void 0 : role._id,
                cin: params.cin,
                email: params.email,
            };
            user.password = this.userService.hashPassword(user.password);
            res.createdBy = res === null || res === void 0 ? void 0 : res._doc._id;
            //let newuser = executeControllerAction.call();
            let userNew = await this.userModel.create({ ...user });
            let token = await this.userCtrl.generateToken({ _id: userNew._id });
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, token, Response_1.ResponseDirection.outputSystem);
        }
    }
    async search(params) {
        var _a;
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res = [];
        if (user.company.type == type_companies_1.TypesCompanies.admin) {
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
        }
        else {
            res = await this.moduleDB.find({ ...params, _id: (_a = user === null || user === void 0 ? void 0 : user.company) === null || _a === void 0 ? void 0 : _a._id });
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async delete(params) {
        let res = await this.moduleDB.findOneAndDelete({ _id: params._id });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let result;
        if (params._id) {
            if (user.company.type == type_companies_1.TypesCompanies.admin || user.company._id == params._id)
                result = await this.moduleDB.updateOne({ _id: params._id }, { ...params });
            else
                return new Response_1.formattedResponse(Response_1.ResponseStatus.unAuthorized, { error: "Not have Permission To Update Companies" }, Response_1.ResponseDirection.outputSystem);
        }
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            result = await this.moduleDB.create({ ...params });
        }
        else {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.unAuthorized, { error: "Not have Permission To Create Companies" }, Response_1.ResponseDirection.outputSystem);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
    }
};
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], companiesCtrl.prototype, "seed", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], companiesCtrl.prototype, "register", null);
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], companiesCtrl.prototype, "search", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], companiesCtrl.prototype, "delete", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], companiesCtrl.prototype, "duplicate", null);
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [Middlewares_1.middleware.authenticateUser]
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], companiesCtrl.prototype, "save", null);
companiesCtrl = __decorate([
    (0, module_metadata_1.Module)({
        inputs: [
            (0, providers_1.getInjection)("companiesRepository").companiesSchema.getModuleValidator,
            Middlewares_1.middleware.hasPermission
        ],
    }),
    __metadata("design:paramtypes", [Object])
], companiesCtrl);
exports.default = companiesCtrl;
//# sourceMappingURL=Controller.js.map