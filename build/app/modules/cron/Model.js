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
exports.cronRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let cronRepository = class cronRepository {
    constructor() {
        this.cronSchema = new schema_1.kmSchema({
            name: String,
            Description: String,
            data: Array,
            date: Date,
            createdBy: {
                type: String,
                ref: "users",
                required: true,
                default: "null"
            },
            createdAt: {
                type: Date,
                required: true,
                default: Date.now()
            }
        });
        //cronSchema.index({userID:1,permissionID:1,roleID:1},{unique:true})
        this.cron = mongoose_1.default.model('cron', this.cronSchema, 'cron');
    }
};
cronRepository = __decorate([
    repository_metadata_1.Repository()
], cronRepository);
exports.cronRepository = cronRepository;
//# sourceMappingURL=Model.js.map