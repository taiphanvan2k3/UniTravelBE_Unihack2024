const logEvents = require('../helpers/logEvents');
const { v4: uuid } = require('uuid');

module.exports = (err, req, res, next) => {
    logEvents(`idError ----- ${uuid()} ----- ${req.url} ----- ${req.method} ----- ${err.message}`);
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
};
