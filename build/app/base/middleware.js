"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middlewares = void 0;
const Response_1 = require("../../core/interfaces/Response");
const TokenManager_1 = __importDefault(require("../../helpers/TokenManager"));
const Model_1 = require("../../app/modules/permission/Model");
const type_companies_1 = require("../../app/modules/companies/classes/type_companies");
class Middlewares {
    async authenticateUser(req, res) {
        if (req.headerToken) {
            if (TokenManager_1.default.verifyToken(req.headerToken)) {
                let user = await TokenManager_1.default.decoreToken(req.headerToken);
                return req.addProperty("user", user);
            }
        }
        let r = new Response_1.formattedResponse(Response_1.ResponseStatus.succes, "are you not auth ", Response_1.ResponseDirection.outputSystem);
        return res.send(r); //is undfined
    }
    static getStringOfPermission(req) {
        let action = req.Action.toString();
        let module = req.Module.toString();
        if (action.toLowerCase() == "search") {
            return "read-" + module.toLowerCase();
        }
        else if (action.toLowerCase() == "delete") {
            return "delete-" + module;
        }
        else if (action.toLowerCase() == "save") {
            if (req.body._id) {
                return "update-" + module;
            }
            else {
                return "create-" + module;
            }
        }
        return "null";
    }
    async hasPermission(req, res) {
        let per = Middlewares.getStringOfPermission(req);
        let permissionDB = Model_1.Permission;
        let permissions;
        if (req.headerToken && TokenManager_1.default.verifyToken(req.headerToken)) {
            let user = await TokenManager_1.default.decoreToken(req.headerToken);
            if (per != "null" && user.role != type_companies_1.TypesRoles.admin) {
                permissions = await permissionDB.find({
                    permission: per,
                    $or: [{ roleID: user.roleID }, { userID: user._id }],
                    company: user.company._id
                });
            }
            else {
                return req;
            }
            if (permissions.length != 0)
                return req;
        }
        let r = new Response_1.formattedResponse(Response_1.ResponseStatus.methodNotAllowed, { per, permissions }, Response_1.ResponseDirection.outputSystem);
        return res.send(r);
    }
    async isEspaceAdmin(req, res) {
        if (req.headerToken) {
            if (TokenManager_1.default.verifyToken(req.headerToken)) {
                let user = await TokenManager_1.default.decoreToken(req.headerToken);
                if (user.company.type == "Administrateur" ||
                    user.company._id == user.espace.Company)
                    return req.addProperty("user", user);
            }
        }
        let r = new Response_1.formattedResponse(Response_1.ResponseStatus.succes, "premission denied not Admin Espace" + JSON.stringify(req), Response_1.ResponseDirection.outputSystem);
        return res.send(r);
        r;
    }
}
exports.Middlewares = Middlewares;
//# sourceMappingURL=middleware.js.map