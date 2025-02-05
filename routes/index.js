import { Router } from 'express';
import productRouter from './product.routes.js';
import categoryRoute from './category.routes.js';
import orderRouter from './order.routes.js';
import orderItemRouter from './orderItem.routes.js';
import categoryItemRoute from './categoryItem.routes.js';
import brandRoute from './brand.routes.js';
import userRoute from './user.routes.js';

const mainRoute = Router();

mainRoute.use("/", productRouter);
mainRoute.use("/",categoryRoute);
mainRoute.use('/', categoryItemRoute);
mainRoute.use('/', brandRoute);
mainRoute.use('/', userRoute);
mainRoute.use("/", orderRouter);
mainRoute.use("/", orderItemRouter)

export default mainRoute;