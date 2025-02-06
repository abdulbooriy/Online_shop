import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/country.controller.js";

const countryRoute = Router();

countryRoute.get('/country', findAll);
countryRoute.post('/country', create);
countryRoute.get('/country/:id', findOne);
countryRoute.patch('/country/:id', update);
countryRoute.delete('/country/:id', remove);

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all country
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: A list of countries
 * 
 *   post:
 *     summary: Create a new country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id: 
 *                 type: number
 *               name_uz:
 *                 type: string
 *               name_ru:
 *                 type: string
 *     responses:
 *       201:
 *         description: Country created successfully
 *
 * /country/{id}:
 *   get:
 *     summary: Get country by ID
 *     tags: [Countries]
 *     properties:
 *       - in: path
 *         name_uz: string
 *         name_ru: string
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Country found
 *       404:
 *         description: Country not found
 *
 *   patch:
 *     summary: Update country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name_uz: string
 *         name_ru: string
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_uz:
 *                 type: string
 *               name_ru:
 *                 type: string
 *     responses:
 *       200:
 *         description: Country updated successfully
 *       404:
 *         description: Country not found
 *
 *   delete:
 *     summary: Delete country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name:
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *       404:
 *         description: Country not found
 */

export default countryRoute;