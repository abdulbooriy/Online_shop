import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/product.controller.js";
import upload from "../config/multer.js";

let productRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Manage products API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: FindAll products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: All products
 */
productRoute.get('/products', findAll);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               name_ru:
 *                 type: string
 *               name_uz: 
 *                 type: string
 *               brand_id:
 *                 type: integer
 *               country_id: 
 *                 type: integer
 *               price:
 *                 type: integer
 *               oldPrice:
 *                 type: integer
 *               available:
 *                 type: boolean
 *               description_uz: 
 *                 type: string
 *               description_ru:
 *                 type: string
 *               washable:
 *                 type: boolean
 *               size:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created product successfully 
 *       400:
 *         description: Not found
 */
productRoute.post('/products', upload.single('image'), create);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: FindOne product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product info
 *       404:
 *         description: Not found product id
 */
productRoute.get("/product/:id", findOne);

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Update products by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                type: integer
 *               name_ru:
 *                type: string
 *               name_uz: 
 *                type: string
 *               brand_id:
 *                type: integer
 *               country_id: 
 *                type: integer
 *               price:
 *                type: integer
 *               oldPrice:
 *                type: integer
 *               available:
 *                type: boolean
 *               description_uz: 
 *                type: string
 *               description_ru:
 *                type: string
 *               washable:
 *                type: boolean
 *               size:
 *                type: string
 *     responses:
 *       200:
 *         description: Updated product successfully
 *       404:
 *         description: Not found product ID
 */
productRoute.patch("/product/:id", update);

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Delete products by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Not found product ID
 */
productRoute.delete("/product/:id", remove);

export default productRoute;