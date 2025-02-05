import express from 'express';
let mainRoute = express.Router();
import productRouter from './product.routes.js';
import categoryRoute from './category.routes.js';
import orderRouter from './order.routes.js';
import orderItemRouter from './orderItem.routes.js';

mainRoute.use("/", productRouter);
mainRoute.use("/", categoryRoute);
mainRoute.use("/", orderRouter);
mainRoute.use("/", orderItemRouter)

export default mainRoute;