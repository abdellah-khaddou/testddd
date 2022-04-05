import { startApi } from './core';


startApi({
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
