import redis from 'redis';
import global from './constants.js';

const publisher = redis.createClient();

(async () => {

    const article = [{ "datatype": "VSA", "symbol": "DICE", "timeframe": "5Min", "vsa": 1, "cs": 0, "price": 44.85 }, { "datatype": "VSA", "symbol": "CCL", "timeframe": "15Min", "vsa": 4, "cs": 4, "price": 46.1 }];
    // const article = {
    //     id: '123456',
    //     name: 'Using Redis Pub/Sub with Node.js',
    //     blog: 'Logrocket Blog',
    // };

    await publisher.connect();

    await publisher.publish(global.EVENT_BAR_POST_TO_SERVER, JSON.stringify(article));
    process.exit(0);
})();
