import { Router } from 'express';
import productRouter from './product.routes.js';
import categoryRoute from './category.routes.js';

const mainRoute = Router();

mainRoute.use("/", productRouter);
mainRoute.use("/",categoryRoute);

export default mainRoute;