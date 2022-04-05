"use strict";
// // import { ModelType, Typegoose } from "typegoose"
// import { isArray } from "util"
// const mongoose= require('mongoose')
// export class ModelFunction {
//   constructor(public Model: ModelType<Typegoose>) {
//   }
//   get model(){
//     return this.Model
//   }
//   addBulk= (arrayOfDocument:any)=> {
//     return this.model.insertMany(arrayOfDocument)
//   }
//   save = (objetToCreate: any,filters?:any): any => {
//     if(filters){
//       return this.Model.findOneAndUpdate(filters,objetToCreate,{upsert:true})
//     }
//     if (objetToCreate._id) {
//       return this.Model.findByIdAndUpdate({ _id: objetToCreate._id }, objetToCreate)
//     }
//     return this.Model.create(objetToCreate)
//   }
//   search = (objetToFind: any): any => {
//     return this.Model.find(objetToFind)
//   }
//   renameKeys = (objectToRename:Object)=>{
//    let keysToReplace =  {atLeastOne:"$in",greaterThanOrEqual:""}
//     Object.keys(Object)
//   }
//   checkType=(elementToCheck:any)=>{
//     return !Array.isArray(elementToCheck)+typeof elementToCheck
//   }
//   delete = (_id: string): any => {
//     return this.Model.findByIdAndDelete(_id)
//   }
//   searchByKeysList=(query:any)=>{
//     const newoBJECT:any={}
//     Object.keys(query).forEach(element=>{
//         newoBJECT[element]={
//            $in: query[element].map((keyValue:string)=>{
//             mongoose.Types.ObjectId(keyValue)
//            })
//         }
//     })
//    return this.Model.find(newoBJECT)
//   }
// }
//# sourceMappingURL=baseModelFunction.js.map