"use strict";
//  setTimeout(()=>{
//     watchFile(process.env.infoLogs||'', (curr, prev) => {
//         readFile(process.env.infoLogs||'',{encoding:'utf-8'},(errorInFile,dataInFile)=>{
//             let ParsedData = JSON.parse("["+dataInFile.replace(new RegExp('}\n{','g'),'},{')+"]")
//             ParsedData
//          })
//     })
//     watchFile(process.env.errorLogs||'', (curr, prev) => {
//                 readFile(process.env.errorLogs||'',{encoding:'utf-8'},(errorInFile,dataInFile)=>{
//                     let ParsedData = JSON.parse("["+dataInFile.replace(new RegExp('}\n{','g'),'},{')+"]")
//                     ParsedData
//                 })
//     }) 
// },30*1000)
//# sourceMappingURL=fileLogger.js.map