"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoryBase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("../db-manager/schema");
const repository_metadata_1 = require("../metadata/repository.metadata");
const { Schema } = mongoose_1.default;
let repositoryBase = class repositoryBase {
    constructor() {
        console.log('repo base called');
        this.baseSchema = new schema_1.kmSchema({});
        this.base = mongoose_1.default.model('base', this.baseSchema);
        // console.log(mongo)
    }
};
repositoryBase = __decorate([
    (0, repository_metadata_1.Repository)(),
    __metadata("design:paramtypes", [])
], repositoryBase);
exports.repositoryBase = repositoryBase;
//# sourceMappingURL=Model.js.map