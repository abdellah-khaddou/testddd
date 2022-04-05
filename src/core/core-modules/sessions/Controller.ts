import BaseCtrl from '../../../core/base/Controller';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../../../core/interfaces/Response';
import { endPoint } from '../../../core/metadata/action.metadata';
import { Module } from '../../../core/metadata/module.metadata';
import { Sessions, sessionsSchema } from './Model';


@Module({
    inputs: [sessionsSchema.getModuleValidator]
})
export default class sessionsCtrl extends BaseCtrl {
    moduleDB = Sessions;
    // @endPoint({ inputs: [midExample] })
    // async seed(params:any) {
    //     let result = await this.mainModel.create({})
    //     return new formattedResponse(ResponseStatus.succes, { result }, ResponseDirection.outputSystem)
    // }
    @endPoint({})
    async registerSession(params:any) {
        let session = await this.moduleDB.create(params)
        return new formattedResponse(ResponseStatus.succes, session, ResponseDirection.outputSystem)
    }
    @endPoint({})
    async removeSessions(params:any) {
        let deletedSession = await this.moduleDB.deleteOne(params);
        return new formattedResponse(ResponseStatus.succes, deletedSession, ResponseDirection.outputSystem)
    }
     async search(params:any) {
        return super.search(params)
    }
     async delete(params:any) {
        return super.delete(params)
    }
     async duplicate(params:any) {
        return super.duplicate(params)
    }
     async save(params:any) {
        return super.save(params)
    }
}