"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUpExpress = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
require("../db-manager/db")();
const _1 = __importDefault(require("."));
var cors = require('cors');
const app = (0, express_1.default)();
var server = require('http').createServer(app);
let io = global["io"] = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["*"],
        credentials: true
    }
});
const setUpExpress = (config, storeInstance) => {
    app.use((0, helmet_1.default)());
    if (config.static) {
        app.use(express_1.default.static(config.static, { dotfiles: 'allow' }));
    }
    app.set('port', (config.port));
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
    app.use(cors());
    (0, _1.default)(app, storeInstance);
    io.on('connection', function (socket) {
        console.log('A user connected');
        io.emit('broadcast', { he: "hello" });
        //Whenever someone disconnects this piece of code executed
        socket.on('disconnect', function () {
            console.log('A user disconnected');
        });
    });
    server.listen((process.env.PORT || '3001'), () => {
        console.info('worker ' + process.pid + ' listening on port ' + app.get('port') + ', DB : ' + ' on ');
    });
    server.on('error', (appErr) => {
        console.error('app error', appErr.stack);
    });
};
exports.setUpExpress = setUpExpress;
//# sourceMappingURL=setup.js.map