export function handleErrors(){
    process.on('uncaughtException', (reason: any) => {
        console.trace('uncaughtException',reason)
    });
    process.on('unhandledRejection', (promise, reason) => {
        console.trace('unhandledRejection',Promise, reason)
    });
    process.on('exit', (promise) => {
         console.trace("exit",Promise)
    });
    process.on('beforeExit', (promise) => {
          console.trace("beforeExit",Promise)
    });
    process.on('uncaughtExceptionMonitor', (reason: any) => { console.trace( reason) });
    process.on('message', (msg, error) => console.log("message",msg, error));
    process.on('rejectionHandled', (reason: any) => console.error("rejectionHandled",reason));
    
}