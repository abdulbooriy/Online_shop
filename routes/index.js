import { Router } from "express";
import productRoute from "./product.routes.js";
import categoryRoute from "./category.routes.js";
import orderRouter from "./order.routes.js";
<<<<<<< HEAD
import categoryItemRoute from "./categoryItem.routes.js";
=======
>>>>>>> a58dc11b3915c92fe838dd6e3a78b131cd125d96
import brandRoute from "./brand.routes.js";
import userRoute from "./user.routes.js";
import countryRoute from "./country.routes.js";

const mainRoute = Router();

<<<<<<< HEAD
mainRoute.use("/", productRoute);
mainRoute.use("/", categoryRoute);
mainRoute.use("/", brandRoute);
mainRoute.use("/", orderRouter);
mainRoute.use("/", countryRoute);
mainRoute.use("/", userRoute);
=======
mainRoute.use("/products", productRoute);
mainRoute.use("/categories", categoryRoute);
mainRoute.use("/brands", brandRoute);
mainRoute.use("/orders", orderRouter);
mainRoute.use("/countries", countryRoute);
mainRoute.use("/users", userRoute);
>>>>>>> a58dc11b3915c92fe838dd6e3a78b131cd125d96

export default mainRoute;