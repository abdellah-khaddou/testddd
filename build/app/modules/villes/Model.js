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
exports.villesRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let villesRepository = class villesRepository {
    constructor() {
        this.villesSchema = new schema_1.kmSchema({
            ville_depart: {
                type: String,
                required: true,
            },
            livreurName: String,
            type: String,
            type_value: String,
            livreur: {
                type: String,
                ref: "companies",
                required: true,
                default: "vendeur"
            },
            ville_arrive: {
                type: String,
                required: true,
            },
            prix_livrision: {
                type: String,
                required: true,
            },
            prix_annule: {
                type: String,
                required: true
            },
            prix_refuse: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                required: true,
                default: new Date()
            },
            createdBy: {
                type: String,
                ref: "users",
                required: true,
                default: "null"
            },
        }).index({ ville_depart: 1, type: 1, type_value: 1, livreur: 1, ville_arrive: 1 }, { unique: true });
        //villesSchema.index({userID:1,permissionID:1,roleID:1},{unique:true})
        this.villes = mongoose_1.default.model('villes', this.villesSchema, 'villes');
    }
};
villesRepository = __decorate([
    repository_metadata_1.Repository()
], villesRepository);
exports.villesRepository = villesRepository;
//# sourceMappingURL=Model.js.map