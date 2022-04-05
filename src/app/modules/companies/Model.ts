      import mongoose, { Document } from 'mongoose';
      import { Repository } from '../../../core/metadata/repository.metadata';
      import { kmSchema } from '../../../core/db-manager/schema';
import { TypesCompanies } from './classes/type_companies';
      var uniqueValidator = require('mongoose-unique-validator');
        @Repository()
        export class companiesRepository {
            companiesSchema = new kmSchema({
                name: {
                    type:String,
                    required:true,
                    unique:true},
                tel: String,
                adresse: String,
                subdomain:String,
                domain:String,
                type:{
                    type:String,
                    default:TypesCompanies.vendeur
                },
                hubID:{
                    type:String,
                    ref:"networks"
                },
                RC:String,
                email:String,
                banque:String,
                RIB:String,
                ville:String,
                prix_livrison: {
                    type:Number,
                    default:0
                },
                prix_annule:  {
                    type:Number,
                    default:0
                },
                prix_refuse: {
                    type:Number,
                    default:0
                },
                active:{
                        type:Boolean,
                        default:true
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

            }).plugin(uniqueValidator)            
            companies = mongoose.model<any>('companies', this.companiesSchema, 'companies');
        }


