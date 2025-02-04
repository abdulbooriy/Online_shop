import { Router } from "express";
import productRouter from "./product.route.js";

let mainRouter = Router();

mainRouter.use("/", productRouter);

export default mainRouter;