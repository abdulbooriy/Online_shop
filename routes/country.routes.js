import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/country.controller.js";

const countryRoute = Router();

countryRoute.get('/country', findAll);
countryRoute.post('/country', create);
countryRoute.get('/country/:id', findOne);
countryRoute.patch('/country/:id', update);
countryRoute.delete('/country/:id', remove);

export default countryRoute;