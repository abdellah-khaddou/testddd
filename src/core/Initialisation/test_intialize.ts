import { Store}  from "./Bootstrap";
// import  GlobalVariable = require('./Bootstrap')
require('dotenv').config({path:'.testenv'})
new Store().initializeModules();
