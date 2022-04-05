import { Response } from "express";

import {formattedResponse,ResponseStatus,ResponseDirection,} from "../../core/interfaces/Response";
import { stageRequest, stageResponse } from "../../core/interfaces/Request";
import tokenManager from "../../helpers/TokenManager";
import { Permission } from "../../app/modules/permission/Model";
import { compare } from "bcrypt";
import {  TypesRoles} from "../../app/modules/companies/classes/type_companies";

export class Middlewares {
  accessMethods;
  isAccess;
  moduleEspaceDB;

  async authenticateUser(req: stageRequest, res: stageResponse) {
    if (req.headerToken) {
      if (tokenManager.verifyToken(req.headerToken)) {
        let user: any = await tokenManager.decoreToken(req.headerToken);
        return req.addProperty("user", user);
      }
    }
    let r = new formattedResponse(ResponseStatus.succes,"are you not auth ", ResponseDirection.outputSystem);
    return res.send(r); //is undfined
  }
  static getStringOfPermission(req: stageRequest): string {
    let action = req.Action.toString();
    let module = req.Module.toString();
    if (action.toLowerCase() == "search") {
      return "read-" + module.toLowerCase();
    } else if (action.toLowerCase() == "delete") {
      return "delete-" + module;
    } else if (action.toLowerCase() == "save") {
      if (req.body._id) {
        return "update-" + module;
      } else {
        return "create-" + module;
      }
    }
    return "null";
  }
  async hasPermission(req: stageRequest, res: stageResponse) {
    let per = Middlewares.getStringOfPermission(req);
    let permissionDB = Permission;
    let permissions;
    if (req.headerToken && tokenManager.verifyToken(req.headerToken)) {
      let user: any = await tokenManager.decoreToken(req.headerToken);
      if (per != "null"  && user.role != TypesRoles.admin) {
        permissions = await permissionDB.find({
          permission: per,
          $or: [{ roleID: user.roleID }, { userID: user._id }],
          company:user.company._id
        });
      } else {
        return req;
        
      }

      if (permissions.length != 0) return req;
    }
    let r = new formattedResponse(ResponseStatus.methodNotAllowed,{ per, permissions },ResponseDirection.outputSystem);
    return res.send(r);
  }

  async isEspaceAdmin(req: stageRequest, res: stageResponse) {
    if (req.headerToken) {
      if (tokenManager.verifyToken(req.headerToken)) {
        let user: any = await tokenManager.decoreToken(req.headerToken);

        if (
          user.company.type == "Administrateur" ||
          user.company._id == user.espace.Company
        )
          return req.addProperty("user", user);
      }
    }
    let r = new formattedResponse(
      ResponseStatus.succes,
      "premission denied not Admin Espace" + JSON.stringify(req),
      ResponseDirection.outputSystem
    );

    return res.send(r);
    r;
  }
}
