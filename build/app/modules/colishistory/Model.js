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
exports.colishistoryRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let colishistoryRepository = class colishistoryRepository {
    constructor() {
        this.colishistorySchema = new schema_1.kmSchema({
            status: String,
            description: String,
            emplacement: String,
            date: {
                type: Date,
                required: true,
                default: new Date()
            },
            dateReclame: Date,
            company: {
                type: String,
                ref: "companies",
                required: true,
                default: null
            },
            coli: {
                type: String,
                ref: "colis",
                required: true,
                default: null
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
        this.colishistory = mongoose_1.default.model('colishistory', this.colishistorySchema, 'colishistory');
    }
};
colishistoryRepository = __decorate([
    repository_metadata_1.Repository()
], colishistoryRepository);
exports.colishistoryRepository = colishistoryRepository;
//# sourceMappingURL=Model.js.map