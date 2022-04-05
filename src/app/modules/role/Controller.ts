
import BaseCtrl from '../../../core/base/Controller';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../../../core/interfaces/Response';
import { endPoint } from '../../../core/metadata/action.metadata';
import { Module } from '../../../core/metadata/module.metadata';
import { getInjection } from '../../../core/store/providers';
import { Permission } from '../permission/Model';

import { executeControllerAction } from './../../../core/store/dispatcher';
import { middleware } from './Middlewares'
import { roleRepository } from './Model';

@Module({
    inputs: [
        getInjection('roleRepository').roleSchema.getModuleValidator,
        middleware.authenticateUser,
        // middleware.hasPermission

    ]
})
export default class roleCtrl extends BaseCtrl {
    moduleDB: roleRepository['role'];
    modulePermissionDB=Permission;
    constructor(options) {
        super(options);
        this.moduleDB = options.roleRepository['role'];

    }

    @endPoint({ inputs: [] })
    async seed(params: any) {
        let result = await this.moduleDB.create({})
        return {}
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    @endPoint({})
    async search(params: any) {
        let user = params.middleWareEffect.user
        delete params.middleWareEffect
        let res;

        
            res = await this.moduleDB.find({...params,"$or":[{company:"all"},{company:user.company._id}]})


        return new formattedResponse(ResponseStatus.succes, res, ResponseDirection.outputSystem)
    }
    @endPoint({})
    async delete(params: any) {
        return super.delete(params)
    }
    @endPoint({})
    async duplicate(params: any) {
        return super.duplicate(params)
    }
    @endPoint({
        inputs:[middleware.authenticateUser]
    })
    async save(params: any) {
        let user = params.middleWareEffect.user
        delete params.middleWareEffect
        let role;
        if(params._id ){
            role = await this.moduleDB.updateOne({_id:(params._id)},{...params})
            await this.modulePermissionDB.deleteMany({roleID:params._id})

        }else{
            role = await this.moduleDB.create({...params,company:user.company._id})
        }

        let permissions:any =[]
        await params.permission?.filter(el=>{
                permissions.push({userID:"null",roleID:params._id || role._id,company:user.company._id,permission:el})
        })

        let per = await this.modulePermissionDB.insertMany(permissions);
        return new formattedResponse(ResponseStatus.succes, {role,per,permissions,params}, ResponseDirection.outputSystem)
        
    }
}