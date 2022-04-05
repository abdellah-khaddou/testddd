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
exports.userRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const repository_metadata_1 = require("../../../core/metadata/repository.metadata");
const schema_1 = require("../../../core/db-manager/schema");
let userRepository = class userRepository {
    constructor() {
        this.userSchema = new schema_1.kmSchema({
            name: { type: String, required: true },
            login: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            tel: { type: String, required: true },
            cin: { type: String, required: true },
            email: { type: String, required: true },
            image: { type: String, default: "https://www.profilesw.com/uploads/images/image_galleries/profile/v2/fr/thumbs/731/327x204.jpg" },
            company: {
                type: String,
                ref: 'companies',
                required: true,
            },
            companyName: String,
            coordonnees: [{ name: String, coords: { lng: String, lat: String } }],
            role: {
                type: String,
                required: true
            },
            roleID: {
                type: String,
                ref: "role",
                required: true,
                default: "null"
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
        this.user = mongoose_1.default.model('users', this.userSchema, 'users');
    }
};
userRepository = __decorate([
    (0, repository_metadata_1.Repository)()
], userRepository);
exports.userRepository = userRepository;
//# sourceMappingURL=Model.js.map