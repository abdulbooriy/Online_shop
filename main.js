import express from 'express';
import dotenv from 'dotenv';
import mainRoute from './routes/index.js';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const PORT = process.env.PORT || 4001;

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "LogRocket Express API with Swagger",
        version: "0.1.0",
        description:
          "This is CRUD API application made with Express and documented with Swagger",
      },
      servers: [
        {
          url: "http://localhost:6001",
        },
      ],
    },
    apis: ["./routes/*.js"],
};

const app = express();
app.use(express.json());
app.use('/api', mainRoute);

const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});