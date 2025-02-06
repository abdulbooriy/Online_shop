import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/order.controller.js";

let orderRouter = Router();

orderRouter.get("/order", findAll);
orderRouter.get("/order/:id", findOne);
orderRouter.post("/order", create);
orderRouter.patch("/order/:id", update);
orderRouter.delete("/order/:id", remove);

export default orderRouter;