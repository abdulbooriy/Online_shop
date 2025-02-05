import { Router } from 'express';
import productRouter from './product.routes.js';
import categoryRoute from './category.routes.js';
import categoryItemRoute from './categoryItem.routes.js';
import brandRoute from './brand.routes.js';

const mainRoute = Router();

mainRoute.use("/", productRouter);
mainRoute.use("/",categoryRoute);
mainRoute.use('/', categoryItemRoute);
mainRoute.use('/', brandRoute);

export default mainRoute;