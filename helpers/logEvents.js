const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

const fileName = path.join(__dirname, '../Logs', 'logs.log');
const logEvents = async (msg) => {
    const dateTime = `${format(new Date(), `dd-MM-yyyy\tHH:mm:ss`)}`;
    const contentLog = `${dateTime} ----- ${msg}\n`;
    try {
        fs.appendFile(fileName, contentLog);
    } catch (error) {
        console.error(error);
    }
};
module.exports = logEvents;
