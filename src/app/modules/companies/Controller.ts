import BaseCtrl from "../../../core/base/Controller";
import {
  formattedResponse,
  ResponseDirection,
  ResponseStatus,
} from "../../../core/interfaces/Response";
import { endPoint } from "../../../core/metadata/action.metadata";
import { Module } from "../../../core/metadata/module.metadata";
import { getInjection } from "../../../core/store/providers";
import { executeControllerAction } from "./../../../core/store/dispatcher";

import { companiesRepository } from "./Model";
import { UserService } from "../users/user_service";
import { userRepository } from "../users/Model";
import usersCtrl from "../users/Controller";
import { middleware } from "./Middlewares";
import { TypesCompanies, TypesRoles } from "./classes/type_companies";
import { roleRepository } from "../role/Model";


@Module({
  inputs: [
    getInjection("companiesRepository").companiesSchema.getModuleValidator,
    middleware.hasPermission
  ],
})
export default class companiesCtrl extends BaseCtrl {
  moduleDB: companiesRepository["companies"];
  userModel: userRepository["user"];
  roleDB:roleRepository["role"]
  userService = new UserService();
  userCtrl;;
  constructor(options) {
    super(options);
    this.userCtrl = new usersCtrl(options);
    this.moduleDB = options.companiesRepository["companies"];
    
    this.userModel = options.userRepository["user"];
    this.roleDB = options.roleRepository["role"];

    //this.userService=options.UserService
  }

  @endPoint({ inputs: [] })
  async seed(params: any) {
    let result = await this.moduleDB.create({});
    return {};
    // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
  }
  @endPoint({})
  async register(params: any) {
    // const { companie, user } = params;
    let role = await this.roleDB.findOne({name:TypesRoles.admin})
    let login = await this.userModel.find({login:params.login})
    if(login.length >0){
      return new formattedResponse(
        ResponseStatus.NotAcceptable,
        {message:"this logain exsiste"},
        ResponseDirection.outputSystem
      );
    }
    var companie = {
      name: params.name_companie,
      type: params.type,
      subdomain:params.subdomain,
      adresse: params.adresse,
      tel: params.tel_companie,
      email: params.email_companie,
      RC: params.RC,
      banque: params.banque,
      RIB: params.RIB,
      ville: params.ville,
      active:false
    };
    
    
    let res: any =  await this.moduleDB.create({ ...companie });;
    if(res){
      
      var user = {
        name: params.name_user,
        login: params.login,
        password: params.password,
        company: res?._doc._id,
        companyName: res?._doc?.name,
        tel: params.tel_user,
        role: TypesRoles.admin,
        roleID:role?._id,
        cin: params.cin,
        email: params.email,
      };
  
      user.password = this.userService.hashPassword(user.password);
      res.createdBy = res?._doc._id;
      //let newuser = executeControllerAction.call();
  
      let userNew = await this.userModel.create({ ...user });
  
      let token = await this.userCtrl.generateToken({ _id: userNew._id });
      return new formattedResponse(
        ResponseStatus.succes,
        token,
        ResponseDirection.outputSystem
      );

    }
   
  }
  @endPoint({
    inputs:[middleware.authenticateUser]
  })
  async search(params: any) {
    let user = params.middleWareEffect.user
    delete params.middleWareEffect;
    let res:any[] =[];
    if(user.company.type == TypesCompanies.admin){

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
      ])

    }else{
        res = await this.moduleDB.find({...params,_id:user?.company?._id})
    }

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );

  }


  @endPoint({})
  async delete(params: any) {
    let res = await this.moduleDB.findOneAndDelete({ _id: params._id });

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async duplicate(params: any) {
    return super.duplicate(params);
  }
  @endPoint({
    inputs:[middleware.authenticateUser]
  })
  async save(params: any) {
    let user = params.middleWareEffect.user
    delete params.middleWareEffect
    let result;
    
    if (params._id) {
      if(user.company.type == TypesCompanies.admin || user.company._id == params._id )
          result = await this.moduleDB.updateOne({ _id: params._id },{ ...params });
      else
          return new formattedResponse(ResponseStatus.unAuthorized,{error:"Not have Permission To Update Companies"},ResponseDirection.outputSystem)
    } else if(user.company.type == TypesCompanies.admin) {

      result = await this.moduleDB.create({ ...params });
    }else{
      return new formattedResponse(ResponseStatus.unAuthorized,{error:"Not have Permission To Create Companies"},ResponseDirection.outputSystem)

    }
    return new formattedResponse(
      ResponseStatus.succes,
      result,
      ResponseDirection.outputSystem
    );
  }
}
