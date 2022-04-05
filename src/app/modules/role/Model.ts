import mongoose, { Document } from 'mongoose';
        import { Repository } from '../../../core/metadata/repository.metadata';
        
        import { kmSchema } from '../../../core/db-manager/schema';
        
        @Repository()
        export class roleRepository {
            roleSchema = new kmSchema({
                name: { type: String ,required:true},
                displayName:{type:String,required:true},
                company:{
                    type:String,
                    ref:"companies",
                    required:true,
                    default:"all"
                },
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
                
            }).index({name:1,company:1},{unique:true});
            //app_permissionSchema.index({userID:1,permissionID:1,roleID:1},{unique:true})

            role = mongoose.model<any>('role', this.roleSchema, 'role');
        }
       