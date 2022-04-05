
import BaseCtrl from '../../../core/base/Controller';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../../../core/interfaces/Response';
import { endPoint } from '../../../core/metadata/action.metadata';
import { Module } from '../../../core/metadata/module.metadata';
import { getInjection } from '../../../core/store/providers';

import { executeControllerAction } from '../../../core/store/dispatcher';
import { middleware } from './Middlewares'
import { resourcesRepository } from './Model';
import { TypesCompanies } from '../companies/classes/type_companies';
import { enumsvaluesRepository } from '../enum_value/Model';
import { enumsRepository } from '../enum/Model';

@Module({
    inputs: [
        getInjection('resourcesRepository').resourcesSchema.getModuleValidator,
        middleware.authenticateUser,
        // middleware.hasPermission

    ]
})
export default class resourcesCtrl extends BaseCtrl {
    moduleDB: resourcesRepository['resources'];
    moduleEnumValueDB : enumsvaluesRepository['enumsvalues'];
    moduleEnumDB : enumsRepository['enums'] ;


    constructor(options) {
        super(options);
        this.moduleDB = options.resourcesRepository['resources'];
        this.moduleEnumValueDB = options.enumsvaluesRepository['enumsvalues']
        this.moduleEnumDB = options.enumsRepository['enums'] ;

    }

    @endPoint({ inputs: [] })
    async seed(params: any) {
        let result = await this.moduleDB.create({})
        return {}
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    @endPoint({
        inputs:[middleware.authenticateUser]
    })
    async search(params: any) {
        let user = params.middleWareEffect.user
        delete params.middleWareEffect
        let res:any[]=[],enums:any[]
        if(user.company.type == TypesCompanies.admin && params.type== true){
             let enuma = await this.moduleEnumDB.findOne({name:params.name})
            enums = await this.moduleEnumValueDB.find({enumeration:enuma._id});
            let resources:any[] =[]

            enums.forEach((el:any)=>{
                resources.push(el.value)
            })
            res.push({resources:resources})
            

        }else if(user.company.type == TypesCompanies.admin){
            res = await this.moduleDB.find({...params})
        }else{
            delete params.type
            delete params.name
            res = await this.moduleDB.find({...params,companyType:user.company.type})

        }

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
        let info = params.middleWareEffect
        delete params.middleWareEffect
        if(user.company.type == TypesCompanies.admin){
            let res = await this.moduleDB.findOne({companyType:params.companyType})
            if(res){
                res.resources = params.resources
                res.save();
                 return new formattedResponse(ResponseStatus.succes, res, ResponseDirection.outputSystem)

            }else
                return super.save(params)
        }
        return new formattedResponse(ResponseStatus.methodNotAllowed, {error:"your companie not allowed this Methode or Module",info:info}, ResponseDirection.outputSystem)

        
    }
}