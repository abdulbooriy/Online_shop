import { Router } from 'express';
import { findAll, create, findOne, update, remove, getByCountryName_uz, getByCountryName_ru, countriesWithLimit, countriesWithPagination } from '../controllers/country.controller.js';

const countryRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country management API
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of all countries
 *       500:
 *         description: Server error
 */
countryRoute.get('/', findAll);

/**
 * @swagger
 * /countries:
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
 *               name_uz:
 *                 type: string
 *               name_ru:
 *                 type: string
 *     responses:
 *       200:
 *         description: Country created
 *       403:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
countryRoute.post('/', create);

/**
 * @swagger
 * /countries/{id}:
 *   get:
 *     summary: Get a country by ID
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Country found
 *       404:
 *         description: Country not found
 *       500:
 *         description: Server error
 */
countryRoute.get('/:id', findOne);

/**
 * @swagger
 * /countries/{id}:
 *   patch:
 *     summary: Update a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_uz:
 *                 type: string
 *               name_ru:
 *                 type: string
 *     responses:
 *       200:
 *         description: Country updated
 *       404:
 *         description: Country not found
 *       500:
 *         description: Server error
 */
countryRoute.patch('/:id', update);

/**
 * @swagger
 * /countries/{id}:
 *   delete:
 *     summary: Delete a country
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Country deleted
 *       404:
 *         description: Country not found
 *       500:
 *         description: Server error
 */
countryRoute.delete('/:id', remove);

/**
 * @swagger
 * /countries/by-name-uz:
 *   get:
 *     summary: Get countries ordered by Uzbek name
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Countries ordered by Uzbek name
 *       500:
 *         description: Server error
 */
countryRoute.get('/by-name-uz', getByCountryName_uz);

/**
 * @swagger
 * /countries/by-name-ru:
 *   get:
 *     summary: Get countries ordered by Russian name
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Countries ordered by Russian name
 *       500:
 *         description: Server error
 */
countryRoute.get('/by-name-ru', getByCountryName_ru);

/**
 * @swagger
 * /countries/with-limit:
 *   get:
 *     summary: Get countries with limit
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of countries with limit
 *       500:
 *         description: Server error
 */
countryRoute.get('/with-limit', countriesWithLimit);

/**
 * @swagger
 * /countries/pagination:
 *   get:
 *     summary: Get countries with pagination
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated list of countries
 *       500:
 *         description: Server error
 */
countryRoute.get('/pagination', countriesWithPagination);

export default countryRoute;