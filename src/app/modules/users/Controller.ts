import BaseCtrl from '../../../core/base/Controller';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../../../core/interfaces/Response';
import { endPoint } from '../../../core/metadata/action.metadata';
import { Module } from '../../../core/metadata/module.metadata';
import { getInjection } from '../../../core/store/providers';
import { executeControllerAction } from './../../../core/store/dispatcher';
import { userRepository } from './Model';
import tokenManager from "../../../helpers/TokenManager";
import { UserService } from './user_service';
import { middleware } from './Middlewares';
import mongoose from 'mongoose';
import { User } from './user.interface';
import { TypesCompanies, TypesRoles } from '../companies/classes/type_companies';
import { resourcesRepository } from '../resources/Model';
import { Permission } from '../permission/Model';


@Module({
  inputs: [getInjection('userRepository').userSchema.getModuleValidator],
   outputs:[]
})
export default class usersCtrl extends BaseCtrl {
  moduleDB: userRepository['user'];
  modulePermissionDB;
  moduleresourceDB: resourcesRepository['resources'];
  userService= new UserService();
  user;
  constructor(options) {
    super(options);
    this.moduleDB = options.userRepository['user'];
    this.moduleresourceDB = options.resourcesRepository['resources']
    this.modulePermissionDB = Permission
  }






  @endPoint({
    inputs: [middleware.authenticateUser],
  })
  async seed(params: any) {
    let result = await this.moduleDB.create()
    return new formattedResponse(ResponseStatus.succes, result, ResponseDirection.outputSystem)
  }
  @endPoint({inputs:[middleware.authenticateUser]})
  async search(params:any){
      let user = params.middleWareEffect.user;
      delete params.middleWareEffect;
      let res:any[]=[]
      if(user.company.type == TypesCompanies.admin) {
         res = await this.moduleDB.find({...params}).populate('company');

      }else{
         res = await this.moduleDB.find({...params,company:user.company._id}).populate('company');
      }
      
       return  new formattedResponse(ResponseStatus.succes, res , ResponseDirection.outputSystem)

      //return super.search(params)
  }
  @endPoint({inputs:[middleware.isEspaceAdmin]})
  async delete(params:any){
      let userToDelete:any = await this.moduleDB.find({ _id: params._id })
                                .populate('company')
                                .populate('espace');
     let userLogin:any = params.middleWareEffect.user
     if(userToDelete.espace._id == userLogin.espace._id
       && userLogin.company._id == userLogin.espace.company
      ){
        let res =await this.moduleDB.findOneAndDelete({ _id: params._id });

        return new formattedResponse(ResponseStatus.succes,"delete with success",ResponseDirection.outputSystem);

      }



      return new formattedResponse(ResponseStatus.succes,"premission denied",ResponseDirection.outputSystem);

  }
  @endPoint({})
  async duplicate(params:any){
      return super.duplicate(params)
  }
  @endPoint({})
  async one(params:any){
    // let users = await this.moduleDB.find();
    return new formattedResponse(ResponseStatus.succes,{x:"info db"+mongoose.connection.readyState},ResponseDirection.outputSystem);
  }
  @endPoint({inputs: [middleware.authenticateUser]})
  async updateAdresse(params:any){
    let userLogin = params.middleWareEffect.user;
    let user:any = await this.moduleDB.findById(userLogin._id);
    if(user){
        let existe = false
        user.coordonnees.filter(cords=>{
           if(cords.name == params.name){
              existe=true
              cords.coords =params.coords
            }
            return cords
          })

        if(!existe)user.coordonnees.push(params)


      user.save()
    return new formattedResponse(ResponseStatus.succes,user.coordonnees,ResponseDirection.outputSystem);

    }
    return new formattedResponse(ResponseStatus.methodNotAllowed,"premission denied",ResponseDirection.outputSystem);

  }

  @endPoint({inputs: [middleware.authenticateUser]})
  async deleteAdresse(params:any){
    let userLogin = params.middleWareEffect.user;
    let user:any = await this.moduleDB.findById(userLogin._id);
    if(user){
      user.coordonnees = user.coordonnees.filter(cords=>(cords._id != params._id))
      user.save()
       return new formattedResponse(ResponseStatus.succes,user.coordonnees,ResponseDirection.outputSystem);

    }
    return new formattedResponse(ResponseStatus.methodNotAllowed,"premission denied",ResponseDirection.outputSystem);

  }

  @endPoint({inputs: [middleware.authenticateUser]})
  async updateFavoriter(params:any){
    let userLogin = params.middleWareEffect.user;
    let user:any = await this.moduleDB.findById(userLogin._id);
    if(user){
        let existe = false
        let favs = user.favourites.filter(fav=>{
           if(fav.product == params.product){
              existe=true
              return null
            }
              return fav
            
          })
          
        if(!existe)user.favourites.push({product:params.product})
        if(existe)user.favourites= favs;

      user.save()
    return new formattedResponse(ResponseStatus.succes,user.favourites,ResponseDirection.outputSystem);

    }
    return new formattedResponse(ResponseStatus.methodNotAllowed,"premission denied",ResponseDirection.outputSystem);

  }


  @endPoint({inputs:[middleware.authenticateUser]})
  async save(params:any){
    let user = params.middleWareEffect.user
      let result
      

      if(params._id){
       
          result =await this.moduleDB.updateOne({ _id: params._id },{...params});
      }else{
          params.password = this.userService.hashPassword(params.password);
          
          result = await this.moduleDB.create({...params});
      }
      return new formattedResponse(ResponseStatus.succes,result,ResponseDirection.outputSystem);
  }
 
  // auth methods
  @endPoint({
    inputs: [],
  })
  async login(params: any) {
    let { login, password } = params;

    const user:any = await this.moduleDB.findOne({login:login});

    if (!user)
      return new formattedResponse(
        ResponseStatus.notFound,
        "error login",
        ResponseDirection.outputSystem
      );
    let validePassword =  this.userService.verifyPassword( password,user.password);
    //let validePassword = password == user.get("password");
    if (!validePassword)
      return new formattedResponse(
        ResponseStatus.notFound,
        "error password",
        ResponseDirection.outputSystem
      );

    const token = await this.generateToken({ _id: user._id });

    return new formattedResponse(
      ResponseStatus.succes,
     token ,
      ResponseDirection.outputSystem
    );

    // return {header:"x-auth", token:token};
  }

  async generateToken(params: { _id: any }) {
    let user:any = await this.moduleDB.findById(params._id).populate("company");//change name company
    //next time find({_id:params._id},{password:0});
    
    return await tokenManager.generateToken(user?.toJSON());
  }

  @endPoint({})
  async verifierToken(params: any) {
     const token = params.token;
     let obj: any = null;
     let user
     if (token) {
      let userToken:any = await tokenManager.verifyToken(token);
      obj =  await this.moduleDB.findOne({_id:userToken?._id}).populate("company");

      if(userToken.password != obj.password){
        return new formattedResponse(
          ResponseStatus.unAuthorized,
          {userToken,obj},
          ResponseDirection.outputSystem
        );
       }
       let resources = await this.moduleresourceDB.findOne({companyType : obj.company.type})
       let permission = await this.modulePermissionDB.find({
        $or: [{ roleID: obj.roleID }, { userID: obj._id }]
      
      });
      
       user = {...obj._doc,resources:[],permission :[]}

      user.resources = resources?.resources
      user.permission = permission
      user.password = null
     }
     return new formattedResponse(
       ResponseStatus.succes,
       {user},
       ResponseDirection.outputSystem
     );
  }

  @endPoint({inputs:[middleware.authenticateUser]})
  async editPassword(params){
    let user = params.middleWareEffect.user
    delete params.middleWareEffect
    let canChangePassword:Boolean = false
    let newpassword:any
    let message :any = "PASSWORD_EDIT_WITH_SUCCESS"
    console.log( "pass user : ",params.password)
    const userModify:any = await this.moduleDB.findOne({_id:params._id});
    if(!userModify){
      message = "NO_USER_WITH_THIS_INFO"
    }else if(user.company.type == TypesCompanies.admin){
      if(user.role == TypesRoles.admin  && user._id != userModify?._id){
         newpassword = this.userService.hashPassword(params.password);
        canChangePassword =true
      }else if(user._id == userModify?._id){
        let validePassword =  this.userService.verifyPassword( params.oldpassword,userModify?.password);
        if(validePassword){
           newpassword = this.userService.hashPassword(params.password);
           canChangePassword =true
        }else{
          message = "NOT_IS_OLD_PASSWORD"
      }

      }else if( userModify?.company.type != TypesCompanies.admin ){
         newpassword = this.userService.hashPassword(params.password);
          canChangePassword =true
      }else{
          message = "DONT_HAVE_PERMISSION"
      }

    }else{
      
      if(userModify && userModify?.company._id == user.company._id  ) {
          if(user.role == TypesRoles.admin  && user._id != userModify?._id){
             newpassword = this.userService.hashPassword(params.password);
            canChangePassword =true
          }else if(user._id == userModify?._id){
            let validePassword = await this.userService.verifyPassword( params.oldpassword,userModify?.password);
            if(validePassword){
              newpassword = this.userService.hashPassword(params.password);
              canChangePassword =true
            }else{
              message = "NOT_IS_OLD_PASSWORD"
            }

          }else{
            message = "DONT_HAVE_PERMISION"
          }
      }else{
        message = "DONT_HAVE_PERMISION"
      }
    }


    if(canChangePassword){
      console.log( "pass has : ",newpassword)
      let result =await this.moduleDB.updateOne(
        {_id:params._id},
        {
          
          
            password: newpassword,
          
        }
        );
      
      return new formattedResponse(
        ResponseStatus.succes,
       {message,result} ,
        ResponseDirection.outputSystem
      );

    }else{
      return new formattedResponse(
        ResponseStatus.NotAcceptable,
       {message} ,
        ResponseDirection.outputSystem
      );

    }

  }

}
