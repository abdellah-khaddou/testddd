import { FilterTable, FilterMetadata } from '../interfaces/lazyLoading';
import { formattedResponse, ResponseDirection, ResponseStatus } from '../interfaces/Response';
import { endPoint } from '../metadata/action.metadata';
import { repositoryBase } from './Model';

export default abstract class BaseCtrl {
    constructor(options){
        // this.moduleDB = options.repositoryBase['base']
    }
    moduleDB=repositoryBase['base'];
    @endPoint({})
   async search  (params:any) : Promise<formattedResponse|undefined>  {
      
    const queryResult = await this.moduleDB.find({...params});
         return new formattedResponse(ResponseStatus.succes,queryResult,ResponseDirection.outputModule);
    }
    @endPoint({})
    async delete  (params:any) : Promise<formattedResponse|undefined> {
        const queries = await this.moduleDB.deleteOne({...params});
        return new formattedResponse(ResponseStatus.succes,queries,ResponseDirection.outputModule);
     }
    @endPoint({})
    async    duplicate  (params:any) : Promise<formattedResponse|undefined> {
        const queries = await this.moduleDB?.findOne({_id:params._id }).select('_id:0 __v:0 dateCreation:0');
        const insertedDocument = await this.moduleDB.create(queries);
        
        return new formattedResponse(ResponseStatus.succes,insertedDocument,ResponseDirection.outputModule);

    }
   
    @endPoint({})
    async save  (params:any) : Promise<formattedResponse|undefined> {
       let queries:any;
        if(params._id){
            queries = await this.moduleDB.updateOne({_id:(params._id)},{...params});

        }else{
            queries = await this.moduleDB.create({...params});
        }
        return new formattedResponse(ResponseStatus.succes,queries,ResponseDirection.outputSystem);
     }
     filterAndSort(event:any){
        if(!event) return null

        try{
            let sorts = {}
         event.multiSortMeta?.filter(el=>{
                
                sorts[el.field] = el.order
                
            })
            if(Object.keys(sorts).length === 0)sorts["_id"]=1
            event.multiSortMeta = sorts
            let filter = new FilterTable()


            let filters:any = {$and:[],$or:[]}
            Object.keys(event.filters).forEach(key=>{
              (event.filters[key] as FilterMetadata[]).forEach(el => {

                if(el.value != null){
                  
                  let strFilter =  filter.returnRegEx(el.matchMode,el.value)
                  let obj ={}
                  obj[key] = strFilter
                  filters['$'+el.operator].push(obj)
                }
        
              });
              
            })
        if(filters.$and.length<=0) delete filters.$and
        if(filters.$or.length<=0) delete filters.$or
        event.filters = filters
        } catch(e){
            console.log(e)
        }
           return event
     }
     //handlingFiles 
     uploadFile(){
         console.log('uploadFile')
     };
     downloadZip(){};
     
     downloadFile(){
      };
     //
}