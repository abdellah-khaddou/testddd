import express from 'express';
import helmet from 'helmet';
require("../db-manager/db")();

import setRoutes from '.';

 var cors = require('cors');
 const app: express.Application = express();
 var server = require('http').createServer(app);  
 let io = global["io"] = require('socket.io')(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    }
  });
 
 
 export const setUpExpress = (config,storeInstance)=>{
  
    app.use(helmet());
    if (config.static) {
        app.use(express.static(config.static, { dotfiles: 'allow' }))
    }
 
    app.set('port', (config.port));
    app.use(express.json({limit:'50mb'}));
    app.use(express.urlencoded({ extended: true ,limit:"50mb"}));
    app.use(cors());

  

    setRoutes(app, storeInstance);
    io.on('connection', function(socket) {
      console.log('A user connected');
      io.emit('broadcast', {he:"hello"});
      //Whenever someone disconnects this piece of code executed
      socket.on('disconnect', function () {
         console.log('A user disconnected');
      });
   });
   
    server.listen((process.env.PORT|| '3001'), () => {
        console.info('worker '+process.pid+' listening on port ' + app.get('port') + ', DB : ' + ' on ');
    });
    server.on('error', (appErr) => {
        console.error('app error', appErr.stack);
    });
}
