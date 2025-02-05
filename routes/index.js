import express from 'express';
let mainRoute = express.Router();
import productRouter from './product.routes.js';
import categoryRoute from './category.routes.js';

mainRoute.use("/", productRouter);
mainRoute.use("/",categoryRoute);

export default mainRoute;