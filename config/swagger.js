import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {  
    openapi: "3.0.0",
    info: {
        title: "Online_shop",
        version: "1.0.0",
    },
    servers: [
        {

            url: "http://18.199.218.87:4000/api",

            description: "Local server",
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs(app) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}