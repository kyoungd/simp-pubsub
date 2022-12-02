import axios from 'axios';;
import * as dotenv from 'dotenv';

dotenv.config()

class GetJwt {
    jwt = null;

    constructor(username = null, password = null) {
        GetJwt.jwt = null;
        this.usename = username ? username : process.env.URL_JWT_USERNAME;
        this.password = password ? password : process.env.URL_JWT_PASSWORD;
        this.url = process.env.URL_JWT_LOGIN || 'http://localhost:1337/api/auth/local';
    }

    async getJwt(url, usename, password) {
        try {
            const response = await axios.post(url, {identifier: usename, password: password});
            console.log('User profile', response.data.user);
            console.log('User token', response.data.jwt);
            GetJwt.jwt = response.data.jwt;
        }
        catch(error){
            console.log('An error occurred:', error.response);
            GetJwt.jwt = null;
        };
        return GetJwt.jwt;    
    }  

    static async run(username = null, password = null) {
        if (GetJwt.jwt) return GetJwt.jwt;
        const jwt = new GetJwt();
        return await jwt.getJwt(jwt.url, jwt.usename, jwt.password);
    }

}

export default GetJwt;
