"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = require("cluster");
const mongoose_1 = __importDefault(require("mongoose"));
module.exports = function () {
    console.info("connect to data base ");
    console.info(process.env.databaseURI);
    mongoose_1.default.
        connect(process.env.databaseURI || 'mongodb://localhost:27017/grocery', {
        useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true
    }).then(() => { }).catch(err => console.error(err));
    const db = mongoose_1.default.connection;
    db.on("error", (err) => {
        console.error(">  " + (cluster_1.isMaster ? 'Master' : "worker " + process.pid) + "error occurred from the database", err);
    });
    db.once("open", (success) => {
        console.log(">  " + (cluster_1.isMaster ? 'Master' : "worker " + process.pid) + " successfully opened the database");
    });
    process.on('beforeExit', async () => {
        try {
            await db.close();
        }
        catch (error) {
            console.log(error);
        }
    });
};
//# sourceMappingURL=db.js.map