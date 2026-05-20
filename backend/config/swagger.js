import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
        title: "Pudin API",
        description: "It's where I write",
    },
    host: "localhost:3000",
};

const outputFile = "../swagger-output.json";
const routes = ["../app.js"];

swaggerAutogen()(outputFile, routes, doc);
