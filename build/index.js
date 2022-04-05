"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
(0, core_1.startApi)({
    staticPath: 'static',
    port: parseInt(process.env.PORT || '3001'),
    security: {
        key: "",
        cert: "",
        ca: ""
    },
    logger: ["db", ""],
    scanStorage: ""
});
//# sourceMappingURL=index.js.map