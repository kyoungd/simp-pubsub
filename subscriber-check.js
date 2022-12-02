import redis from 'redis';
import socketIOClient from 'socket.io-client';
import global from './constants.js';
import moment from 'moment';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import GetJwt from './utilGetJwt.js';

dotenv.config()

const client = redis.createClient();
const hostUrl = process.env.HOST_URL;

const connectSocket = (jwt) => {
    const socket = socketIOClient(hostUrl, {
        query: {
            token: jwt
        }
    });
    return socket;
}

(async () => {

    const datajwt = await GetJwt.run() ;
    console.log(datajwt);
    const jwt = datajwt ? datajwt.jwt : process.env.TOKEN;
    console.log('Connecting to admin server...' + hostUrl);
    const socket = connectSocket(jwt);
    const username = 'user-' + Math.random().toString().replace('.', '');
    const room = global.EVENT_BAR_POST_TO_SERVER;
    socket.emit('joinRoom', { username, room });

    socket.on('message', (message) => {
        const { symbol } = JSON.parse(message.value);
        client.del(symbol, function(err, response) {
            if (response == 1) {
                console.log("Deleted Successfully!")
            } else{
                console.log("Cannot delete")
            }
         })
    });


})();
