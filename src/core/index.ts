if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    require('./db-manager/db')
}
import cluster from 'cluster';


let workers: any[] = [];

import { handleErrors } from './error-handler';
import { Store } from './Initialisation/Bootstrap';
import { apiConfig } from './interfaces/setup';
import { LoggerHandler } from './logger/loggerHandler';
import { setUpExpress } from './router-managers/setup';
import { getFunction } from './store/providers';
const setupWorkerProcesses = () => {
    // to read number of cores on system 
    let numCores = require('os').cpus().length;
    console.log('Master cluster setting up ' + numCores + ' workers');
    for (let i = 0; i < numCores; i++) {
        workers.push(cluster.fork());
        workers[i].on('message', function (message) {
            console.log(message);
        });
    }

    // process is clustered on a core and process id is assigned
    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is listening');
        console.warn(workers.map(element=>element.id))
        console.warn('workers number : ',workers.length)

    });

    // if any of the worker process dies then start a new one by simply forking another one
    cluster.on('exit', function (deadWorker, code, signal) {
        var worker = cluster.fork();
        workers.push(worker);
    // Note the process IDs
    workers.splice(workers.indexOf(deadWorker),workers.indexOf(deadWorker)+1)
    var newPID = worker.process.pid;
    var oldPID = deadWorker.process.pid;

    // Log the event
    console.log('worker '+oldPID+' died.');
    console.log('worker '+newPID+' born.');
    });
};
let requiredEnvVriables = ["SecretKey", "NODE_ENV", "errorLogs", "infoLogs"]
let availblesEnv = requiredEnvVriables.filter(element => process.env[element])
if (availblesEnv < requiredEnvVriables) {
    process.exit(1)
}


export let storeInstance = new Store();
export function startApi(config: apiConfig) {
    if (config.clusterNodes &&( config.clusterNodes > 1|| config.clusterNodes==='corsNumber') && cluster.isMaster) {
        if (process.env.NODE_ENV !== 'test') {
            storeInstance.emit('bootstrapRequirement', { name: 'LoggerHandler', value: LoggerHandler });
            global.console = getFunction('LoggerHandler');
        }
        storeInstance.emit('saveConfig', config)
        setupWorkerProcesses();
    } else {
         // to setup server configurations and share port address for incoming requests
        // setUpExpress();
        if (process.env.NODE_ENV !== 'test') {
            storeInstance.emit('bootstrapRequirement', { name: 'LoggerHandler', value: LoggerHandler });
            global.console = getFunction('LoggerHandler');
        }
        storeInstance.emit('saveConfig', config)
        storeInstance.initializeModules();
        handleErrors();
        setUpExpress(config, storeInstance);
    }
}
