import { Router } from "express";
import categoryRoute from "./category.routes.js";

const mainRoute = Router();
mainRoute.use('/', categoryRoute);

export default mainRoute;