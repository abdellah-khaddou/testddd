import { isMaster } from 'cluster';
import mongoose from 'mongoose';
module.exports =function (){
  console.info("connect to data base ")
  console.info(process.env.databaseURI)
    mongoose.
       connect(process.env.databaseURI||'mongodb://localhost:27017/grocery', {
           useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true 
         

       }).then(()=>{}).catch(err=>console.error(err))

   const db = mongoose.connection;
   db.on("error", (err) => {
       console.error(">  "+ (isMaster ?'Master':"worker "+process.pid)+"error occurred from the database",err);
   });
   db.once("open", (success) => {
    console.log(">  "+ (isMaster ?'Master':"worker "+process.pid)+" successfully opened the database");
   });

   process.on('beforeExit',async ()=>{
       try {

            await  db.close()
       } catch (error) {
           console.log(error)
       }
   })
}

