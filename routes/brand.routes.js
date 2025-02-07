import { Router } from "express";
import { create, findAll, findOne, getByBrandName, remove, update } from "../controllers/brand.controller.js";
import upload from '../config/multer.js';

const brandRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Brands
 *     description: Manage brand API
 */

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: "FindAll brands"
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: "All brands"
 *       500: 
 *         description: "Some server error"
 */
brandRoute.get('/brands', findAll);

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: "Create brands"
 *     tags: [Brands]
 *     description: "Create brands"
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
 *               image: 
 *                 type: string 
 *     responses:
 *       200:
 *         description: "Created brands"
 *       400:
 *         description: "Not found brands"
 */
brandRoute.post('/brands', upload.single('image'), create);

/**
 * @swagger
 * /brand/{id}:
 *   get:
 *     summary: FindOne brand
 *     tags: [Brands]
 *     description: find one brand by ID
 *     parameters:
 *       - in: path
 *         id: number
 *         name_ru: string
 *         name_uz: string
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "This is brand's info"
 *       404:
 *         description: "Brand id not found"
 */
brandRoute.get('/brand/:id', findOne);

/**
 * @swagger
 * /brand/{id}:
 *   patch:
 *     summary: "Update brand"
 *     tags: [Brands]
 *     description: "Update brands by ID"
 *     parameters:
 *       - in: path
 *         name_ru: string
 *         name_uz: string
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name_ru:
 *                 type: string
 *               name_uz:
 *                 type: string
 *               image: 
 *                  type: string
 *     responses:
 *       200:
 *         description: "Brand updated"
 *       404:
 *         description: "Not found brand id"
 */
brandRoute.patch('/brand/:id', upload.single('image'), update);

/**
 * @swagger
 * /brand/{id}:
 *   delete:
 *     summary: "Delete brands"
 *     tags: [Brands]
 *     description: "delete brands by ID"
 *     parameters:
 *       - in: path
 *         id: integer
 *         name_ru: string
 *         name_uz: string
 *         required: true
 *         schema:
 *           type: string
 *         description: "This is brand's ID"
 *     responses:
 *       200:
 *         description: "Deleted sucessfully brand"
 *       404:
 *         description: "Not found brand"
 */
brandRoute.delete('/brand/:id', remove);
brandRoute.get('/brandsWithName_uz', getByBrandName);

export default brandRoute;