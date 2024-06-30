const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express API for UniTravel",
            version: "1.0.0",
            description:
                "This is a REST API application made with Express. It serves as a backend for UniTravel project.",
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`,
            },
        ],
    },
    apis: [path.join(__dirname, "/../routes/*.js")],
};

const specs = swaggerJSDoc(options);

module.exports = {
    swaggerUI,
    specs,
};
