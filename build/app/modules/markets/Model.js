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
exports.marketsRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let marketsRepository = class marketsRepository {
    constructor() {
        this.marketsSchema = new schema_1.kmSchema({
            name: { type: String, required: true, unique: true },
            type: { type: String },
            image: { type: String },
            description: { type: String },
            prix: {
                type: Number,
                default: 0
            },
            rating: {
                type: Number,
                default: Math.floor(Math.random() * 6)
            },
            category: {
                type: String,
                default: "Undefined"
            },
            tel: {
                type: String,
            }
        });
        this.markets = mongoose_1.default.model('markets', this.marketsSchema, 'markets');
    }
};
marketsRepository = __decorate([
    repository_metadata_1.Repository()
], marketsRepository);
exports.marketsRepository = marketsRepository;
//# sourceMappingURL=Model.js.map