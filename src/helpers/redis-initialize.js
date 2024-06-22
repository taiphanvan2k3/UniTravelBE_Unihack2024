const redis = require('redis');
const client = redis.createClient({
    port: 6379,
    host: '127.0.0.1',
});

// const redisCloudUrl = 'redis://default:r0IPCn0N9GFLwnpPl0qNbRR4bhuExSDe@redis-18801.c1.ap-southeast-1-1.ec2.cloud.redislabs.com:18801';

// const client = redis.createClient({
//     url: redisCloudUrl
// });

client.on('error', (err) => console.log('Redis Client Error', err));

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.connect();

module.exports = client;
