"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrederCash = exports.StoreCash = exports.Cash = void 0;
class Cash {
    constructor(company, number, type, companyName) {
        this.number = 0;
        this.store = [];
        this.date = new Date();
        this.type = "";
        this.datePayement = null;
        this.nb_orders = 0;
        this.total = 0;
        this.paye = false;
        this.confirme = false;
        this.company = "";
        this.companyName = "";
        this.orders = [];
        this.company = company;
        this.number = number;
        this.type = type;
        this.companyName = companyName;
    }
}
exports.Cash = Cash;
class StoreCash {
    constructor(name, total, nb_orders) {
        this.name = "";
        this.total = 0;
        this.nb_orders = 0;
        this.orders = [];
        this.name = name;
        this.nb_orders = nb_orders;
        this.total = total;
    }
}
exports.StoreCash = StoreCash;
class OrederCash {
    constructor() {
        this.prix_livrison = 0;
        this.prix_annule = 0;
        this.prix_refuse = 0;
        this.total = 0;
        this.prix = 0;
        this.colis = "";
    }
}
exports.OrederCash = OrederCash;
//# sourceMappingURL=interface.js.map