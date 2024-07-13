const green = "\x1b[32m";
const blue = "\x1b[34m";
const red = "\x1b[31m";
const reset = "\x1b[0m";

const logInfo = (caller, message = "Start") => {
    if (message === "Start") {
        console.log(
            `${green}========================================================================${reset}`
        );
    }

    console.log(`${blue}INFORMATION: [${caller}] ${message}${reset}`);
};

const logError = (caller, message) => {
    console.log(`${red}ERROR: [${caller}] ${message}${reset}`);
};

module.exports = {
    logInfo,
    logError,
};
