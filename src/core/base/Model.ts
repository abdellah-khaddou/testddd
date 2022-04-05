import mongoose, { Document } from 'mongoose';

import { kmSchema } from '../db-manager/schema';
import { Repository } from '../metadata/repository.metadata';

const { Schema } = mongoose;
 @Repository()
export class repositoryBase {
constructor(){
    console.log('repo base called');
    this.baseSchema= new kmSchema({});
    this.base =   mongoose.model('base',this.baseSchema);
    // console.log(mongo)
}
      baseSchema :kmSchema ;
    
       base: mongoose.Model<Document,any> ;

}