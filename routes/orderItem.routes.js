import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/orderItem.controller.js";

let orderItemRouter = Router();
 
orderItemRouter.get("/orderItem", findAll);
orderItemRouter.get("/orderItem/:id", findOne);
orderItemRouter.post("/orderItem", create);
orderItemRouter.patch("/orderItem/:id", update);
orderItemRouter.delete("/orderItem/:id", remove);

export default orderItemRouter;