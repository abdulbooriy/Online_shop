import { Router } from "express";
import upload from "../config/multer.js";
import {
  findAll,
  create,
  findOne,
  update,
  remove,
  categoryWithPagination,
  getBycategoryName_ru,
  getBycategoryName_uz,
} from "../controllers/category.controller.js";

const categoryRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Returns a list of categories
 */
categoryRoute.get("/", findAll);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *       - in: formData
 *         name: name_ru
 *         type: string
 *         required: true
 *       - in: formData
 *         name: name_uz
 *         type: string
 *         required: true
 *     responses:
 *       201:
 *         description: Category created successfully
 */
categoryRoute.post("/", upload.single("image"), create);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns category details
 */
categoryRoute.get("/:id", findOne);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Categories]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: formData
 *         name: image
 *         type: file
 *       - in: formData
 *         name: name_ru
 *         type: string
 *       - in: formData
 *         name: name_uz
 *         type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
categoryRoute.patch("/:id", upload.single("image"), update);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
categoryRoute.delete("/:id", remove);

/**
 * @swagger
 * /categories/pagination:
 *   get:
 *     summary: Get categories with pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns paginated categories
 */
categoryRoute.get("/pagination", categoryWithPagination);

/**
 * @swagger
 * /categories/sort_ru:
 *   get:
 *     summary: Get categories sorted by name_ru
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name_ru
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns categories sorted by name_ru
 */
categoryRoute.get("/sort_ru", getBycategoryName_ru);

/**
 * @swagger
 * /categories/sort_uz:
 *   get:
 *     summary: Get categories sorted by name_uz
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: name_uz
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns categories sorted by name_uz
 */
categoryRoute.get("/sort_uz", getBycategoryName_uz);

export default categoryRoute;