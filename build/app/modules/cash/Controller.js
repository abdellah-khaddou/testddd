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
exports.Cashes = void 0;
const Controller_1 = __importDefault(require("../../../core/base/Controller"));
const Response_1 = require("../../../core/interfaces/Response");
const action_metadata_1 = require("../../../core/metadata/action.metadata");
const module_metadata_1 = require("../../../core/metadata/module.metadata");
const providers_1 = require("../../../core/store/providers");
const status_colis_1 = require("../colis/enums/status.colis");
const type_companies_1 = require("../companies/classes/type_companies");
const Middlewares_1 = require("./Middlewares");
let cashCtrl = class cashCtrl extends Controller_1.default {
    constructor(options) {
        super(options);
        this.counterCashV = 0;
        this.counterCashL = 0;
        this.moduleDB = options.cashRepository["cash"];
        this.colisDB = options.colisRepository["colis"];
        this.villesDB = options.villesRepository["villes"];
        this.cronDB = options.cronRepository["cron"];
    }
    async calculeCashVendeur() {
        let cron = { name: "cash Vendeur DEBUT", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: "null" };
        await this.cronDB.create({ ...cron });
        try {
            let status = [
                status_colis_1.StatusColis.DELEVRY,
                status_colis_1.StatusColis.ANUULE,
                status_colis_1.StatusColis.REFUSE,
                status_colis_1.StatusColis.RECUPIRER,
            ];
            let colisAll = await this.colisDB
                .find({ satatusPaye: { $in: [...status] }, isCashVendeur: false, statusFinal: true });
            let n = await this.generatenumber();
            this.counterCashV = +n;
            let colis = colisAll.map((res) => res._doc);
            let vendeurCash = [];
            colis === null || colis === void 0 ? void 0 : colis.forEach((coli) => {
                if (vendeurCash[coli.vendeur]) {
                    vendeurCash[coli.vendeur].push(coli);
                }
                else {
                    vendeurCash[coli.vendeur] = [];
                    vendeurCash[coli.vendeur].push(coli);
                }
            });
            let ids = colisAll.map((res) => res._id);
            await this.colisDB.update({ _id: { $in: [...ids] } }, {
                $set: {
                    isCashVendeur: true,
                },
            }, { multi: true });
            let objs = [];
            Object.keys(vendeurCash).forEach((key) => {
                let ids = [];
                let vendeurName;
                try {
                    vendeurCash[key].forEach((coli) => {
                        vendeurName = coli.vendeurName;
                        ids.push(coli._id.toString());
                    });
                }
                catch (e) {
                    console.error(e);
                }
                let obj = {
                    number: this.counterCashV,
                    type: "VENEDEUR",
                    colis: ids,
                    company: key,
                    companyName: vendeurName,
                    date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })),
                    createdBy: "SYSTEME",
                    createdAt: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })),
                    nb_orders: ids.length,
                    total: 0,
                };
                this.counterCashV = this.counterCashV + 1;
                objs.push(obj);
            });
            let res = await this.moduleDB.insertMany(objs);
            let cron = { name: "cash Vendeur Success", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: colis };
            await this.cronDB.create({ ...cron });
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { message: res }, Response_1.ResponseDirection.outputSystem);
        }
        catch (exception) {
            console.error(exception);
            let cron = { name: "cash Vendeur catch", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: exception };
            await this.cronDB.create({ ...cron });
        }
    }
    async addcash(params) {
        await this.colisDB.update({}, {
            $set: {
                isCashVendeur: params.cash,
                isCashLivreur: params.cash
            },
        }, { multi: true });
    }
    async calculeCashLivreur() {
        try {
            let status = [
                status_colis_1.StatusColis.DELEVRY,
                status_colis_1.StatusColis.ANUULE,
                status_colis_1.StatusColis.REFUSE,
                status_colis_1.StatusColis.RECUPIRER,
            ];
            let colisAll = await this.colisDB
                .find({ satatusPaye: { $in: [...status] }, isCashLivreur: false, statusFinal: true });
            let n = await this.generatenumber();
            this.counterCashL = +n;
            let colis = colisAll.map((res) => res._doc);
            let livreursCash = [];
            colis === null || colis === void 0 ? void 0 : colis.forEach((coli) => {
                if (livreursCash[coli.livreur]) {
                    livreursCash[coli.livreur].push(coli);
                }
                else {
                    livreursCash[coli.livreur] = [];
                    livreursCash[coli.livreur].push(coli);
                }
            });
            let ids = colisAll.map((res) => res._id);
            await this.colisDB.update({ _id: { $in: [...ids] } }, {
                $set: {
                    isCashLivreur: true,
                },
            }, { multi: true });
            let objs = [];
            Object.keys(livreursCash).forEach((key) => {
                let ids = [];
                let livreurName;
                livreursCash[key].forEach((coli) => {
                    livreurName = coli.livreurName;
                    ids.push(coli._id);
                });
                let obj = {
                    number: this.counterCashL,
                    type: "LIVREUR",
                    colis: ids,
                    company: key,
                    companyName: livreurName,
                    date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })),
                    createdBy: "SYSTEME",
                    createdAt: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })),
                    nb_orders: ids.length,
                    total: 0,
                };
                objs.push(obj);
            });
            this.counterCashL = this.counterCashL + 1;
            await this.moduleDB.insertMany(objs);
            let cron = { name: "cash Livreur success", date: new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" })), data: colis };
            await this.cronDB.create({ ...cron });
            return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, { message: "Success" }, Response_1.ResponseDirection.outputSystem);
        }
        catch (exception) {
            console.error(exception);
        }
    }
    async generatenumber() {
        let count = await this.moduleDB.count({});
        let str = (count + 1).toString();
        return str;
    }
    async getCachTodayVendeurs(params) {
        let user = params.middleWareEffect.user;
        let filter = {};
        if (user.company.type != type_companies_1.TypesCompanies.admin && user.company.type == type_companies_1.TypesCompanies.vendeur)
            filter["vendeur"] = user === null || user === void 0 ? void 0 : user.company._id;
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            filter = {};
        }
        else {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { message: "not permision" }, Response_1.ResponseDirection.outputSystem);
        }
        delete params.middleWareEffect;
        let status = [
            status_colis_1.StatusColis.DELEVRY,
            status_colis_1.StatusColis.ANUULE,
            status_colis_1.StatusColis.REFUSE,
            status_colis_1.StatusColis.RECUPIRER,
        ];
        params.satatusPaye = { $in: [...status] };
        params.isCashVendeur = false;
        params.statusFinal = true;
        let colis = await this.colisDB.aggregate([
            {
                $match: { ...params, ...filter }
            },
            {
                $project: {
                    vendeur: 1, status: 1, isCashVendeur: 1, type: 1, ville_depart: 1, ville_arrive: 1, prix: 1, store: 1,
                    prix_livrison: 1, traking: 1,
                    prix_anulle: 1, nb_order: 1,
                    prix_refuse: 1, statusDate: 1,
                    prix_livreur: 1, vendeurName: 1, livreurName: 1, livreur: 1, statusFinal: 1, satatusPaye: 1
                }
            },
        ]);
        let vendeursCash = [];
        colis.forEach(coli => {
            if (vendeursCash[coli.vendeur]) {
                vendeursCash[coli.vendeur].push(coli);
            }
            else {
                vendeursCash[coli.vendeur] = [];
                vendeursCash[coli.vendeur].push(coli);
            }
        });
        let cashes = [];
        Object.keys(vendeursCash).forEach(key => {
            var _a;
            let cash = new Cashes("VENDEUR", key, vendeursCash[key][0].vendeurName);
            let stores = [];
            cash.nb_orders = (_a = vendeursCash[key]) === null || _a === void 0 ? void 0 : _a.length;
            vendeursCash[key].forEach(coli => {
                cash.colis.push(coli);
                if (coli.satatusPaye == status_colis_1.StatusColis.ANUULE || coli.satatusPaye == status_colis_1.StatusColis.RECUPIRER) {
                    cash.total -= parseInt(coli.prix_anulle) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.REFUSE) {
                    cash.total -= parseInt(coli.prix_refuse) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.DELEVRY) {
                    cash.total += (parseInt(coli.prix) - parseInt(coli.prix_livrison)) || 0;
                }
                //debut
                if (stores[coli.store]) {
                    stores[coli.store].push(coli);
                }
                else {
                    stores[coli.store] = [];
                    stores[coli.store].push(coli);
                }
                //fin
            });
            Object.keys(stores).forEach(key => {
                let store = { name: key, nbOrders: stores[key].length, total: 0, colis: stores[key] };
                stores[key].forEach(coli => {
                    if (coli.satatusPaye == status_colis_1.StatusColis.ANUULE || coli.satatusPaye == status_colis_1.StatusColis.RECUPIRER) {
                        store.total -= parseInt(coli.prix_anulle) || 0;
                    }
                    else if (coli.satatusPaye == status_colis_1.StatusColis.REFUSE) {
                        store.total -= parseInt(coli.prix_refuse) || 0;
                    }
                    else if (coli.satatusPaye == status_colis_1.StatusColis.DELEVRY) {
                        store.total += (parseInt(coli.prix) - parseInt(coli.prix_livrison)) || 0;
                    }
                });
                cash.stores.push(store);
            });
            cashes.push(cash);
        });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, cashes, Response_1.ResponseDirection.outputSystem);
    }
    async getCachTodaylivreurs(params) {
        let user = params.middleWareEffect.user;
        let filter = {};
        if (user.company.type != type_companies_1.TypesCompanies.admin && user.company.type == type_companies_1.TypesCompanies.livreur)
            filter["livreur"] = user === null || user === void 0 ? void 0 : user.company._id;
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            filter = {};
        }
        else {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { message: "not permision" }, Response_1.ResponseDirection.outputSystem);
        }
        delete params.middleWareEffect;
        let status = [
            status_colis_1.StatusColis.DELEVRY,
            status_colis_1.StatusColis.ANUULE,
            status_colis_1.StatusColis.REFUSE,
            status_colis_1.StatusColis.RECUPIRER,
        ];
        params.satatusPaye = { $in: [...status] };
        params.isCashLivreur = false;
        params.statusFinal = true;
        let colis = await this.colisDB.aggregate([
            {
                $match: { ...params, ...filter }
            },
            {
                $project: {
                    vendeur: 1, status: 1, isCashLivreur: 1, type: 1, ville_depart: 1, ville_arrive: 1, prix: 1, store: 1,
                    prix_livrison: 1, traking: 1, statusDate: 1,
                    prix_anulle: 1, nb_order: 1,
                    prix_refuse: 1,
                    prix_livreur: 1, vendeurName: 1, livreurName: 1, livreur: 1, statusFinal: 1, satatusPaye: 1
                }
            },
        ]);
        let livreursCash = [];
        colis.forEach(coli => {
            if (livreursCash[coli.livreur]) {
                livreursCash[coli.livreur].push(coli);
            }
            else {
                livreursCash[coli.livreur] = [];
                livreursCash[coli.livreur].push(coli);
            }
        });
        let cashes = [];
        Object.keys(livreursCash).forEach(key => {
            var _a;
            let cash = new Cashes("LIVREUR", key, livreursCash[key][0].livreurName);
            cash.nb_orders = (_a = livreursCash[key]) === null || _a === void 0 ? void 0 : _a.length;
            livreursCash[key].forEach(coli => {
                if (!coli.prix_livreur)
                    coli.prix_livreur = { prix_livrison: 0, prix_anulle: 0, prix_refuse: 0 };
                cash.colis.push(coli);
                if (coli.satatusPaye == status_colis_1.StatusColis.ANUULE || coli.satatusPaye == status_colis_1.StatusColis.RECUPIRER) {
                    cash.total -= parseInt(coli.prix_livreur.prix_anulle) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.REFUSE) {
                    cash.total -= parseInt(coli.prix_livreur.prix_refuse) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.DELEVRY) {
                    cash.total += (parseInt(coli.prix) - parseInt(coli.prix_livreur.prix_livrison)) || 0;
                }
            });
            cashes.push(cash);
        });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, cashes, Response_1.ResponseDirection.outputSystem);
    }
    getPrixService(coli, villes) {
        let price = { prix_livrison: 0, prix_anulle: 0, prix_refuse: 0 };
        villes.filter(ville => {
            if (ville.ville_depart == coli.ville_depart &&
                ville.ville_arrive.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") == coli.ville_arrive.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") &&
                ville.type == coli.type.name &&
                ville.type_value == coli.type.value && ville.livreur == coli.livreur) {
                price.prix_livrison = parseInt(ville.prix_livrision) || 0;
                price.prix_anulle = parseInt(ville.prix_annule) || 0;
                price.prix_refuse = parseInt(ville.prix_refuse) || 0;
            }
        });
        return price;
    }
    prepareFilterDate(filterDate) {
        //{$and: [{ date: { $lte:ISODate('2021-12-30')} } ]}
        if (filterDate.max && filterDate.min) {
            return { $and: [{ date: { $lte: new Date(filterDate.max) } }, { date: { $gte: new Date(filterDate.min) } }] };
        }
        else {
            if (filterDate.max) {
                return { $and: [{ date: { $lte: new Date(filterDate.max) } }] };
            }
            else if (filterDate.min) {
                return { $and: [{ date: { $gte: new Date(filterDate.min) } }] };
            }
        }
        return {};
    }
    async getcashLivreurs(params) {
        let user = params.middleWareEffect.user;
        let filterDate = this.prepareFilterDate(params.filterDate);
        delete params.filterDate;
        let filter = {};
        if (user.company.type != type_companies_1.TypesCompanies.admin && user.company.type == type_companies_1.TypesCompanies.livreur)
            filter["company"] = user === null || user === void 0 ? void 0 : user.company._id;
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            filter = {};
        }
        else {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { message: "not permision" }, Response_1.ResponseDirection.outputSystem);
        }
        delete params.middleWareEffect;
        let cashes = await this.moduleDB.aggregate([
            { $match: { ...params, type: "LIVREUR", ...filter } },
            { $match: { ...filterDate } },
            {
                $unwind: "$colis"
            },
            {
                $lookup: {
                    from: "colis",
                    let: {
                        idcolis: {
                            $convert: {
                                input: "$colis",
                                to: "objectId",
                                onError: "",
                                onNull: "",
                            },
                        },
                    },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$idcolis"] } } },
                        { $project: {
                                type: 1, ville_depart: 1, ville_arrive: 1, prix: 1,
                                prix_livreur: 1, satatusPaye: 1, status: 1, statusDate: 1, traking: 1, nb_order: 1
                            } }
                    ],
                    as: "colisCashes",
                },
            },
            {
                $unwind: "$colisCashes"
            },
            {
                $group: {
                    _id: "$_id",
                    colis: { "$push": "$colisCashes" },
                    date: { $first: "$date" },
                    datePayement: { $first: "$datePayement" },
                    nb_orders: { $first: "$nb_orders" },
                    total: { $first: "$total" },
                    paye: { $first: "$paye" },
                    company: { $first: "$company" },
                    companyName: { $first: "$companyName" },
                    confirme: { $first: "$confirme" },
                    createdBy: { $first: "$createdBy" },
                    createdAt: { $first: "$createdAt" }
                }
            }
        ]);
        cashes.filter(cash => {
            cash.colis.filter(coli => {
                if (!coli.prix_livreur)
                    coli.prix_livreur = { prix_livrison: 0, prix_anulle: 0, prix_refuse: 0 };
                if (coli.satatusPaye == status_colis_1.StatusColis.ANUULE || coli.satatusPaye == status_colis_1.StatusColis.RECUPIRER) {
                    cash.total -= parseInt(coli.prix_livreur.prix_anulle) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.REFUSE) {
                    cash.total -= parseInt(coli.prix_livreur.prix_refuse) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.DELEVRY) {
                    cash.total += (parseInt(coli.prix) - parseInt(coli.prix_livreur.prix_livrison)) || 0;
                }
                return coli;
            });
            return cash;
        });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, cashes, Response_1.ResponseDirection.outputSystem);
    }
    async getcashVendeurs(params) {
        let user = params.middleWareEffect.user;
        let filter = {};
        let filterDate = this.prepareFilterDate(params.filterDate);
        delete params.filterDate;
        if (user.company.type != type_companies_1.TypesCompanies.admin && user.company.type == type_companies_1.TypesCompanies.vendeur)
            filter["company"] = user === null || user === void 0 ? void 0 : user.company._id;
        else if (user.company.type == type_companies_1.TypesCompanies.admin) {
            filter = {};
        }
        else {
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { message: "not permision" }, Response_1.ResponseDirection.outputSystem);
        }
        delete params.middleWareEffect;
        let cashes = await this.moduleDB.aggregate([
            { $match: { ...params, type: "VENEDEUR", ...filter } },
            { $match: { ...filterDate } },
            {
                $unwind: "$colis"
            },
            {
                $lookup: {
                    from: "colis",
                    let: {
                        idcolis: {
                            $convert: {
                                input: "$colis",
                                to: "objectId",
                                onError: "",
                                onNull: "",
                            },
                        },
                    },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$idcolis"] } } },
                        { $project: {
                                vendeur: 1, type: 1, ville_depart: 1, ville_arrive: 1, prix: 1, store: 1,
                                prix_livrison: 1,
                                prix_anulle: 1, nb_order: 1,
                                prix_refuse: 1, statusDate: 1,
                                vendeurName: 1, satatusPaye: 1, traking: 1
                            } }
                    ],
                    as: "colisCashes",
                },
            },
            {
                $unwind: "$colisCashes"
            },
            {
                $group: {
                    _id: "$_id",
                    colis: { "$push": "$colisCashes" },
                    date: { $first: "$date" },
                    datePayement: { $first: "$datePayement" },
                    nb_orders: { $first: "$nb_orders" },
                    total: { $first: "$total" },
                    paye: { $first: "$paye" },
                    company: { $first: "$company" },
                    companyName: { $first: "$companyName" },
                    confirme: { $first: "$confirme" },
                    createdBy: { $first: "$createdBy" },
                    createdAt: { $first: "$createdAt" },
                    stores: { $first: "$stores" }
                }
            }
        ]);
        cashes.filter(cash => {
            let stores = [];
            cash.stores = [];
            cash.colis.forEach(coli => {
                if (coli.satatusPaye == status_colis_1.StatusColis.ANUULE || coli.satatusPaye == status_colis_1.StatusColis.RECUPIRER) {
                    cash.total -= parseInt(coli.prix_anulle) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.REFUSE) {
                    cash.total -= parseInt(coli.prix_refuse) || 0;
                }
                else if (coli.satatusPaye == status_colis_1.StatusColis.DELEVRY) {
                    cash.total += (parseInt(coli.prix) - parseInt(coli.prix_livrison)) || 0;
                }
                if (stores[coli.store]) {
                    stores[coli.store].push(coli);
                }
                else {
                    stores[coli.store] = [];
                    stores[coli.store].push(coli);
                }
            });
            Object.keys(stores).forEach(key => {
                let store = { name: key, nbOrders: stores[key].length, total: 0, colis: stores[key] };
                stores[key].forEach(coli => {
                    if (coli.satatusPaye == status_colis_1.StatusColis.ANUULE || coli.satatusPaye == status_colis_1.StatusColis.RECUPIRER) {
                        store.total -= parseInt(coli.prix_anulle) || 0;
                    }
                    else if (coli.satatusPaye == status_colis_1.StatusColis.REFUSE) {
                        store.total -= parseInt(coli.prix_refuse) || 0;
                    }
                    else if (coli.satatusPaye == status_colis_1.StatusColis.DELEVRY) {
                        store.total += (parseInt(coli.prix) - parseInt(coli.prix_livrison)) || 0;
                    }
                });
                cash.stores.push(store);
            });
            return cash;
        });
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, cashes, Response_1.ResponseDirection.outputSystem);
    }
    async seed(params) {
        let result = await this.moduleDB.create({});
        return {};
    }
    async search(params) {
        let user = params.middleWareEffect.user;
        delete params.middleWareEffect;
        let res;
        if ((user === null || user === void 0 ? void 0 : user.company.type) == type_companies_1.TypesCompanies.admin) {
            res = await this.moduleDB.find({ ...params });
        }
        else if ((user === null || user === void 0 ? void 0 : user.company.type) == type_companies_1.TypesCompanies.vendeur) {
            res = await this.moduleDB
                .find({ ...params, company: user.company._id })
                .populate("store.orders.colis");
        }
        else if ((user === null || user === void 0 ? void 0 : user.company.type) == type_companies_1.TypesCompanies.livreur) {
            res = await this.moduleDB
                .find({ ...params, company: user.company._id })
                .populate("orders.colis");
        }
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, res, Response_1.ResponseDirection.outputSystem);
    }
    async delete(params) {
        return super.delete(params);
    }
    async duplicate(params) {
        return super.duplicate(params);
    }
    async save(params) {
        //return new formattedResponse(ResponseStatus.badRequest, {error:params}, ResponseDirection.outputSystem);
        if (params.colis.length < 1)
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "pas de colis" }, Response_1.ResponseDirection.outputSystem);
        let code;
        do {
            code = await this.genereateCode(params.type);
        } while (!code);
        let status = "NON_ENVOYE";
        if (params.type == "BL") {
            status = "ENVOYE";
        }
        let cash = {
            code: code || "BL-12345",
            type: params.type,
            company: params.companyID,
            colis: [],
            status: status,
        };
        cash.colis.push(...params.colis);
        if (code)
            return super.save(cash);
        else
            return new Response_1.formattedResponse(Response_1.ResponseStatus.badRequest, { error: "pas de code" }, Response_1.ResponseDirection.outputSystem);
    }
    async genereateCode(type) {
        let possibleN = "0123456789";
        let str = type + "-";
        for (let i = 0; i < 5; i++) {
            str += possibleN.charAt(Math.random() * possibleN.length);
        }
        return str;
    }
    async changestatus(params) {
        let user = params.middleWareEffect.user;
        if (!user || user.company.type != type_companies_1.TypesCompanies.admin)
            return new Response_1.formattedResponse(Response_1.ResponseStatus.unAuthorized, "no user object", Response_1.ResponseDirection.outputSystem);
        if (params.change == "confirme") {
            return this.confirme(params);
        }
        else if (params.change == "paye") {
            return this.paye(params);
        }
    }
    async confirme(params) {
        let cashsIds = params.cashs;
        let res = await this.moduleDB.update({ _id: { $in: [...cashsIds] } }, { $set: { confirme: params.confirme } }, { multi: true });
        let paramsPayement;
        if (params.type == "VENDEUR") {
            paramsPayement = { statusPayementVendeur: "VENDEUR_CONFIRME_CASH" };
        }
        else {
            paramsPayement = { statusPayementLivreur: "LIVREUR_CONFIRME_CASH" };
        }
        await this.changeStatusPayementColis(cashsIds, paramsPayement);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, cashsIds, Response_1.ResponseDirection.outputSystem);
    }
    async paye(params) {
        let cashsIds = params.cashs;
        let res = await this.moduleDB.update({ _id: { $in: [...cashsIds] } }, { $set: { paye: params.paye } }, { multi: true });
        let paramsPayement;
        if (params.type == "VENDEUR") {
            paramsPayement = { statusPayementVendeur: "VENDEUR_PAYE_CASH" };
        }
        else {
            paramsPayement = { statusPayementLivreur: "LIVREUR_PAYE_CASH" };
        }
        await this.changeStatusPayementColis(cashsIds, paramsPayement);
        return new Response_1.formattedResponse(Response_1.ResponseStatus.succes, cashsIds, Response_1.ResponseDirection.outputSystem);
    }
    async changeStatusPayementColis(cashIds, params) {
        let cashs = await this.moduleDB.find({ _id: { $in: [...cashIds] } }, { colis: 1 });
        await (cashs === null || cashs === void 0 ? void 0 : cashs.filter(async (cash) => {
            let res = await this.colisDB.update({ _id: { $in: [...cash.colis] } }, { $set: { ...params } }, { multi: true });
        }));
    }
};
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "calculeCashVendeur", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "addcash", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "calculeCashLivreur", null);
__decorate([
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "getCachTodayVendeurs", null);
__decorate([
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "getCachTodaylivreurs", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "getcashLivreurs", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "getcashVendeurs", null);
__decorate([
    action_metadata_1.endPoint({ inputs: [] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "seed", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "search", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "delete", null);
__decorate([
    action_metadata_1.endPoint({}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "duplicate", null);
__decorate([
    action_metadata_1.endPoint({
        inputs: [Middlewares_1.middleware.authenticateUser],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "save", null);
__decorate([
    action_metadata_1.endPoint({
        inputs: [Middlewares_1.middleware.authenticateUser],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], cashCtrl.prototype, "changestatus", null);
cashCtrl = __decorate([
    module_metadata_1.Module({
        inputs: [
            providers_1.getInjection("cashRepository").cashSchema.getModuleValidator,
            Middlewares_1.middleware.authenticateUser,
        ],
    }),
    __metadata("design:paramtypes", [Object])
], cashCtrl);
exports.default = cashCtrl;
class Cashes {
    constructor(type, company, companyName) {
        this.type = type;
        this.company = company;
        this.companyName = companyName;
        this.colis = [];
        this.orders = [];
        this.date = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
        this.datePayement = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
        this.nb_orders = 0;
        this.total = 0;
        this.paye = false;
        this.confirme = false;
        this.createdBy = "SYSTEM";
        this.createdAt = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Casablanca" }));
        this.stores = [];
    }
}
exports.Cashes = Cashes;
//# sourceMappingURL=Controller.js.map