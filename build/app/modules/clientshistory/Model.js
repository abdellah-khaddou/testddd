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
exports.clientshistoryRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let clientshistoryRepository = class clientshistoryRepository {
    constructor() {
        this.clientshistorySchema = new schema_1.kmSchema({
            name: { type: String },
            status: { type: String },
            article: [{
                    ref: String,
                    name: String,
                    qte: String
                }],
            vendeur: {
                type: String,
                ref: "companies",
                default: "null"
            },
            ville: { type: String },
            client: {
                type: String,
                ref: "clients",
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
        this.clientshistory = mongoose_1.default.model('clientshistory', this.clientshistorySchema, 'clientshistory');
    }
};
clientshistoryRepository = __decorate([
    repository_metadata_1.Repository()
], clientshistoryRepository);
exports.clientshistoryRepository = clientshistoryRepository;
//# sourceMappingURL=Model.js.map