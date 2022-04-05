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
const Controller_1 = __importDefault(require("../../../core/base/Controller"));
const Response_1 = require("../../../core/interfaces/Response");
const action_metadata_1 = require("../../../core/metadata/action.metadata");
const module_metadata_1 = require("../../../core/metadata/module.metadata");
const providers_1 = require("../../../core/store/providers");
const Model_1 = require("../permission/Model");
const dispatcher_1 = require("../../../core/store/dispatcher");
const Middlewares_1 = require("./Middlewares");
const status_colis_1 = require("../colis/enums/status.colis");
const type_companies_1 = require("../companies/classes/type_companies");
var cron = require('node-cron');
cron.schedule('59 * * * *', async () => {
    let datNowH = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })).getHours();
    let min = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })).getMinutes();
    if (datNowH == 23) {
        try {
            await dispatcher_1.executeControllerAction({ module: 'cash_livreur', action: 'saveCash', params: {} });
            await dispatcher_1.executeControllerAction({ module: "cash", action: "calculeCashVendeur", params: {} });
            await dispatcher_1.executeControllerAction({ module: "cash", action: "calculeCashLivreur", params: {} });
            await dispatcher_1.executeControllerAction({ module: "colis", action: "noRepondStatus", params: { status: status_colis_1.StatusColis.RECOMANDER }, });
            await dispatcher_1.executeControllerAction({ module: "colis", action: "remporterStatus", params: { status: status_colis_1.StatusColis.RECOMANDER }, });
        }
        catch (e) {
            await dispatcher_1.executeControllerAction({ module: 'cash_livreur', action: 'test', params: { info: { exception: e } } });
        }
    } //else if(min == 59){
    //       await executeControllerAction({module:'cash_livreur',action:'test',params:{info:{datNowH,min}}})
    // }else{
    //   await executeControllerAction({module:'cash_livreur',action:'test2',params:{info:{datNowH,min}}})
    // }
});
let cash_livreurCtrl = class cash_livreurCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.modulePermissionDB = Model_1.Permission;
        this.moduleDB = options.cash_livreurRepository["cash_livreur"];
        this.colisDB = options.colisRepository["colis"];
        this.cronDB = options.cronRepository["cron"];
    }
    async test(params) {
        let cron = { name: "TEST_SUCCESS", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: [] };
        cron.data.push(params.info);
        await this.cronDB.create({ ...cron });
    }
    async test2(params) {
        let cron = { name: "TEST_FAIELD", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: [] };
        cron.data.push(params.info);
        await this.cronDB.create({ ...cron });
    }
    async saveCash() {
        let colisAll = await this.colisDB.find({
            satatusPaye: status_colis_1.StatusColis.DELEVRY,
            iscashWithLivreur: false,
        });
        let colis = colisAll.map((res) => res._doc);
        let livreursCash = [];
        colis = colis.map(el => {
            el.statusDate = new Date(el.statusDate).toLocaleString("en-US").split(',')[0];
            return el;
        });
        colis.filter((coli) => {
            if (livreursCash[coli.livreur]) {
                livreursCash[coli.livreur].push(coli);
            }
            else {
                livreursCash[coli.livreur] = [];
                livreursCash[coli.livreur].push(coli);
            }
        });
        Object.keys(livreursCash).filter(async (key) => {
            let byDate = [];
            livreursCash[key].filter(async (coli) => {
                if (byDate[coli.statusDate]) {
                    byDate[coli.statusDate].push(coli);
                }
                else {
                    byDate[coli.statusDate] = [];
                    byDate[coli.statusDate].push(coli);
                }
            });
            Object.keys(byDate).filter(async (keyDate) => {
                let total = 0;
                let orders = [];
                let companyName;
                let companyID;
                let livreurName;
                byDate[keyDate].filter(async (coli) => {
                    total += parseInt(coli.prix);
                    let x = { colis: coli._id.toString() };
                    orders.push(x);
                    companyName = coli.livreurName;
                    companyID = coli.livreur,
                        livreurName = coli.livreurUserName;
                });
                let obj = {
                    date: new Date(keyDate),
                    total: total.toString(),
                    orders: orders,
                    livreurId: key,
                    company: companyID,
                    companyName: companyName,
                    livreurName: livreurName
                };
                try {
                    let cash = await this.moduleDB.create({ ...obj });
                    let colisIds = cash.orders.map(order => order.colis);
                    await this.colisDB.update({ _id: { $in: [...colisIds] } }, [{ $set: {
                                iscashWithLivreur: true,
                            }
                        }], { multi: true });
                    let cron = { name: "cashLivreur", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: colis };
                    await this.cronDB.create({ ...cron });
                }
                catch (e) {
                    console.log("catch exception :", e);
                }
            });
        });
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
        // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let filter = { livreurId: user._id };
        let res;
        if (user.company.type == type_companies_1.TypesCompanies.admin) {
            filter = {};
            // res = await this.moduleDB.find({ ...params });
        }
        else if (user.company.type == type_companies_1.TypesCompanies.livreur) {
            filter = { company: user.company._id };
            //res = await this.moduleDB.find({ ...params,company:user.company._id });
        }
        res = await this.moduleDB.find({ ...params, ...filter }).sort({ createdAt: -1 });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async takeMoney(params) {
        let res = await this.moduleDB.update({ _id: params._id }, {
            $set: {
                take: true,
            },
        }, { multi: true });
        delete params._id;
        return this.search(params);
    }
    async delete(params) {
        return super.delete(params);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        return this.save(params);
    }
};
__decorate([
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cash_livreurCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cash_livreurCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cash_livreurCtrl.prototype, "takeMoney", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cash_livreurCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cash_livreurCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({
        inputs: [Middlewares_1.middleware.authenticateUser],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cash_livreurCtrl.prototype, "save", null);
cash_livreurCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [
            providers_1.getInjection("cash_livreurRepository").cash_livreurSchema
                .getModuleValidator,
            Middlewares_1.middleware.authenticateUser,
        ],
    }),
    __metadata("design:paramtypes", [Object])
], cash_livreurCtrl);
exports.default = cash_livreurCtrl;
//# sourceMappingURL=Controller.js.map