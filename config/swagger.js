import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {  
    openapi: "3.0.0",
    info: {
        title: "Foydalanuvchi autentifikatsiyasi API",
        version: "1.0.0",
        description: "Ushbu API foydalanuvchi ro‘yxatdan o‘tishi, tizimga kirishi va OTP orqali autentifikatsiya qilish uchun ishlatiladi.",
    },
    servers: [
        {
            url: "http://localhost:4000",
            description: "Local server",
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./routes/user.routes.js"]
};

const swaggerSpec = swaggerJSDoc(options);

export default function swaggerDocs(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));    
}
