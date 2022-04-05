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
Object.defineProperty(exports, "__esModule", { value: true });
const lazyLoading_1 = require("../interfaces/lazyLoading");
const Response_1 = require("../interfaces/Response");
const action_metadata_1 = require("../metadata/action.metadata");
const Model_1 = require("./Model");
class BaseCtrl {
    constructor(options) {
        this.moduleDB = Model_1.repositoryBase['base'];
        // this.moduleDB = options.repositoryBase['base']
    }
    async search(params) {
        const queryResult = await this.moduleDB.find({ ...params });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, queryResult, Response_1.ResponseDirection.outputModule);
    }
    async delete(params) {
        const queries = await this.moduleDB.deleteOne({ ...params });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, queries, Response_1.ResponseDirection.outputModule);
    }
    async duplicate(params) {
        var _a;
        const queries = await ((_a = this.moduleDB) === null || _a === void 0 ? void 0 : _a.findOne({ _id: params._id }).select('_id:0 __v:0 dateCreation:0'));
        const insertedDocument = await this.moduleDB.create(queries);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, insertedDocument, Response_1.ResponseDirection.outputModule);
    }
    async save(params) {
        let queries;
        if (params._id) {
            queries = await this.moduleDB.updateOne({ _id: (params._id) }, { ...params });
        }
        else {
            queries = await this.moduleDB.create({ ...params });
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, queries, Response_1.ResponseDirection.outputSystem);
    }
    filterAndSort(event) {
        var _a;
        if (!event)
            return null;
        try {
            let sorts = {};
            (_a = event.multiSortMeta) === null || _a === void 0 ? void 0 : _a.filter(el => {
                sorts[el.field] = el.order;
            });
            if (Object.keys(sorts).length === 0)
                sorts["_id"] = 1;
            event.multiSortMeta = sorts;
            let filter = new lazyLoading_1.FilterTable();
            let filters = { $and: [], $or: [] };
            Object.keys(event.filters).forEach(key => {
                event.filters[key].forEach(el => {
                    if (el.value != null) {
                        let strFilter = filter.returnRegEx(el.matchMode, el.value);
                        let obj = {};
                        obj[key] = strFilter;
                        filters['$' + el.operator].push(obj);
                    }
                });
            });
            if (filters.$and.length <= 0)
                delete filters.$and;
            if (filters.$or.length <= 0)
                delete filters.$or;
            event.filters = filters;
        }
        catch (e) {
            console.log(e);
        }
        return event;
    }
    //handlingFiles 
    uploadFile() {
        console.log('uploadFile');
    }
    ;
    downloadZip() { }
    ;
    downloadFile() {
    }
    ;
}
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseCtrl.prototype, "search", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseCtrl.prototype, "delete", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseCtrl.prototype, "duplicate", null);
__decorate([
    (0, action_metadata_1.endPoint)({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BaseCtrl.prototype, "save", null);
exports.default = BaseCtrl;
//# sourceMappingURL=Controller.js.map