var request = require('request');

class httpRequest{
    get(options:any):Promise<any>{ 
    //    return request({
    //        method:method,
    //        url:url,
    //        data:{
    //            ...body
    //        },
    //     //    headers: {'Content-Type': 'multipart/form-data' }
    //     }) 
       return  request(options, function (error:any, response:any) { 
            if (error) throw new Error('eroor'+error);
            // console.log('response',response);
          })
    }
}

export const http = new httpRequest()