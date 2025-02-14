import { Router } from "express";
import productRoute from "./product.routes.js";
import categoryRoute from "./category.routes.js";
import orderRouter from "./order.routes.js";
import categoryItemRoute from "./categoryItem.routes.js";
import brandRoute from "./brand.routes.js";
import userRoute from "./user.routes.js";
import countryRoute from "./country.routes.js";

const mainRoute = Router();

mainRoute.use("/", productRoute);
mainRoute.use("/", categoryRoute);
mainRoute.use("/", brandRoute);
mainRoute.use("/", orderRouter);
mainRoute.use("/", countryRoute);
mainRoute.use("/", userRoute);

export default mainRoute;