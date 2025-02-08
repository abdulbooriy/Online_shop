import { Router } from "express";
import productRoute from "./product.routes.js";
import categoryRoute from "./category.routes.js";
import orderRouter from "./order.routes.js";
import brandRoute from "./brand.routes.js";
import userRoute from "./user.routes.js";
import countryRoute from "./country.routes.js";

const mainRoute = Router();

mainRoute.use("/products", productRoute);
mainRoute.use("/categories", categoryRoute);
mainRoute.use("/brands", brandRoute);
mainRoute.use("/orders", orderRouter);
mainRoute.use("/countries", countryRoute);
mainRoute.use("/users", userRoute);

export default mainRoute;