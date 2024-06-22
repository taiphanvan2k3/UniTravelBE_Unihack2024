const client = require('../helpers/init_redis')

const limitRequest = async (req, res, next) => {
    try {
        // Get ip
        const getIpUser =
            req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const numRequest = await client.incr(getIpUser);
        let _ttl;
        if (numRequest === 1) {
            // Set time which user can call back function after over request in a time
            await client.expire(getIpUser, 60);
            _ttl = 60;
        } else {
            _ttl = await client.ttl(getIpUser);
        }
        if (numRequest > 30) {
            return res.status(503).json({
                status: 'error',
                message: 'Server is busy',
                numRequest,
                _ttl,
            });
        }
        req.numRequest = numRequest;
    } catch (error) {
        console.log(error.message);
        next(error);
    }
    next();
};

module.exports = {
    limitRequest,
};
