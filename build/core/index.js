"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApi = exports.storeInstance = void 0;
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    require('./db-manager/db');
}
const cluster_1 = __importDefault(require("cluster"));
let workers = [];
const error_handler_1 = require("./error-handler");
const Bootstrap_1 = require("./Initialisation/Bootstrap");
const loggerHandler_1 = require("./logger/loggerHandler");
const setup_1 = require("./router-managers/setup");
const providers_1 = require("./store/providers");
const setupWorkerProcesses = () => {
    // to read number of cores on system 
    let numCores = require('os').cpus().length;
    console.log('Master cluster setting up ' + numCores + ' workers');
    for (let i = 0; i < numCores; i++) {
        workers.push(cluster_1.default.fork());
        workers[i].on('message', function (message) {
            console.log(message);
        });
    }
    // process is clustered on a core and process id is assigned
    cluster_1.default.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is listening');
        console.warn(workers.map(element => element.id));
        console.warn('workers number : ', workers.length);
    });
    // if any of the worker process dies then start a new one by simply forking another one
    cluster_1.default.on('exit', function (deadWorker, code, signal) {
        var worker = cluster_1.default.fork();
        workers.push(worker);
        // Note the process IDs
        workers.splice(workers.indexOf(deadWorker), workers.indexOf(deadWorker) + 1);
        var newPID = worker.process.pid;
        var oldPID = deadWorker.process.pid;
        // Log the event
        console.log('worker ' + oldPID + ' died.');
        console.log('worker ' + newPID + ' born.');
    });
};
let requiredEnvVriables = ["SecretKey", "NODE_ENV", "errorLogs", "infoLogs"];
let availblesEnv = requiredEnvVriables.filter(element => process.env[element]);
if (availblesEnv < requiredEnvVriables) {
    process.exit(1);
}
exports.storeInstance = new Bootstrap_1.Store();
function startApi(config) {
    if (config.clusterNodes && (config.clusterNodes > 1 || config.clusterNodes === 'corsNumber') && cluster_1.default.isMaster) {
        if (process.env.NODE_ENV !== 'test') {
            exports.storeInstance.emit('bootstrapRequirement', { name: 'LoggerHandler', value: loggerHandler_1.LoggerHandler });
            global.console = (0, providers_1.getFunction)('LoggerHandler');
        }
        exports.storeInstance.emit('saveConfig', config);
        setupWorkerProcesses();
    }
    else {
        // to setup server configurations and share port address for incoming requests
        // setUpExpress();
        if (process.env.NODE_ENV !== 'test') {
            exports.storeInstance.emit('bootstrapRequirement', { name: 'LoggerHandler', value: loggerHandler_1.LoggerHandler });
            global.console = (0, providers_1.getFunction)('LoggerHandler');
        }
        exports.storeInstance.emit('saveConfig', config);
        exports.storeInstance.initializeModules();
        (0, error_handler_1.handleErrors)();
        (0, setup_1.setUpExpress)(config, exports.storeInstance);
    }
}
exports.startApi = startApi;
//# sourceMappingURL=index.js.map