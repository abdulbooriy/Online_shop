import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/brand.controller.js";
import upload from '../config/multer.js';

const brandRoute = Router();

brandRoute.get('/brands', findAll);
brandRoute.post('/brands', upload.single('image'), create);
brandRoute.get('/brand/:id', findOne);
brandRoute.patch('/brand/:id', update);
brandRoute.delete('/brand/:id', remove);

export default brandRoute;