import redis from 'redis';

const client = redis.createClient();

client
  .connect()
  .then(async (res) => {
    console.log('connected');
    // Write your own code here

    // Example
    const value = await client.lRange('data', 0, -1);
    console.log(value.length);
    console.log(value);
    client.quit();
  })
  .catch((err) => {
    console.log('err happened' + err);
  });
