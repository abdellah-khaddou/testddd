import jwt from 'jsonwebtoken';
class TokenManager {
    algorithm = "HS512";
    secretKey: string = process.env.SecretKey || '';
    public generateToken = async (ObjectToCode:any,expiration?:string) => {
        const issued = Date.now();
        const fifteenMinutesInMs = 15 * 60 * 1000;
        const expires = issued + fifteenMinutesInMs;
        const session = {
            issued: issued,
            expires: expires,
           ...ObjectToCode
        };
        return {
            token: jwt.sign(session, this.secretKey,{expiresIn:expiration||'30d'}),
            issued: issued,
            expires: expires
        };

    }
    public verifyToken = async (token: string,Expiration?:boolean) => {
        return jwt.verify(token, this.secretKey,{ignoreExpiration:!Expiration})
    }
    public decoreToken = async (token: string) => {
        return jwt.decode(token)
    }
}
let tokenMangager = new TokenManager();
export default tokenMangager;