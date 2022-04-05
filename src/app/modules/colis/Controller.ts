import BaseCtrl from "../../../core/base/Controller";
import {
  formattedResponse,
  ResponseDirection,
  ResponseStatus,
} from "../../../core/interfaces/Response";
import { endPoint } from "../../../core/metadata/action.metadata";
import { Module } from "../../../core/metadata/module.metadata";
import { getInjection } from "../../../core/store/providers";

import { executeControllerAction } from "./../../../core/store/dispatcher";
import { middleware } from "./Middlewares";
import { colisRepository } from "./Model";
import { clientsRepository } from "../clients/Model";
import { clientshistoryRepository } from "../clientshistory/Model";
import { SubTypesColisEnum, TypesColisEnum } from "./enums/types.colis";
import { StatusColis } from "./enums/status.colis";
import { Emplacement } from "./enums/emplacement";
import bonCtrl from "../bon/Controller";
import { colishistoryRepository } from "../colishistory/Model";
import {
  TypesCompanies,
  TypesRoles,
} from "../companies/classes/type_companies";
import { bonRepository } from "../bon/Model";
import { villesRepository } from "../villes/Model";
var cron = require("node-cron");


@Module({
  inputs: [
    getInjection("colisRepository").colisSchema.getModuleValidator,
    middleware.authenticateUser,
    // middleware.hasPermission
  ],
})
export default class colisCtrl extends BaseCtrl {
  moduleDB: colisRepository["colis"];
  clientModel: clientsRepository["clients"];
  villeModel: villesRepository["villes"];
  bonModel: bonRepository["bon"];
  clientHistoryModel: clientshistoryRepository["clientshistory"];
  colisHistoryDB: colishistoryRepository["colishistory"];
  bonctrl: bonCtrl;
  options: any;
  constructor(options) {
    super(options);
    this.moduleDB = options.colisRepository["colis"];
    this.clientModel = options.clientsRepository["clients"];
    this.villeModel = options.villesRepository["villes"];
    this.bonModel = options.bonRepository["bon"];
    this.clientHistoryModel =
      options.clientshistoryRepository["clientshistory"];
    this.colisHistoryDB = options.colishistoryRepository["colishistory"];
    this.options = options;

    this.bonctrl = new bonCtrl(options);
  }
  async noRepondStatus() {
    //,dateRecomande :{$lte: new Date()}
    let colisRapeel = await this.moduleDB.find({ status: StatusColis.RAPALLE });
    if (colisRapeel && colisRapeel.length > 0) {
      let colisIds: any[] = colisRapeel.map((res) => {
        return res._id;
      });

      let res = await this.moduleDB.update(
        { _id: { $in: [...colisIds] } },
        [
          {
            $set: {
              status: StatusColis.ENCOUR_DELEVRY,
              statusFinal: false,
              statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
              auto: true,
            },
          },
        ],
        { multi: true }
      );

      let coliHistorys: any[] = [];
      colisRapeel.forEach((res) => {
        let coliHistory = {
          status: StatusColis.ENCOUR_DELEVRY,
          description: "",
          date: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
          dateReclame: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
          coli: res._id,
          emplacement: "HUB" + " " + res.hub,
          company: res.livreur,
        };
        coliHistorys.push(coliHistory);
      });

      if (res) await this.colisHistoryDB.insertMany(coliHistorys);
    }
    await this.moduleDB.update(
      { traking: "S188ACR9AN" },
      [{ $set: { store: "Rapel " + colisRapeel.join(";") } }],
      { multi: true }
    );
  }

  async remporterStatus() {
    //,dateRecomande :{$lte: new Date()}

    let colis = await this.moduleDB.aggregate([
      {
        $match: {
          status: StatusColis.RECOMANDER,
        },
      },
      {
        $addFields: {
          daysCount: {
            $round: {
              $divide: [
                {
                  $subtract: [new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})), "$dateRecomande"],
                },
                86400000,
              ],
            },
          },
        },
      },
    ]);

    colis = colis.filter((coli) => coli.daysCount >= 0);

    if (colis && colis.length > 0) {
      let colisIds: any[] = colis.map((res) => {
        return res._id;
      });

      let res = await this.moduleDB.update(
        { _id: { $in: [...colisIds] } },
        [
          {
            $set: {
              status: StatusColis.ENCOUR_DELEVRY,
              statusFinal: false,
              statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
              auto: true,
            },
          },
        ],
        { multi: true }
      );

      let coliHistorys: any[] = [];
      colis.forEach((res) => {
        let coliHistory = {
          status: StatusColis.ENCOUR_DELEVRY,
          description: "",
          date: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
          dateReclame: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
          coli: res._id,
          emplacement: "HUB" + " " + res.hub,
          company: res.livreur,
        };
        coliHistorys.push(coliHistory);
      });

      if (res) await this.colisHistoryDB.insertMany(coliHistorys);
    }

    await this.moduleDB.update(
      { traking: "S188ACR9AN" },
      [{ $set: { name: "Rapel " + colis.join(";") } }],
      { multi: true }
    );
  }
  @endPoint({ inputs: [] })
  async seed(params: any) {
    let result = await this.moduleDB.create({});
    return {};
    // return  new formattedResponse(ResponseStatus.succes, result , ResponseDirection.outputSystem)
  }
  @endPoint({})
  async getStatistic(params){

    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    var newdate = new Date();
    let last7Days =new Date( newdate.setDate(newdate.getDate()-7));
    let perFilter
    if (user?.company.type == TypesCompanies.admin) {
      perFilter = {};
      //res= await this.moduleDB.find({...params}).populate("vendeur")
    } else if (user?.company.type == TypesCompanies.vendeur) {
      perFilter = {};
      perFilter["vendeur"] = user.company._id;
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
        perFilter["livreurUser"] = user._id;
      } else {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
      }
    }
   let res = await this.moduleDB.aggregate([
      {
      $facet: {
        stausLast7: [
          {$match: { ...perFilter }},
          {$match: {$or: [{status:StatusColis.ANUULE},{status:StatusColis.REFUSE},{status:StatusColis.DELEVRY}]}},
          {$match: {'statusDate': {$gt: last7Days}}},
          // // Duplicate the docs, one per passedModules element
           {$unwind: '$statusDate'},
          // // Filter again to remove the non-matching elements
           {$match: {'statusDate': {$gt: last7Days}}},
          {
            $group: {
              _id: {
                status: "$status",
                day: { $dayOfMonth: "$statusDate" },
              },
              count: {
                $sum: 1
              },
             
          

            
            }
          }
        ],
        statusNumber:[
          {$match: { ...perFilter }},
          {
            $group: {
              _id: {
                status: "$status",
                
              },
              count: {
                $sum: 1
              },
              status: {
                $first: "$status"
              },
              
          

            
            }
          }

        ],
        countOfColis:[
          {$match: { ...perFilter }},
          {
            $group: {
              _id: null,
              count: {
                $sum: 1
              },
              
          

            
            }
          }

        ]

      }
      
    }])
    let  stausLast7 : {status:any ,data:any[],label:any[]}[] = []
    res[0]?.stausLast7?.filter(status =>{
        if(stausLast7.some(last=>last.status == status._id.status)){
          stausLast7.filter(sta=>{
            if(sta.status == status._id.status ){
              sta.data.push(status.count)
              sta.label.push(status._id.day)
            }
            return sta
          })
        }else{
          stausLast7.push({status:status._id.status,data:[],label:[]})
          stausLast7.filter(sta=>{
            if(sta.status == status._id.status ){
              sta.data.push(status.count)
              sta.label.push(status._id.day)
            }
            return sta
          })
        }
    })


    return new formattedResponse(
      ResponseStatus.succes,
      {res,stausLast7}, 
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async searchPagination(params: any) {
    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    let res;
    let event = this.filterAndSort(params.event);
    delete params.event;
    let perFilter: any = null;
    if (user?.company.type == TypesCompanies.admin) {
      perFilter = {};
      //res= await this.moduleDB.find({...params}).populate("vendeur")
    } else if (user?.company.type == TypesCompanies.vendeur) {
      perFilter = {};
      perFilter["vendeur"] = user.company._id;
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
        perFilter["livreurUser"] = user._id;
      } else {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
      }
    }
    if (perFilter == null)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { errors: "not Auth" },
        ResponseDirection.outputSystem
      );
    res = await this.moduleDB.aggregate([
      {
        $match: { ...params, ...perFilter },
      },

      {
        $addFields: {
         
          statusName: "$status",
          statusvandeurName: "$statusVendeur.name",

          typeCode: {
            $concat: [
              {
                $toUpper: {
                  $substr: ["$type.name", 0, 1],
                },
              },
              "[",
              {
                $toUpper: {
                  $substr: ["$type.value", 0, 1],
                },
              },
              "]",
            ],
          },
        },
      },

      {
        $match: { ...event?.filters },
      },
      {
        $facet: {
          totalCount: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          colis: [
            {
              $match: { ...params },
            },
            {
              $addFields: {
                statusName: "$status",
                statusvandeurName: "$statusVendeur.name",
                info: [
                  {
                    store: "$store",
                    nb_order: "$nb_order",
                    BL: "$BL",
                    name: "$name",
                    tel: "$tel",
                    adresse: "$adresse",
                    produit: "$produit",
                  },
                ],
                typeCode: {
                  $concat: [
                    {
                      $toUpper: {
                        $substr: ["$type.name", 0, 1],
                      },
                    },
                    "[",
                    {
                      $toUpper: {
                        $substr: ["$type.value", 0, 1],
                      },
                    },
                    "]",
                  ],
                },
              },
            },

            {
              $match: { ...event?.filters },
            },
            {
              $sort: event.multiSortMeta,
            },
            {
              $skip: event.first,
            },
            {
              $limit: event.rows,
            },
          ],
        },
      },
    ]);

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }

  @endPoint({})
  async search(params: any) {
    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    let res;

    let perFilter: any = null;
    if (user?.company.type == TypesCompanies.admin) {
      perFilter = {};
      //res= await this.moduleDB.find({...params}).populate("vendeur")
    } else if (user?.company.type == TypesCompanies.vendeur) {
      perFilter = {};
      perFilter["vendeur"] = user.company._id;
    
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
        perFilter["livreurUser"] = user._id;
      } else {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
      }
    }
    if (perFilter == null)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { errors: "not Auth" },
        ResponseDirection.outputSystem
      );
    res = await this.moduleDB
      .find({ ...params, ...perFilter })
      .populate("vendeur");
     

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async getLivreurAndVendeur(params: any) {
    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    let res;
    let perFilter: any = null;
    if (user?.company.type == TypesCompanies.admin) {
      perFilter = {};
      //res= await this.moduleDB.find({...params}).populate("vendeur")
    } else if (user?.company.type == TypesCompanies.vendeur) {
      perFilter = {};
      perFilter["vendeur"] = user.company._id;
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
        perFilter["livreurUser"] = user._id;
      } else {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
      }
    }
    if (perFilter == null)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { errors: "not Auth" },
        ResponseDirection.outputSystem
      );
    res = await this.moduleDB.aggregate([
      {
        $match: { ...perFilter },
      },
      {
        $addFields: {
          statusvandeurName: "$statusVendeur.name",
        },
      },

      {
        $facet: {
          livreurs: [
            {
              $group: {
                _id: null,
                livreurs: {
                  $addToSet: "$livreurName",
                },
              },
            },
          ],
          vendeurs: [
            {
              $group: {
                _id: null,
                vendeurs: {
                  $addToSet: "$vendeurName",
                },
              },
            },
          ],
          status: [
            {
              $group: {
                _id: null,
                statusNames: {
                  $addToSet: "$status",
                },
              },
            },
          ],
          statusvandeurName: [
            {
              $group: {
                _id: null,
                statusvandeurName: {
                  $addToSet: "$statusvandeurName",
                },
              },
            },
          ],
        },
      },
    ]);

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async searchbar(params: any) {
    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    let res;
    let count;
    let page = params.pagination.page || 1;
    let limit = params.pagination.limit || 0;
    let skip = (page - 1) * limit;
    delete params.pagination;
    if (Object.keys(params).length <= 0)
      return new formattedResponse(
        ResponseStatus.succes,
        { colis: [], pagination: { total: 0 } },
        ResponseDirection.outputSystem
      );

    if (user?.company.type == TypesCompanies.admin) {
      count = await this.moduleDB.find({ ...params }).count();
      res = await this.moduleDB
        .find({ ...params })
        .skip(skip)
        .limit(limit);
    } else if (user?.company.type == TypesCompanies.vendeur) {
      delete params.archive
      count = await this.moduleDB
        .find({ ...params, vendeur: user.company._id })
        .count();
      res = await this.moduleDB
        .find({ ...params, vendeur: user.company._id })
        .skip(skip)
        .limit(limit);
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        count = await this.moduleDB
          .find({ ...params, livreur: user.company._id, livreurUser: user._id })
          .count();
        res = await this.moduleDB
          .find({ ...params, livreur: user.company._id, livreurUser: user._id })
          .skip(skip)
          .limit(limit);
      } else {
        count = await this.moduleDB
          .find({ ...params, livreur: user.company._id })
          .count();
        res = await this.moduleDB
          .find({ ...params, livreur: user.company._id })
          .skip(skip)
          .limit(limit);
      }
    }

    return new formattedResponse(
      ResponseStatus.succes,
      { colis: res, pagination: { total: count } },
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async searchByNumber(params: any) {
    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    let res;
    let count;
    let page = params.pagination.page || 1;
    let limit = params.pagination.limit || 0;
    let skip = (page - 1) * limit;
    delete params.pagination;
    if (Object.keys(params).length <= 0)
      return new formattedResponse(
        ResponseStatus.succes,
        { colis: [], pagination: { total: 0 } },
        ResponseDirection.outputSystem
      );
    if (user?.company.type == TypesCompanies.admin) {
      count = await this.moduleDB.find({ ...params }).count();
      res = await this.moduleDB
        .find({ ...params })
        .skip(skip)
        .limit(limit);
    } else if (user?.company.type == TypesCompanies.vendeur) {
      count = await this.moduleDB
        .find({ ...params, vendeur: user.company._id })
        .count();
      res = await this.moduleDB
        .find({ ...params, vendeur: user.company._id })
        .skip(skip)
        .limit(limit);
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        count = await this.moduleDB
          .find({ ...params, livreur: user.company._id, livreurUser: user._id })
          .count();
        res = await this.moduleDB
          .find({ ...params, livreur: user.company._id, livreurUser: user._id })
          .skip(skip)
          .limit(limit);
      } else {
        count = await this.moduleDB
          .find({ ...params, livreur: user.company._id })
          .count();
        res = await this.moduleDB
          .find({ ...params, livreur: user.company._id })
          .skip(skip)
          .limit(limit);
      }
    }

    return new formattedResponse(
      ResponseStatus.succes,
      { colis: res, pagination: { total: count } },
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async delete(params: any) {
    return super.delete(params);
  }

  @endPoint({})
  async  statusChart(params){
    let user = params.middleWareEffect.user;
    delete params.middleWareEffect;
    let res;

    let perFilter: any = null;
    if (user?.company.type == TypesCompanies.admin) {
      perFilter = {};
      //res= await this.moduleDB.find({...params}).populate("vendeur")
    } else if (user?.company.type == TypesCompanies.vendeur) {
      perFilter = {};
      perFilter["vendeur"] = user.company._id;
    
    } else if (user?.company.type == TypesCompanies.livreur) {
      if (user.role != TypesRoles.admin) {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
        perFilter["livreurUser"] = user._id;
      } else {
        perFilter = {};
        perFilter["livreur"] = user.company._id;
      }
    }
    if (perFilter == null)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { errors: "not Auth" },
        ResponseDirection.outputSystem
      );

   this.moduleDB.aggregate([
     {
      $match:{status:{$in:[StatusColis.ANUULE,StatusColis.DELEVRY,StatusColis.REFUSE]},...perFilter }
     },
      {
          $group:{
          _id:{status:"$status"},
          count:{$sum:1}
          } 
      }
      ])
  }
  @endPoint({})
  async insertMany(params) {
    try {
      let colis: any[] = [];
      for (let coli of params.colis) {
        coli.traking = await this.generateTraking(coli);
        coli.statusDate = new Date()
        colis.push(coli);
      }

      let res = await this.moduleDB.insertMany([...colis]);
      return new formattedResponse(
        ResponseStatus.succes,
        res,
        ResponseDirection.outputSystem
      );
    } catch (e) {
      return new formattedResponse(
        ResponseStatus.badRequest,
        { Exception: e },
        ResponseDirection.outputSystem
      );
    }
  }

  @endPoint({})
  async duplicate(params: any) {
    return super.duplicate(params);
  }

  async update(params) {}
  @endPoint({})
  async save(params: any) {
    let user = params.middleWareEffect.user;
    let coli;
    if (params._id) {
      if (user.company.type == TypesCompanies.admin) {
        let res = await this.moduleDB.updateOne(
          { _id: params._id },
          { ...params }
        );
        return new formattedResponse(
          ResponseStatus.succes,
          res,
          ResponseDirection.outputSystem
        );
      } else if (user.company.type == TypesCompanies.vendeur) {
        let res = await this.moduleDB.updateOne(
          { _id: params._id, status: StatusColis.NON_ENVOYE },
          { ...params }
        );
        return new formattedResponse(
          ResponseStatus.succes,
          res,
          ResponseDirection.outputSystem
        );
      }
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { errors: "NOT_PERMETED" },
        ResponseDirection.outputSystem
      );
    } else {
      await this.saveClientInfo(params);
      params.traking = await this.generateTraking(params);
      params.status = StatusColis.NON_ENVOYE;
      params.emplacement = Emplacement.CHER_VENDEUR;
      // params.createdAt = new Date();
      params.statusDate = new Date()
      coli = await this.moduleDB.create({ ...params });
      let coliHistory = {
        status: params.status,
        description: "",
        date: params.date,
        coli: coli._id,
        company: user.company._id,
      };
      if (coli) this.colisHistoryDB.create({ ...coliHistory });
    }

    return new formattedResponse(
      ResponseStatus.succes,
      coli,
      ResponseDirection.outputSystem
    );
  }

  async saveClientInfo(params) {
    let clientOne = await this.clientModel.findOne({ tel: params.tel });
    if (!clientOne) {
      let client = {
        tel: params.tel,
        status: "Bone",
      };
      clientOne = await this.clientModel.create(client);
    }

    let clientHistory = {
      article: params.produit,
      ville: params.ville,
      client: clientOne._id,
      name: params.name,
      status: "paye",
    };
    let res = await this.clientHistoryModel.create(clientHistory);
  }

  async generateTraking(params: any) {
    let type: string = params.type.name;
    let value: string = params.type.value;
    let ville: string = params.ville_arrive;
    let trakings = await this.moduleDB.find({}, { traking: 1 });
    let code;
    do {
      if (type == TypesColisEnum.STANDARD) {
        code = this.generateString("S", 7);
      } else if (type == TypesColisEnum.WHEREHOUSE) {
        code = this.generateString("WH", 6);
      }
      code += ville.charAt(0).toUpperCase() + value.charAt(0).toUpperCase();
    } while (trakings.some((el) => el.traking == code));

    return code;
  }

  generateString(str: string, n): string {
    let possibleN = "0123456789";
    let possibleA = "ABCDEFGHIJKLMNOPQRSTVWXYZ";
    for (let i = 0; i < n; i++) {
      if (i > 2 && i < n - 1)
        str += possibleA.charAt(Math.random() * possibleA.length);
      else str += possibleN.charAt(Math.random() * possibleN.length);
    }

    return str;
  }
  saveHistory(params: any, emplacement) {
    let user = params.middleWareEffect.user;
    let coliHistorys: any[] = [];
    params.colis.forEach((res) => {
      let coliHistory = {
        status: params.status,
        description: params.description,
        date: params.date,
        dateReclame: params.dateReclame,
        coli: res._id,
        emplacement:
          emplacement == "NETWORK"
            ? "NETWORK" + " " + res.ville_depart
            : emplacement == "HUB"
            ? "HUB" + " " + res.hub
            : emplacement,
        company: user.company._id,
       
      };
      coliHistorys.push(coliHistory);
    });
    return coliHistorys;
  }
  @endPoint({
    inputs: [middleware.authenticateUser],
  })
  async changestatus(params: any) {
    let user = params.middleWareEffect.user;
    
    if (!user)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        "no user object",
        ResponseDirection.outputSystem
      );
      params.login =user.login
    if (params.status == StatusColis.ENVOYE) {
      return this.nonEnvoyeToEnvoye(params);
    } else if (params.status == StatusColis.EN_NETWORK) {
      return this.envoyeToAccepter(params);
    } else if (params.status == StatusColis.EXPEDITION) {
      return this.getVilleForExpeditions(params);
    } else if (params.status == StatusColis.RECEPTION_HUB) {
      return this.enDeleveryToHub(params);
    } else if (params.status == StatusColis.EN_HUB) {
      return this.enHub(params);
    } else if (params.status == StatusColis.ENCOUR_DELEVRY) {
      return this.enCourDelevry(params);
    } else if (params.status == StatusColis.RECOMANDER) {
      return this.recomonder(params);
    } else if (params.status == StatusColis.REFUSE) {
      return this.refuse(params);
    } else if (params.status == StatusColis.ANUULE) {
      return this.anulle(params);
    } else if (params.status == StatusColis.DELEVRY) {
      return this.delevery(params);
    } else if (params.status == StatusColis.RAPALLE) {
      return this.rappel(params);
    } else if (params.status == StatusColis.RETOURE_TO_NETWORK) {
      return this.reteurToNetwork(params);
    } else if (params.status == StatusColis.RETOURE_EN_NETWORK) {
      return this.reteurEnNetwork(params);
    } else if (params.status == StatusColis.RETOURE_TO_VENDEUR) {
      return this.ReteurToVendeur(params);
    } else if (params.status == "STATUS_VENDEUR") {
      return this.statusVendeur(params);
    } else if (params.status == StatusColis.RETOURNER) {
      return this.Retourner(params);
    } else if (params.status == "CONFIRME") {
      return this.nonEnvoyeToConfirme(params);
    } else if (params.status == "ARCHIVE") {
      return this.archive(params);
    } else if (params.status == "IMPRIMER") {
      return this.imprimer(params);
    }else if (params.status == "ADD_CHAT") {
      return this.addToChat(params);
    } else if (params.status == "SEE_CHAT") {
      return this.seenChat(params);
    } else if (params.status == "USER_CONFIRME") {
      return this.changeUserConfirme(params);
    }else {
      //return this.resetStatus(params);
    }

    return new formattedResponse(
      ResponseStatus.badRequest,
      { error: "bad status" },
      ResponseDirection.outputSystem
    );
  }
  async archive(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      {
        $set: {
          archive: params.archive,
        },
      },
      { multi: true }
    );

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  async imprimer(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      {
        $set: {
          imprimer: params.imprimer,
        },
      },
      { multi: true }
    );

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  async resetStatus(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      {
        $set: {
          status: StatusColis.NON_ENVOYE,
          statusFinal: false,
          statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
        },
      },
      { multi: true }
    );

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  async statusVendeur(params: any) {
    let res = await this.moduleDB.update(
      { _id: params._id },
      {
        $set: {
          statusVendeur: params.stautsVendeur,
          userIsConfirme: params.middleWareEffect.user._id,
        },
      },
      { multi: true }
    );

    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }
  async nonEnvoyeToEnvoye(params: any) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let bon: any = await this.bonctrl.saveByStatus({
      colis: params.colis,
      network: params.colis[0].ville_depart,
      type: "BL",
      companyID: params.middleWareEffect.user.company._id,
    });
    if (bon && bon._doc) {
      let res = await this.moduleDB.update(
        { _id: { $in: [...colisIds] } },
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            BL: bon._doc.code,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: "null",
            statusPayeDate: null,
          },
        },
        { multi: true }
      );
      if (res)
        await this.colisHistoryDB.insertMany(
          this.saveHistory(params, Emplacement.CHER_VENDEUR)
        );
    }
    return new formattedResponse(
      ResponseStatus.succes,
      bon,
      ResponseDirection.outputSystem
    );
  }

  async nonEnvoyeToConfirme(params: any) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });
    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      { $set: { confirme: params.confirme } },
      { multi: true }
    );
    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }

  async changeUserConfirme(params: any) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });
    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      {
        $set: {
          userConfirme: params.userID,
          userConfirmeName: params.userName,
        },
      },
      { multi: true }
    );
    return new formattedResponse(
      ResponseStatus.succes,
      res,
      ResponseDirection.outputSystem
    );
  }

  async envoyeToAccepter(params: any) {
    // let colisNormal = params.colis.filter(coli=>{
    //     if(coli.type.name == TypesColisEnum.STANDARD && coli.type.value != SubTypesColisEnum.REMBERCEMENT)return coli

    // });
    // let colisRembersement = params.colis.filter(coli=>{
    //     if(coli.type.name == TypesColisEnum.STANDARD && coli.type.value == SubTypesColisEnum.REMBERCEMENT)return coli

    // })
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });
    // let colisRembersementIds :any[] = colisRembersement.map(res=>{
    //     return res._id
    // });
    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            emplacement: { $concat: ["NETWORK", " ", "$ville_depart"] },
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            statusPayeDate: null,
          },
        },
      ],
      { multi: true }
    );

    if (res) {
      //params.colis =colisNormal
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "NETWORK"));
    }
    //     let res1 = await this.moduleDB.update(
    //         {_id:{$in:[...colisRembersementIds] }},
    //         [{$set:{
    //                 status:StatusColis.,
    //                 emplacement : {$concat :["HUB" ," ","$ville_depart"]}

    //             }
    //         }],
    //         {multi:true}
    //     );
    //     if(res1){
    //         params.colis =colisRembersement
    //         params.status = StatusColis.ENCOUR_DELEVRY
    //         await this.colisHistoryDB.insertMany(this.saveHistory(params,"HUB"))
    //    }

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  @endPoint({})
  async getVilleForExpeditions(params) {
    let byVille: { id: String; colis: any[] }[] = [];

    let colis = await this.moduleDB.find({ status: StatusColis.EN_NETWORK });
    colis.filter((coli) => {
      if (byVille.some((el) => el.id == coli.hubID)) {
        let i = byVille.findIndex((el) => el.id == coli.hubID);
        byVille[i].colis.push(coli);
      } else {
        let obj: { id: String; colis: any[] } = { id: coli.hubID, colis: [] };
        obj.colis.push(coli);
        byVille.push(obj);
      }
    });

    //start await Object.keys(byVille).forEach(async (key) => {
    for (let oneVille of byVille) {
      try {
        let colisIds = oneVille.colis.map((coli) =>  coli._id);

        let code = await this.bonctrl.genereateCode("BE");

        let bon: {
          code: any;
          type: String;
          company: String;
          colis: any[];
          status: String;
          hubID: String;
          hub: String;
          network;
        } = {
          code: code,
          type: "BE",
          company: params.middleWareEffect.user.company._id,
          colis: [],
          network: oneVille.colis[0].ville_depart,
          hub: oneVille.colis[0].hub,
          hubID: oneVille.colis[0].hubID,
          status: "NON_ENVOYE",
        };
        bon.colis.push(...colisIds);

        let bons = await this.bonModel.create({ ...bon });

        await this.moduleDB.update(
          { _id: { $in: [...colisIds] } },
          {
            $set: {
              status: params.status,
              changeBy:params.login,
              BE: bons?.code,
              statusFinal: false,
              statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
              statusPayeDate: null,
            },
          },
          { multi: true }
        );
        await this.colisHistoryDB.insertMany(
          this.saveHistory({ ...params, colis: oneVille.colis }, "NETWORK")
        );
      } catch (e) {
        console.error("expedition: ", e);
      }
    }
    //fin});

    return new formattedResponse(
      ResponseStatus.succes,
      { ville: byVille },
      ResponseDirection.outputSystem
    );
  }
  async enNetworkToExpedition(params: any) {
    let byVille: any[] = [];

    params.colis.filter((coli) => {
      if (byVille[coli.hub]) {
        byVille[coli.hub].push(coli);
      } else {
        byVille[coli.hub] = [];
        byVille[coli.hub].push(coli);
      }
    });

    Object.keys(byVille).forEach(async (key) => {
      let coliIds = byVille[key].map((coli) => {
        return coli._id;
      });

      let code = await this.bonctrl.genereateCode("BE");

      let bon: {
        code: any;
        type: String;
        company: String;
        colis: any[];
        status: String;
        hubID: String;
        hub: String;
        network;
      } = {
        code: code,
        type: "BE",
        company: params.middleWareEffect.user.company._id,
        colis: [],
        network: byVille[key][0].ville_depart,
        hub: byVille[key][0].hub,
        hubID: byVille[key][0].hubID,
        status: "NON_ENVOYE",
      };
      let colisIds = byVille[key]?.map((coli) => coli._id);
      bon.colis.push(...colisIds);

      let bons = await this.bonModel.create({ ...bon });

      await this.moduleDB.update(
        { _id: { $in: [...coliIds] } },
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            BE: bons?.code,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            statusPayeDate: null,
          },
        },
        { multi: true }
      );
      await this.colisHistoryDB.insertMany(
        this.saveHistory({ ...params, colis: byVille[key] }, "NETWORK")
      );
    });

    return new formattedResponse(
      ResponseStatus.succes,
      { valid: "success" },
      ResponseDirection.outputSystem
    );
  }

  @endPoint({})
  async enDeleveryToHub(params: any) {
    let colisIds: any[] = params.colis;
    params.colis = await this.moduleDB.find(
      { _id: { $in: colisIds } },
      { ville_depart: 1, hub: 1, ville_arrive: 1, type: 1 }
    );
    let villes = await this.villeModel.find();

    await this.bonctrl.moduleDB.updateMany(
      { _id: params.bonID },
      { $set: { status: "ENVOYE",company:params.livreur } }
    );
    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      {
        $set: {
          status: params.status,
          changeBy:params.login,
          livreur: params.livreur,
          livreurName: params.livreurName,
          statusFinal: false,
          statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
          statusPayeDate: null,
        },
      },
      { multi: true }
    );
    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "NETWORK"));
    let ville;
    params.colis.forEach(async (coli) => {
      ville = this.isExsisteVille(villes, params.livreur, coli);
      await this.moduleDB.update(
        { _id: coli._id },
        {
          $set: {
            "prix_livreur.prix_livrison": parseInt(ville.prix_livrision) || 0,
            "prix_livreur.prix_anulle": parseInt(ville.prix_annule) || 0,
            "prix_livreur.prix_refuse": parseInt(ville.prix_refuse) || 0,
          },
        },
        { multi: true }
      );
    });

    return new formattedResponse(
      ResponseStatus.succes,
      { message: "success update status colis", ville },
      ResponseDirection.outputSystem
    );
  }

  isExsisteVille(villes: any[], livreur, coli) {
    return villes.find((ville) => {
      if (
        ville.ville_depart == coli.ville_depart &&
        ville.ville_arrive == coli.ville_arrive &&
        ville.type == coli.type.name &&
        ville.type_value == coli.type.value &&
        ville.livreur == livreur
      ) {
        return ville;
      }
    });
  }
  async enHub(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            emplacement: { $concat: ["HUB", " ", "$hub"] },
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            statusPayeDate: null,
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async enCourDelevry(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            livreurUser: params.user,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: "null",
            statusPayeDate: null,
            livreurUserName: params.userName || {
              $concat: ["$livreurUserName"],
            },
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async recomonder(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            dateRecomande: new Date(params.dateReclame),
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: "null",
            statusPayeDate: null,
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async refuse(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: StatusColis.REFUSE,
            statusPayeDate: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"}))
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async anulle(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: StatusColis.ANUULE,
            statusPayeDate: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"}))
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async rappel(params) {
    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: "null",
            statusPayeDate: null,
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async delevery(params) {
    let colisNormal = params.colis.filter((coli) => {
      if (coli.type.value != SubTypesColisEnum.REMBERCEMENT) return coli;
    });
    let colisEchange = params.colis.filter((coli) => {
      if (coli.type.value == SubTypesColisEnum.ECHANGE) return coli;
    });
    let colisRembersement = params.colis.filter((coli) => {
      if (
        coli.type.name == TypesColisEnum.STANDARD &&
        coli.type.value == SubTypesColisEnum.REMBERCEMENT
      )
        return coli;
    });
    let colisIds: any[] = colisNormal.map((res) => {
      return res._id;
    });
    let colisRembersementIds: any[] = colisRembersement.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            statusFinal: true,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            satatusPaye: StatusColis.DELEVRY,
            statusPayeDate: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            livreurUserName: params.middleWareEffect?.user?.name,
          },
        },
      ],
      { multi: true }
    );

    if (res) {
      params.colis = colisNormal;
      await this.colisHistoryDB.insertMany(
        this.saveHistory(params, Emplacement.CHER_CLIENT)
      );
    }

    let res1 = await this.moduleDB.update(
      { _id: { $in: [...colisRembersementIds] } },
      [
        {
          $set: {
            status: StatusColis.RECUPIRER,
            statusFinal: false,
            satatusPaye: StatusColis.DELEVRY,
            statusPayeDate: new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"}))
          },
        },
      ],
      { multi: true }
    );

    if (res1) {
      params.colis = colisRembersement;
      params.status = StatusColis.RECUPIRER;
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));
    }

    // if esiste colis echange
    colisEchange.forEach(async (coli) => {
      let code = "EC-" + coli.traking;
      try {
        delete coli._id;
        delete coli.createdAt;
        delete coli.__v;
        let res = await this.moduleDB.create({
          ...coli,
          traking: code,
          status: StatusColis.RETOURE_TO_NETWORK,
          emplacement: "HUB " + coli.hub,
        });
        if (res)
          await this.colisHistoryDB.insertMany(
            this.saveHistory({ ...params, colis: [coli] }, "HUB")
          );
      } catch (error) {
        console.error(error);
      }
    });

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async reteurToNetwork(params) {
    let byNetwork: any[] = [];

    params.colis.filter((coli) => {
      if (byNetwork[coli.ville_depart]) {
        byNetwork[coli.ville_depart].push(coli);
      } else {
        byNetwork[coli.ville_depart] = [];
        byNetwork[coli.ville_depart].push(coli);
      }
    });
    let res;
    Object.keys(byNetwork).forEach(async (key) => {
      let coliIds = byNetwork[key].map((coli) => {
        return coli._id;
      });

      let code = await this.bonctrl.genereateCode("BR");

      let bon: {
        code: any;
        type: String;
        company: String;
        colis: any[];
        status: String;
        network: String;
        hub: String;
        hubID: String;
      } = {
        code: code,
        type: "BR",
        company: params.middleWareEffect.user.company._id,
        colis: [],
        network: byNetwork[key][0].ville_depart,
        hub: byNetwork[key][0].hub,
        hubID: byNetwork[key][0].hubID,
        status: "ENVOYE",
      };
      let colisIds = byNetwork[key].map((coli) => coli._id);
      bon.colis.push(...colisIds);

      let bons = await this.bonModel.create({ ...bon });

      await this.moduleDB.update(
        { _id: { $in: [...coliIds] } },
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            BE: bons?.code,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            statusPayeDate: null,
          },
        },
        { multi: true }
      );
      await this.colisHistoryDB.insertMany(
        this.saveHistory({ ...params, colis: byNetwork[key] }, "HUB")
      );
    });

    return new formattedResponse(
      ResponseStatus.succes,
      { valid: "success" },
      ResponseDirection.outputSystem
    );
  }
  async reteurEnNetwork(params) {
    let user = params.middleWareEffect.user;
    if (user.company.type != TypesCompanies.admin)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { error: "Auth not permission" },
        ResponseDirection.outputSystem
      );

    let colisIds: any[] = params.colis.map((res) => {
      return res._id;
    });

    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      [
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            statusFinal: false,
            statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
            statusPayeDate: null,
          },
        },
      ],
      { multi: true }
    );

    if (res)
      await this.colisHistoryDB.insertMany(this.saveHistory(params, "HUB"));

    return new formattedResponse(
      ResponseStatus.succes,
      { n: "" },
      ResponseDirection.outputSystem
    );
  }
  async ReteurToVendeur(params) {
    let user = params.middleWareEffect.user;
    if (user.company.type != TypesCompanies.admin)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { error: "Auth not permission" },
        ResponseDirection.outputSystem
      );

    let byVendeur: any[] = [];

    params.colis.filter((coli) => {
      if (byVendeur.some((el) => el.id == coli.vendeur)) {
        let i = byVendeur.findIndex((el) => el.id == coli.vendeur);
        byVendeur[i].colis.push(coli);
      } else {
        let obj: { id: String; colis: any[] } = { id: coli.vendeur, colis: [] };
        obj.colis.push(coli);
        byVendeur.push(obj);
      }
    });


 
    for (let vendeur of byVendeur) {
      let coliIds = vendeur.colis.map((coli) =>  coli._id);

      let code = await this.bonctrl.genereateCode("BRE");

      let bon: {
        code: any;
        type: String;
        company: String;
        colis: any[];
        status: String;
      } = {
        code: code,
        type: "BRE",
        company:vendeur.id ,
        colis: [],
        status: "NON_ENVOYE",
      };

      bon.colis.push(...coliIds);

      let bons = await this.bonModel.create({ ...bon });

      await this.moduleDB.update(
        { _id: { $in: [...coliIds] } },
        {
          $set: {
            status: params.status,
            changeBy:params.login,
            BE: bons?.code,
          },
        },
        { multi: true }
      );
      await this.colisHistoryDB.insertMany(
        this.saveHistory({ ...params, colis: vendeur.colis }, "NETWORK")
      );
    }

    return new formattedResponse(
      ResponseStatus.succes,
      { valid: byVendeur },
      ResponseDirection.outputSystem
    );
  }
  async Retourner(params) {
    let user = params.middleWareEffect.user;
    if (user.company.type != TypesCompanies.admin)
      return new formattedResponse(
        ResponseStatus.unAuthorized,
        { error: "Auth not permission" },
        ResponseDirection.outputSystem
      );
    let colisIds: any[] = params.colis;
    params.colis = await this.moduleDB.find({ _id: { $in: colisIds } });
    await this.bonctrl.moduleDB.updateMany(
      { _id: params.bonID },
      { $set: { status: "ENVOYE" } }
    );
    let res = await this.moduleDB.update(
      { _id: { $in: [...colisIds] } },
      {
        $set: {
          status: params.status,
 changeBy:params.login,
          statusFinal: true,
          statusDate:new Date(new Date().toLocaleString("en-US", {timeZone: "Africa/Casablanca"})),
          statusPayeDate: null,
        },
      },
      { multi: true }
    );
    if (res)
      await this.colisHistoryDB.insertMany(
        this.saveHistory(params, Emplacement.CHER_VENDEUR)
      );
    return new formattedResponse(
      ResponseStatus.succes,
      { message: "success update status colis" },
      ResponseDirection.outputSystem
    );
  }

  async addToChat(params) {
    let res = await this.moduleDB.update(
      { _id: { $in: [params.colis._id] } },
      { $push: { chat: params.chat } }
    );
    return new formattedResponse(
      ResponseStatus.succes,
      params.chat,
      ResponseDirection.outputSystem
    );
  }
  async seenChat(params) {
    let res = await this.moduleDB.update(
      { _id: { $in: [params.colis._id] } },
      { $set: { vueChat: params.vueChat } }
    );

    return new formattedResponse(
      ResponseStatus.succes,
      params.chat,
      ResponseDirection.outputSystem
    );
  }
}
