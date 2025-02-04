import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/product.controller.js";

let productRouter = Router();

productRouter.get("/products", findAll);
productRouter.get("/products/:id", findOne);
productRouter.post("/products", create);
productRouter.patch("/products/:id", update);
productRouter.delete("/products/:id", remove);

export default productRouter;