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
// import { GlobalVariable as storeInstance } from '../..';
const __1 = require("../..");
const Controller_1 = __importDefault(require("../../base/Controller"));
const Response_1 = require("../../interfaces/Response");
const action_metadata_1 = require("../../metadata/action.metadata");
const module_metadata_1 = require("../../metadata/module.metadata");
const Middlewares_1 = require("./Middlewares");
const Model_1 = require("./Model");
const fs_1 = require("fs");
let scansCtrl = class scansCtrl extends Controller_1.default {
    constructor() {
        super(...arguments);
        this.moduleDB = Model_1.Scans;
        this.saveScan = async (params) => {
            let objectToStore = params;
            const type = (objectToStore.file.fileInfo && objectToStore.file.fileInfo.type).substring((objectToStore.file.fileInfo && objectToStore.file.fileInfo.type).indexOf('/') + 1);
            let config = __1.storeInstance.globalVariable['appConfig']['warehouseUrl'];
            const result = await this.save({ linkedTo: objectToStore.linkedTo, type: type });
            let Response = result;
            if (!(0, fs_1.existsSync)(config)) {
                (0, fs_1.mkdirSync)(config);
            }
            if (!(0, fs_1.existsSync)(config + '/scans')) {
                (0, fs_1.mkdirSync)(config + '/scans');
            }
            let buff = Buffer.alloc(objectToStore.file.fileInfo.size, objectToStore.file.file, 'base64');
            (0, fs_1.writeFileSync)(config + '/scans/' + (result === null || result === void 0 ? void 0 : result.value._id) + '.' + type, buff);
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
        };
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, result, Response_1.ResponseDirection.outputSystem);
    }
    async search(params) {
        return super.search(params);
    }
    async delete(params) {
        return super.delete(params);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        return super.save(params);
    }
    async getScan(params) {
        let link = params.linkedTo;
        const scans = await this.search({ linkedTo: link });
        if (scans === null || scans === void 0 ? void 0 : scans.value[0]._id) {
            return { status: 200, Response: 'scans/' + (scans === null || scans === void 0 ? void 0 : scans.value[0]._id) + '.' + (scans === null || scans === void 0 ? void 0 : scans.value[0]._id.type), type: 'file' };
        }
        else {
            return { status: 404, Response: 'Img Not Found' };
        }
    }
    async saveScanReturnPath(objectToStore) {
        const type = (objectToStore.file.fileInfo && objectToStore.file.fileInfo.type).substring((objectToStore.file.fileInfo && objectToStore.file.fileInfo.type).indexOf('/') + 1);
        let config = __1.storeInstance.getConfig();
        const result = await this.save({ linkedTo: objectToStore.linkedTo, type: type });
        let Response = result;
        if (!(0, fs_1.existsSync)(config)) {
            (0, fs_1.mkdirSync)(config);
        }
        if (!(0, fs_1.existsSync)(config + '/scans')) {
            (0, fs_1.mkdirSync)(config + '/scans');
        }
        let buff = Buffer.alloc(objectToStore.file.fileInfo.size, objectToStore.file.file, 'base64');
        console.info(config + '/scans/' + (result === null || result === void 0 ? void 0 : result.value._id) + '.' + type);
        (0, fs_1.writeFileSync)(config + '/scans/' + (result === null || result === void 0 ? void 0 : result.value._id) + '.' + type, buff);
        Response.path = config + '/scans/' + (result === null || result === void 0 ? void 0 : result.value._id) + '.' + type;
        console.info(Response.path);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { path: config + '/scans/' + (result === null || result === void 0 ? void 0 : result.value._id) + '.' + type, ...Response }, Response_1.ResponseDirection.outputSystem);
    }
};
__decorate([
    (0, action_metadata_1.endPoint)({ inputs: [Middlewares_1.midExample] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "seed", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "search", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "delete", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "duplicate", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "save", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "getScan", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], scansCtrl.prototype, "saveScanReturnPath", null);
scansCtrl = __decorate([
    (0, module_metadata_1.Module)({
        inputs: [Model_1.scansSchema.getModuleValidator]
    })
], scansCtrl);
exports.default = scansCtrl;
//# sourceMappingURL=Controller.js.map