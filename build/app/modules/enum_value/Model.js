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
exports.enumsvaluesRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let enumsvaluesRepository = class enumsvaluesRepository {
    constructor() {
        this.enumsvaluesSchema = new schema_1.kmSchema({
            value: { type: String, required: true },
            enumeration: {
                required: true,
                type: String,
                ref: 'enums'
            },
        });
        this.enumsvalues = mongoose_1.default.model('enumsvalues', this.enumsvaluesSchema, 'enumsvalues');
    }
};
enumsvaluesRepository = __decorate([
    repository_metadata_1.Repository()
], enumsvaluesRepository);
exports.enumsvaluesRepository = enumsvaluesRepository;
//# sourceMappingURL=Model.js.map