// import { GlobalVariable as storeInstance } from '../..';
import { storeInstance } from '../..';

import BaseCtrl from '../../base/Controller';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../../interfaces/Response';
import { endPoint } from '../../metadata/action.metadata';
import { Module } from '../../metadata/module.metadata';
import { midExample } from './Middlewares';
import { Scans, scansSchema } from './Model';
import {existsSync,mkdirSync, writeFileSync} from 'fs' 

@Module({
    inputs: [scansSchema.getModuleValidator]
})
export default class scansCtrl extends BaseCtrl {
    moduleDB = Scans;
    @endPoint({ inputs: [midExample] })
    async seed(params:any) {
        let result = await this.moduleDB.create({})
        return new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }

    @endPoint({})
    async search(params:any) {
        return super.search(params)
    }
    @endPoint({})
    async delete(params:any) {
        return super.delete(params)
    }
    @endPoint({})
    async duplicate(params:any) {
        return super.duplicate(params)
    }
    @endPoint({})
    async save(params:any) {
        return super.save(params)
    }

    @endPoint({})
    async getScan (params: any)  {
        let link = params.linkedTo;
        const scans = await this.search({linkedTo:link});
        if (scans?.value[0]._id) {
            return { status: 200, Response: 'scans/' + scans?.value[0]._id + '.'+scans?.value[0]._id.type, type: 'file' };
        } else {
            return { status: 404, Response: 'Img Not Found' };
        }
    }

    @endPoint({})
   async saveScanReturnPath   (objectToStore: any): Promise<formattedResponse|undefined>  {
        const type = (objectToStore.file.fileInfo&&objectToStore.file.fileInfo.type as string).substring((objectToStore.file.fileInfo&&objectToStore.file.fileInfo.type as string).indexOf('/') + 1)
        let config = storeInstance.getConfig();
         const result = await this.save({ linkedTo: objectToStore.linkedTo ,type:type} )
        let Response: any = result;
        if (!existsSync(config)) {
            mkdirSync(config);
            
        }
        if (!existsSync(config+'/scans')) {
            mkdirSync(config+'/scans');
            
        }
        let buff =  Buffer.alloc(objectToStore.file.fileInfo.size,objectToStore.file.file, 'base64');
        console.info(config+'/scans/' + result?.value._id+'.'+type);
        writeFileSync(config+'/scans/' + result?.value._id+'.'+type ,buff);
        Response.path=config+'/scans/' + result?.value._id+'.'+type;
        console.info(Response.path);
         return new formattedResponse(ResponseStatus.succes,{path:config+'/scans/' + result?.value._id+'.'+type,...Response},ResponseDirection.outputSystem);

    }
    saveScan  = async (params: any): Promise<formattedResponse|undefined>  => {
        let objectToStore=params;
        const type = (objectToStore.file.fileInfo&&objectToStore.file.fileInfo.type as string).substring((objectToStore.file.fileInfo&&objectToStore.file.fileInfo.type as string).indexOf('/') + 1)
        let config = storeInstance.globalVariable['appConfig']['warehouseUrl'];
        const result = await this.save(  { linkedTo: objectToStore.linkedTo ,type:type} )
        let Response: any = result;
        if (!existsSync(config)) {
            mkdirSync(config);
            
        }
        if (!existsSync(config+'/scans')) {
            mkdirSync(config+'/scans');
            
        }
        let buff =  Buffer.alloc(objectToStore.file.fileInfo.size,objectToStore.file.file, 'base64');
          writeFileSync(config+'/scans/' + result?.value._id+'.'+type ,buff);
 
        return new formattedResponse(ResponseStatus.succes,result,ResponseDirection.outputSystem)
 
    }
}