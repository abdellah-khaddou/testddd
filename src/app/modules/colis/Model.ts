import mongoose, { Document } from 'mongoose';
        import { Repository } from '../../../core/metadata/repository.metadata';
        
        import { kmSchema } from '../../../core/db-manager/schema';
import { StatusColis } from './enums/status.colis';
import { Emplacement } from './enums/emplacement';
        
        @Repository()
        export class colisRepository {
            colisSchema = new kmSchema({
                traking: { type: String,required:true,unique:true},
                vendeurName:String,
                livreurName:String,
                userConfirme : {
                    type:String,
                    ref:"users",
                    required:true,
                    default:"61bc5b9b4940cc1c8c8f7cd2" 
                },
                userIsConfirme : {
                    type:String,
                    ref:"users",
                    required:true,
                    default:"61bc5b9b4940cc1c8c8f7cd2" 
                },
                userConfirmeName:{
                    type:String,
                    default:"NATHING"
                },
                auto:{   
                    type:Boolean,
                    default: false
                },
                vendeur:{
                    type:String, 
                    ref:"companies",
                    required:true,
                    default:"61bc5b9b4940cc1c8c8f7cd2"
                },
                livreur:{
                    type:String,
                    ref:"companies",
                    required:true,
                    default:"61bc5b9b4940cc1c8c8f7cd2"
                },
                livreurUserName:String,
                livreurUser:{
                    type:String,
                    ref:"users",
                    required:true,
                    default:"61bc5b9b4940cc1c8c8f7cd2"
                },
                name:String,
                hub:String,
                hubID:String,
                iscashWithLivreur:{
                    type:Boolean,
                    default:false
                },
                statusVendeur:{
                    name:{
                        type:String,
                        default:"NATHING",

                    },
                    color:{
                        type:String,
                        default:""

                    },
                    date:{
                        type:Date,
                        default:Date.now
                    }
                },
                ville_depart:String,
                ville_arrive:String,
                tel:String,
                dateRecomande:{type: Date, trim: true, default: Date.now},
                telVendeur:String,
                status:{
                    type:String,
                    default:StatusColis.NON_ENVOYE
                },
                adresse:String,
                statusFinal:{
                    type:Boolean,
                    default:false
                },
                statusDate:{type: Date, trim: true, default: Date.now},
                satatusPaye:String,
                statusPayeDate:{
                    type: String, trim: true, default: new Date,
                    
                },
                isCashVendeur:{
                    type:Boolean,
                    default:false
                },
                isCashLivreur:{
                    type:Boolean,
                    default:false
                },
                prix:{
                    type:Number
                },
                situation_cache:String,
                date_payement:{type: Date, trim: true, default:Date.now},
                emplacement:{
                    type:String,
                    default:Emplacement.CHER_VENDEUR
                },
                type:{
                    name:String,
                    value:String
                },
                store:String,
                nb_order:String,
                prix_livrison:{
                    type:Number,
                    default:35
                },
                prix_anulle:{
                    type:Number,
                    default:5
                },
                prix_refuse:{
                    type:Number,
                    default:5
                },
                prix_livreur:{
                    prix_livrison:{
                        type:Number,
                        default:25
                    },
                    prix_anulle:{
                        type:Number,
                        default:0
                    },
                    prix_refuse:{
                        type:Number,
                        default:0
                    },
                },
                BL:String,
                BE:String,
                BR:String,
                chat:[{
                    name:String,
                    description:String,
                    date:{
                        type:Date,
                        default:Date.now
                    }
                    
                }],
                vueChat:{
                    admin:String,
                    livreur:String,
                    vendeur:String
                },
                produit:[{
                    ref:String,
                    name:String,
                    qte:Number

                }],
                confirme:{
                    type:Boolean,
                    default:false
                },
                open:{
                    type:Boolean,
                    default:false
                },
                archive:{
                    type:Boolean,
                    default:false
                },
                imprimer:{
                    type:Boolean,
                    default:false
                },
                statusPayementLivreur:String,
                statusPayementVendeur:String,
                changeBy:{
                    type:String,
                    default:"NATHING"
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
                    default:Date.now
                }
                
            });
            colis = mongoose.model<any>('colis', this.colisSchema, 'colis');
        }
       