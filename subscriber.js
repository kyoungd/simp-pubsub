import redis from 'redis';
import socketIOClient from 'socket.io-client';
import global from './constants.js';
import moment from 'moment';
import _ from 'lodash';
import * as dotenv from 'dotenv';
import GetJwt from './utilGetJwt.js';
import { getOne } from './dataFetch.js';

dotenv.config()

// const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjY1MDgwMTE1LCJleHAiOjE2Njc2NzIxMTV9.PvvtvWs8UFdrdZAvb3ZPxtAbX9fu5Xmyo889pS9ln10';
// const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjY1ODYzOTk0LCJleHAiOjE2Njg0NTU5OTR9.MrYZbBMawh7jHeSlRxsxqJpQKt8nVqMIJSkKX_z8iTA';
// const hostUrl = 'http://localhost:1337';

// get values from .env file
const hostUrl = process.env.HOST_URL;

const connectSocket = (jwt) => {
    const socket = socketIOClient(hostUrl, {
        query: {
            token: jwt
        }
    });
    return socket;
}

const getTech = (techs, bar) => {
    const result = [];
    for (const tech of techs) {
        if ((bar[tech.field] & tech.value) === tech.value)
            result.push(tech.code);
    }
    if (result.length >= 2) return result.join(',');
    if (result.length == 1) return result[0];
    return '';
}

const getPattern = (vsa, cs) => {
    let pattern = '';
    pattern += vsa === 1 ? ' thrust' : '';
    pattern += vsa === 2 ? ' climax' : '';
    pattern += (cs & 4) === 4 ? ' ABCD' : '';
    pattern += (cs & 8) === 8 ? ' pullback' : '';
    pattern += (cs & 16) === 16 ? ' macd' : '';
    return pattern;
}

const getSentiment = async (symbol, datajwt) => {
    const url = `process.env.URL_GET_SENTIMENT?symbol=${symbol}`;
    const sentiment = getOne(url, datajwt);
}

const run = async () => {
    const url = process.env.URL_GET_TECH_CODE;
    const datajwt = await GetJwt.run();
    const globalData = await getOne(url, datajwt);
    const techs = globalData.data[0].attributes.techCodes;
    console.log(techs);
    const jwt = datajwt ? datajwt : process.env.TOKEN;
    console.log('Connecting to admin server...' + hostUrl);
    const socket = connectSocket(jwt);
    const username = 'user-' + Math.random().toString().replace('.', '');
    const room = global.EVENT_BAR_POST_TO_SERVER;
    socket.emit('joinRoom', { username, room });

    const client = redis.createClient();

    const subscriber = client.duplicate();

    await subscriber.connect();

    await subscriber.subscribe(global.EVENT_BAR_POST_TO_SERVER, (message) => {
        try {
            console.log(message);
            const content = JSON.parse(message);
            const data = content.filter((x) => x && getTech(techs, x).length > 0)
            data.map(async (pack) => {
                const sentiment = await getSentiment(pack.symbol, datajwt);
                const row = { ...pack, pattern: getTech(techs, pack), codes: getTech(techs, pack), sentiment: sentiment.data.sentiment };
                console.log(moment().format('yyyy-mm-dd:hh:mm:ss'));
                console.log('chatMessage: ' + JSON.stringify(row)); // 'message'
                socket.emit('chatMessage', JSON.stringify(row));
            });
            // for (const x of data) {
            //     const row = { ...x, pattern: getTech(techs, x), codes: getTech(techs, x) };
            //     console.log(moment().format('yyyy-mm-dd:hh:mm:ss'));
            //     console.log('chatMessage: ' + JSON.stringify(row)); // 'message'
            //     socket.emit('chatMessage', JSON.stringify(row));
            // }
        }
        catch (e) {
            console.log(e);
        }
    });

}

run().then(() => {
    console.log('start successfully');
}).catch((e) => {
    console.log(e);
});

export { getTech }
