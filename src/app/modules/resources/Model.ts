import mongoose, { Document } from 'mongoose';
        import { Repository } from '../../../core/metadata/repository.metadata';
        
        import { kmSchema } from '../../../core/db-manager/schema';
        
        @Repository()
        export class resourcesRepository {
            resourcesSchema = new kmSchema({
                companyType: { type: String ,required:true,unique:[true,"please entrer another companyType"]},
                resources:[String],//users,colis,clients
                createdBy:{
                    type:String,
                    ref:"users",
                    required:true,
                    default:"null"

                },
                createdAt:{
                    type:Date,
                    required: true,
                    default:new Date()
                }
                
            });
            resources = mongoose.model<any>('resources', this.resourcesSchema, 'resources');
        }
       