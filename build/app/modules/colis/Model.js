"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colisRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
const status_colis_1 = require("./enums/status.colis");
const emplacement_1 = require("./enums/emplacement");
let colisRepository = class colisRepository {
    constructor() {
        this.colisSchema = new schema_1.kmSchema({
            traking: { type: String, required: true, unique: true },
            vendeurName: String,
            livreurName: String,
            userConfirme: {
                type: String,
                ref: "users",
                required: true,
                default: "61bc5b9b4940cc1c8c8f7cd2"
            },
            userIsConfirme: {
                type: String,
                ref: "users",
                required: true,
                default: "61bc5b9b4940cc1c8c8f7cd2"
            },
            userConfirmeName: {
                type: String,
                default: "NATHING"
            },
            auto: {
                type: Boolean,
                default: false
            },
            vendeur: {
                type: String,
                ref: "companies",
                required: true,
                default: "61bc5b9b4940cc1c8c8f7cd2"
            },
            livreur: {
                type: String,
                ref: "companies",
                required: true,
                default: "61bc5b9b4940cc1c8c8f7cd2"
            },
            livreurUserName: String,
            livreurUser: {
                type: String,
                ref: "users",
                required: true,
                default: "61bc5b9b4940cc1c8c8f7cd2"
            },
            name: String,
            hub: String,
            hubID: String,
            iscashWithLivreur: {
                type: Boolean,
                default: false
            },
            statusVendeur: {
                name: {
                    type: String,
                    default: "NATHING",
                },
                color: {
                    type: String,
                    default: ""
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            },
            ville_depart: String,
            ville_arrive: String,
            tel: String,
            dateRecomande: { type: Date, trim: true, default: Date.now },
            telVendeur: String,
            status: {
                type: String,
                default: status_colis_1.StatusColis.NON_ENVOYE
            },
            adresse: String,
            statusFinal: {
                type: Boolean,
                default: false
            },
            statusDate: { type: Date, trim: true, default: Date.now },
            satatusPaye: String,
            statusPayeDate: {
                type: String, trim: true, default: new Date,
            },
            isCashVendeur: {
                type: Boolean,
                default: false
            },
            isCashLivreur: {
                type: Boolean,
                default: false
            },
            prix: {
                type: Number
            },
            situation_cache: String,
            date_payement: { type: Date, trim: true, default: Date.now },
            emplacement: {
                type: String,
                default: emplacement_1.Emplacement.CHER_VENDEUR
            },
            type: {
                name: String,
                value: String
            },
            store: String,
            nb_order: String,
            prix_livrison: {
                type: Number,
                default: 35
            },
            prix_anulle: {
                type: Number,
                default: 5
            },
            prix_refuse: {
                type: Number,
                default: 5
            },
            prix_livreur: {
                prix_livrison: {
                    type: Number,
                    default: 25
                },
                prix_anulle: {
                    type: Number,
                    default: 0
                },
                prix_refuse: {
                    type: Number,
                    default: 0
                },
            },
            BL: String,
            BE: String,
            BR: String,
            chat: [{
                    name: String,
                    description: String,
                    date: {
                        type: Date,
                        default: Date.now
                    }
                }],
            vueChat: {
                admin: String,
                livreur: String,
                vendeur: String
            },
            produit: [{
                    ref: String,
                    name: String,
                    qte: Number
                }],
            confirme: {
                type: Boolean,
                default: false
            },
            open: {
                type: Boolean,
                default: false
            },
            archive: {
                type: Boolean,
                default: false
            },
            imprimer: {
                type: Boolean,
                default: false
            },
            statusPayementLivreur: String,
            statusPayementVendeur: String,
            changeBy: {
                type: String,
                default: "NATHING"
            },
            createdBy: {
                type: String,
                ref: "users",
                required: true,
                default: "null"
            },
            createdAt: {
                type: Date,
                required: true,
                default: Date.now
            }
        });
        this.colis = mongoose_1.default.model('colis', this.colisSchema, 'colis');
    }
};
colisRepository = __decorate([
    (0, repository_metadata_1.Repository)()
], colisRepository);
exports.colisRepository = colisRepository;
//# sourceMappingURL=Model.js.map