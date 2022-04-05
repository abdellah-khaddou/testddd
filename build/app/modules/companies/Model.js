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
exports.companiesRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
const type_companies_1 = require("./classes/type_companies");
var uniqueValidator = require('mongoose-unique-validator');
let companiesRepository = class companiesRepository {
    constructor() {
        this.companiesSchema = new schema_1.kmSchema({
            name: {
                type: String,
                required: true,
                unique: true
            },
            tel: String,
            adresse: String,
            subdomain: String,
            domain: String,
            type: {
                type: String,
                default: type_companies_1.TypesCompanies.vendeur
            },
            hubID: {
                type: String,
                ref: "networks"
            },
            RC: String,
            email: String,
            banque: String,
            RIB: String,
            ville: String,
            prix_livrison: {
                type: Number,
                default: 0
            },
            prix_annule: {
                type: Number,
                default: 0
            },
            prix_refuse: {
                type: Number,
                default: 0
            },
            active: {
                type: Boolean,
                default: true
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
                default: new Date()
            }
        }).plugin(uniqueValidator);
        this.companies = mongoose_1.default.model('companies', this.companiesSchema, 'companies');
    }
};
companiesRepository = __decorate([
    (0, repository_metadata_1.Repository)()
], companiesRepository);
exports.companiesRepository = companiesRepository;
//# sourceMappingURL=Model.js.map