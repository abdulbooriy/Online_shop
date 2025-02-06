import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/product.controller.js";
import upload from "../config/multer.js";

let productRoute = Router();

productRoute.get('/products', findAll);
productRoute.post('/products', upload.single('image'), create);
productRoute.get("/product/:id", findOne);
productRoute.patch("/product/:id", update);
productRoute.delete("/product/:id", remove);

export default productRoute;