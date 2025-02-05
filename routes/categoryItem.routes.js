import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/categoryItem.controller.js";

const categoryItemRoute = Router();

categoryItemRoute.get('/categoryItems', findAll);
categoryItemRoute.post('/categoryItems', create);
categoryItemRoute.get('/categoryItem/:id', findOne);
categoryItemRoute.patch('/categoryItem/:id', update);
categoryItemRoute.delete('/categoryItem/:id', remove);

export default categoryItemRoute;