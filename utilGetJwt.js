import axios from 'axios';;

class GetJwt {
    jwt = null;

    constructor() {
        GetJwt.jwt = null;
        this.login = process.env.URL_JWT_USERNAME || 'syop01';
        this.password = process.env.URL_JWT_PASSWORD || 'password';
        this.url = process.env.URL_JWT_LOGIN || 'http://localhost:1337/api/auth/local';
    }

    async getJwt(url, login, password) {
        try {
            const response = await axios.post(url, {identifier: login, password: password});
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

    static async run() {
        if (GetJwt.jwt) return GetJwt.jwt;
        const jwt = new GetJwt();
        return await jwt.getJwt(jwt.url, jwt.login, jwt.password);
    }
}

export default GetJwt;
