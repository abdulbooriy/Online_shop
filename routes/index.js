import { Router } from 'express';
import productRouter from './product.routes.js';
import categoryRoute from './category.routes.js';
<<<<<<< HEAD
import orderRouter from './order.routes.js';
import orderItemRouter from './orderItem.routes.js';

mainRoute.use("/", productRouter);
mainRoute.use("/", categoryRoute);
mainRoute.use("/", orderRouter);
mainRoute.use("/", orderItemRouter)
=======
import categoryItemRoute from './categoryItem.routes.js';
import brandRoute from './brand.routes.js';
import userRoute from './user.routes.js';

const mainRoute = Router();

mainRoute.use("/", productRouter);
mainRoute.use("/",categoryRoute);
mainRoute.use('/', categoryItemRoute);
mainRoute.use('/', brandRoute);
mainRoute.use('/', userRoute);
>>>>>>> 01120378928b738cc98abaffb8be7adb5191b40c

export default mainRoute;