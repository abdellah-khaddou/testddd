import bcrypt from 'bcrypt';
export class UserService{
    constructor(){}
     hashPassword(password: any){
        return bcrypt.hashSync(password,16)
    }
    
     verifyPassword(passwordUser:any,passwordDb:any){

        return  bcrypt.compareSync(passwordUser,passwordDb)
    }
}