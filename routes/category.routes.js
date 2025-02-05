import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/category.controller.js";
import upload from '../config/multer.js';

const categoryRoute = Router();

categoryRoute.get('/categories', findAll);
categoryRoute.post('/categories', upload.single('image'), create);
categoryRoute.get('/category/:id', findOne);
categoryRoute.patch('/category/:id', upload.single('image'), update);
categoryRoute.delete('/category/:id', remove);

export default categoryRoute;