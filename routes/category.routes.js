import { Router } from "express";
import { categoryWithPagination, create, findAll, findOne, getBycategoryName_ru, getBycategoryName_uz, remove, update } from "../controllers/category.controller.js";
import upload from '../config/multer.js';

const categoryRoute = Router();

categoryRoute.get('/', findAll);
categoryRoute.post('/', upload.single('image'), create);
categoryRoute.get('/:id', findOne);
categoryRoute.patch('/:id', upload.single('image'), update);
categoryRoute.delete('/:id', remove);
categoryRoute.get('/Pagination', categoryWithPagination);
categoryRoute.get('/Name_ru', getBycategoryName_ru);
categoryRoute.get('/Name_uz', getBycategoryName_uz);

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Manage categories API
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 * 
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
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
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *
 * /category/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     properties:
 *       - in: path
 *         name_uz: string
 *         name: string
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category found
 *       404:
 *         description: Category not found
 *
 *   patch:
 *     summary: Update category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *
 *   delete:
 *     summary: Delete category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name:
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
export default categoryRoute;