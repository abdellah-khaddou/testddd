import { Console } from 'console';
import { createWriteStream } from 'fs';
import mongoose from 'mongoose';
import { kmSchema } from '../db-manager/schema';
export let logsSchema = new kmSchema({
     dateCreation: { type: Date, default: Date.now() },
     timeStamp:Number,
     message:kmSchema.Types.Mixed,
     type:String
});
 
 export const Logger = mongoose.model('logs', logsSchema, 'Logs');
 
 class LoggerHandlerRepository extends Console{
    constructor(stdout: string, stderr:string, ignoreErrors?: boolean | undefined){
     let logStream=createWriteStream(stdout);
 let errorStream=createWriteStream(stderr); 
     super(logStream,errorStream,ignoreErrors)
    }
    log( ...optionalParams: any[]){
        Logger.create({timeStamp:new Date().getTime(),message:optionalParams,type:"log"}).then().catch();     
        process.stdout.write( '[log] '+(new Date().toISOString()).toString() +' : \n\t '+((typeof optionalParams ==='object'||typeof optionalParams ==='function')?optionalParams.map(element=>JSON.stringify(element)).join('  '):optionalParams)+"\n")
        return super.log(JSON.stringify({timeStamp:new Date().getTime(),message:optionalParams,type:"log"}),...optionalParams)
    }
    error( ...optionalParams: any[]){
         Logger.create({timeStamp:new Date().getTime(),message:optionalParams,type:"error"}).then().catch();
         process.stderr.write('\x1b[31m'+'[error] '+new Date().toISOString() +' : \n\t'+ optionalParams.map(element=>JSON.stringify(element)).join('  ')+'\x1b[0m\n')
         return super.error({timeStamp:new Date().getTime(),message:optionalParams,type:"error"})
    }
    info(...optionalParams: any[]){
         Logger.create({timeStamp:new Date().getTime(),message:optionalParams,type:"info"}).then().catch();
         process.stdout.write('\x1b[32m'+'[info] '+new Date().toISOString() +' : \n\t '+optionalParams.map(element=>JSON.stringify(element)).join('  ')+'\x1b[0m\n')
         return super.info({timeStamp:new Date().getTime(),message:optionalParams,type:"info"})
    }
    warn(  ...optionalParams: any[]){
        Logger.create({timeStamp:new Date().getTime(),message:optionalParams,type:"warn"}).then().catch();
        process.stdout.write('\x1b[33m' +'[warn] '+new Date().toISOString() +' : \n \t'+optionalParams.map(element=>JSON.stringify(element)).join('  ')+'\x1b[0m\n')
        return super.warn({timeStamp:new Date().getTime(),message:optionalParams,type:"warn"})
     }
    trace(message?:any){
         Logger.create({message,type:"trace"}).then().catch();
         process.stderr.write('\x1b[31m'+'[trace] '+new Date().toISOString() +' : \n \t'+((typeof message ==='object'||typeof message ==='function')?JSON.stringify(message):message)+'\x1b[0m\n')
         return super.trace({message,type:"trace"})
    }
    
};
export let LoggerHandler;
 if (process.env.NODE_ENV !== 'test') {
     LoggerHandler= new LoggerHandlerRepository(process.env.infoLogs||"",process.env.errorLogs||'',false);
   }
// logStream.end(()=>{});
// errorStream.end(()=>{});
// process.on('beforeExit', function(){
//      logStream.end();
//      errorStream.end()
//      // LoggerHandler =new LoggerHandlerRepository(process.stdout,process.stderr,false);
//       process.exit(1);
      
//  });
  