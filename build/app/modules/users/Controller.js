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
const TokenManager_1 = __importDefault(require("../../../helpers/TokenManager"));
const user_service_1 = require("./user_service");
const Middlewares_1 = require("./Middlewares");
const mongoose_1 = __importDefault(require("mongoose"));
const type_companies_1 = require("../companies/classes/type_companies");
const Model_1 = require("../permission/Model");
let usersCtrl = class usersCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.userService = new user_service_1.UserService();
        this.moduleDB = options.userRepository['user'];
        this.moduleresourceDB = options.resourcesRepository['resources'];
        this.modulePermissionDB = Model_1.Permission;
    }
    async seed(params) {
        let result = await this.moduleDB.create();
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res = [];
        if (user.company.type == type_companies_1.TypesCompanies.admin) {
            res = await this.moduleDB.find({ ...params }).populate('company');
        }
        else {
            res = await this.moduleDB.find({ ...params, company: user.company._id }).populate('company');
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
        //return super.search(params)
    }
    async delete(params) {
        let userToDelete = await this.moduleDB.find({ _id: params._id })
            .populate('company')
            .populate('espace');
        let userLogin = params.middleWareEffect.user;
        if (userToDelete.espace._id == userLogin.espace._id
            && userLogin.company._id == userLogin.espace.company) {
            let res = await this.moduleDB.findOneAndDelete({ _id: params._id });
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, "delete with success", Response_1.ResponseDirection.outputSystem);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, "premission denied", Response_1.ResponseDirection.outputSystem);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async one(params) {
        // let users = await this.moduleDB.find();
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { x: "info db" + mongoose_1.default.connection.readyState }, Response_1.ResponseDirection.outputSystem);
    }
    async updateAdresse(params) {
        let userLogin = params.middleWareEffect.user;
        let user = await this.moduleDB.findById(userLogin._id);
        if (user) {
            let existe = false;
            user.coordonnees.filter(cords => {
                if (cords.name == params.name) {
                    existe = true;
                    cords.coords = params.coords;
                }
                return cords;
            });
            if (!existe)
                user.coordonnees.push(params);
            user.save();
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, user.coordonnees, Response_1.ResponseDirection.outputSystem);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.methodNotAllowed, "premission denied", Response_1.ResponseDirection.outputSystem);
    }
    async deleteAdresse(params) {
        let userLogin = params.middleWareEffect.user;
        let user = await this.moduleDB.findById(userLogin._id);
        if (user) {
            user.coordonnees = user.coordonnees.filter(cords => (cords._id != params._id));
            user.save();
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, user.coordonnees, Response_1.ResponseDirection.outputSystem);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.methodNotAllowed, "premission denied", Response_1.ResponseDirection.outputSystem);
    }
    async updateFavoriter(params) {
        let userLogin = params.middleWareEffect.user;
        let user = await this.moduleDB.findById(userLogin._id);
        if (user) {
            let existe = false;
            let favs = user.favourites.filter(fav => {
                if (fav.product == params.product) {
                    existe = true;
                    return null;
                }
                return fav;
            });
            if (!existe)
                user.favourites.push({ product: params.product });
            if (existe)
                user.favourites = favs;
            user.save();
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, user.favourites, Response_1.ResponseDirection.outputSystem);
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.methodNotAllowed, "premission denied", Response_1.ResponseDirection.outputSystem);
    }
    async save(params) {
        let user = params.middleWareEffect.user;
        let result;
        if (params._id) {
            result = await this.moduleDB.updateOne({ _id: params._id }, { ...params });
        }
        else {
            params.password = this.userService.hashPassword(params.password);
            result = await this.moduleDB.create({ ...params });
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
    }
    // auth methods
    async login(params) {
        let { login, password } = params;
        const user = await this.moduleDB.findOne({ login: login });
        if (!user)
            return new Response_1.formattedResponse(Response_1.ResponseStatus.notFound, "error login", Response_1.ResponseDirection.outputSystem);
        let validePassword = this.userService.verifyPassword(password, user.password);
        //let validePassword = password == user.get("password");
        if (!validePassword)
            return new Response_1.formattedResponse(Response_1.ResponseStatus.notFound, "error password", Response_1.ResponseDirection.outputSystem);
        const token = await this.generateToken({ _id: user._id });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, token, Response_1.ResponseDirection.outputSystem);
        // return {header:"x-auth", token:token};
    }
    async generateToken(params) {
        let user = await this.moduleDB.findById(params._id).populate("company"); //change name company
        //next time find({_id:params._id},{password:0});
        return await TokenManager_1.default.generateToken(user === null || user === void 0 ? void 0 : user.toJSON());
    }
    async verifierToken(params) {
        const token = params.token;
        let obj = null;
        let user;
        if (token) {
            let userToken = await TokenManager_1.default.verifyToken(token);
            obj = await this.moduleDB.findOne({ _id: userToken === null || userToken === void 0 ? void 0 : userToken._id }).populate("company");
            if (userToken.password != obj.password) {
                return new Response_1.formattedResponse(Response_1.ResponseStatus.unAuthorized, { userToken, obj }, Response_1.ResponseDirection.outputSystem);
            }
            let resources = await this.moduleresourceDB.findOne({ companyType: obj.company.type });
            let permission = await this.modulePermissionDB.find({
                $or: [{ roleID: obj.roleID }, { userID: obj._id }]
            });
            user = { ...obj._doc, resources: [], permission: [] };
            user.resources = resources === null || resources === void 0 ? void 0 : resources.resources;
            user.permission = permission;
            user.password = null;
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { user }, Response_1.ResponseDirection.outputSystem);
    }
    async editPassword(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let canChangePassword = false;
        let newpassword;
        let message = "PASSWORD_EDIT_WITH_SUCCESS";
        console.log("pass user : ", params.password);
        const userModify = await this.moduleDB.findOne({ _id: params._id });
        if (!userModify) {
            message = "NO_USER_WITH_THIS_INFO";
        }
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            if (user.role == type_companies_1.TypesRoles.admin && user._id != (userModify === null || userModify === void 0 ? void 0 : userModify._id)) {
                newpassword = this.userService.hashPassword(params.password);
                canChangePassword = true;
            }
            else if (user._id == (userModify === null || userModify === void 0 ? void 0 : userModify._id)) {
                let validePassword = this.userService.verifyPassword(params.oldpassword, userModify === null || userModify === void 0 ? void 0 : userModify.password);
                if (validePassword) {
                    newpassword = this.userService.hashPassword(params.password);
                    canChangePassword = true;
                }
                else {
                    message = "NOT_IS_OLD_PASSWORD";
                }
            }
            else if ((userModify === null || userModify === void 0 ? void 0 : userModify.company.type) != type_companies_1.TypesCompanies.admin) {
                newpassword = this.userService.hashPassword(params.password);
                canChangePassword = true;
            }
            else {
                message = "DONT_HAVE_PERMISSION";
            }
        }
        else {
            if (userModify && (userModify === null || userModify === void 0 ? void 0 : userModify.company._id) == user.company._id) {
                if (user.role == type_companies_1.TypesRoles.admin && user._id != (userModify === null || userModify === void 0 ? void 0 : userModify._id)) {
                    newpassword = this.userService.hashPassword(params.password);
                    canChangePassword = true;
                }
                else if (user._id == (userModify === null || userModify === void 0 ? void 0 : userModify._id)) {
                    let validePassword = await this.userService.verifyPassword(params.oldpassword, userModify === null || userModify === void 0 ? void 0 : userModify.password);
                    if (validePassword) {
                        newpassword = this.userService.hashPassword(params.password);
                        canChangePassword = true;
                    }
                    else {
                        message = "NOT_IS_OLD_PASSWORD";
                    }
                }
                else {
                    message = "DONT_HAVE_PERMISION";
                }
            }
            else {
                message = "DONT_HAVE_PERMISION";
            }
        }
        if (canChangePassword) {
            console.log("pass has : ", newpassword);
            let result = await this.moduleDB.updateOne({ _id: params._id }, {
                password: newpassword,
            });
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { message, result }, Response_1.ResponseDirection.outputSystem);
        }
        else {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.NotAcceptable, { message }, Response_1.ResponseDirection.outputSystem);
        }
    }
};
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [Middlewares_1.middleware.authenticateUser],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "seed", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.authenticateUser] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "search", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.isEspaceAdmin] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "delete", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "duplicate", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "one", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.authenticateUser] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "updateAdresse", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.authenticateUser] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "deleteAdresse", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.authenticateUser] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "updateFavoriter", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.authenticateUser] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "save", null);
__decorate([
    (0, action_metadata_1.endPoint)({
        inputs: [],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "login", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "verifierToken", null);
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.middleware.authenticateUser] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], usersCtrl.prototype, "editPassword", null);
usersCtrl = __decorate([
    (0, module_metadata_1.Module)({
        inputs: [(0, providers_1.getInjection)('userRepository').userSchema.getModuleValidator],
        outputs: []
    }),
    __metadata("design:paramtypes", [Object])
], usersCtrl);
exports.default = usersCtrl;
//# sourceMappingURL=Controller.js.map