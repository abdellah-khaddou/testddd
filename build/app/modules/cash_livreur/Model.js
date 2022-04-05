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
exports.cash_livreurRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let cash_livreurRepository = class cash_livreurRepository {
    constructor() {
        this.cash_livreurSchema = new schema_1.kmSchema({
            livreurName: String,
            livreurId: {
                type: String,
                ref: "users",
                required: true,
                default: "null"
            },
            company: {
                type: String,
                ref: "companies",
                required: true,
                default: "null"
            },
            companyName: String,
            take: {
                type: Boolean,
                default: false
            },
            orders: [
                {
                    colis: {
                        type: String,
                        ref: "colis",
                        required: true,
                        default: "null"
                    }
                }
            ],
            total: String,
            date: {
                type: Date,
                default: new Date()
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
        });
        //app_permissionSchema.index({userID:1,permissionID:1,cash_livreurID:1},{unique:true})
        this.cash_livreur = mongoose_1.default.model('cash_livreur', this.cash_livreurSchema, 'cash_livreur');
    }
};
cash_livreurRepository = __decorate([
    repository_metadata_1.Repository()
], cash_livreurRepository);
exports.cash_livreurRepository = cash_livreurRepository;
//# sourceMappingURL=Model.js.map