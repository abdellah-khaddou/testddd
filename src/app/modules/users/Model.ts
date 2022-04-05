import mongoose, { Document, Schema } from 'mongoose';
import { Repository } from '../../../core/metadata/repository.metadata';

import { kmSchema } from '../../../core/db-manager/schema';
import roleCtrl from '../role/Controller';

@Repository()
export class userRepository {
    userSchema = new kmSchema({
        name:{type:String,required: true},
        login:{type:String,required: true, unique: true },
        password:{type:String,required: true},
        tel:{type:String,required: true},
        cin:{type:String,required: true},
        email:{type:String,required: true},
        image:{type:String,default:"https://www.profilesw.com/uploads/images/image_galleries/profile/v2/fr/thumbs/731/327x204.jpg"},
        company:{
            type:String,
            ref:'companies',
            required:true,


        },
        companyName:String,
        coordonnees:[{name:String,coords:{lng :String , lat:String}}],
        role:{
            type:String,
            required:true
        },
        roleID:{
            type:String,
            ref:"role",
            required:true,
            default:"null"
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
    });
    user = mongoose.model<any>('users', this.userSchema, 'users');
}
