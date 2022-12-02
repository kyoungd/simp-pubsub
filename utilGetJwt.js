import axios from 'axios';;

class GetJwt {
    constructor() {
        this.jwt = null;
        this.login = process.env.URL_JWT_USERNAME || 'syop01';
        this.password = process.env.URL_JWT_PASSWORD || 'password';
        this.url = process.env.URL_JWT_LOGIN || 'http://localhost:1337/api/auth/local';
    }

    async getJwt(url, login, password) {
        try {
            const response = await axios.post(url, {identifier: login, password: password});
            console.log('User profile', response.data.user);
            console.log('User token', response.data.jwt);
            this.jwt = response.data.jwt;
        }
        catch(error){
            console.log('An error occurred:', error.response);
            this.jwt = null;
        };
        return this.jwt;    
    }  

    static async run() {
        const jwt = new GetJwt();
        return await jwt.getJwt(jwt.url, jwt.login, jwt.password);
    }
}

export default GetJwt;
