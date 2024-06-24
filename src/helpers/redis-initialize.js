const redis = require('redis');
// const client = redis.createClient({
//     port: 6379,
//     host: '127.0.0.1',
// });

const redisCloudUrl = 'redis://default:yuHkdZzi1uaLkikay83VGDXvn9QpbLHT@redis-16013.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:16013';

const client = redis.createClient({
    url: redisCloudUrl
});

client.on('error', (err) => console.log('Redis Client Error', err));

client.on('connect', () => {
    console.log('Connected to Redis');
});

client.connect();

module.exports = client;
