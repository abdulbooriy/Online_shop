import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/categoryItem.controller.js";

const categoryItemRoute = Router();

/**
 * @swagger
 * tags:
 *   - name: Category Items
 *     description: Kategoriya elementlarini boshqarish API
 */

/**
 * @swagger
 * /categoryItems:
 *   get:
 *     summary: Barcha kategoriya elementlarini olish
 *     tags: [Category Items]
 *     responses:
 *       200:
 *         description: Kategoriya elementlari ro'yxati
 */
categoryItemRoute.get('/categoryItems', findAll);

/**
 * @swagger
 * /categoryItems:
 *   post:
 *     summary: Yangi kategoriya elementi yaratish
 *     tags: [Category Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Kategoriya elementi yaratildi
 */
categoryItemRoute.post('/categoryItems', create);

/**
 * @swagger
 * /categoryItem/{id}:
 *   get:
 *     summary: ID bo'yicha kategoriya elementini olish
 *     tags: [Category Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kategoriya elementi ID
 *     responses:
 *       200:
 *         description: Kategoriya elementi ma'lumotlari
 *       404:
 *         description: Kategoriya elementi topilmadi
 */
categoryItemRoute.get('/categoryItem/:id', findOne);

/**
 * @swagger
 * /categoryItem/{id}:
 *   patch:
 *     summary: Kategoriya elementini yangilash
 *     tags: [Category Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kategoriya elementi ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Kategoriya elementi yangilandi
 *       404:
 *         description: Kategoriya elementi topilmadi
 */
categoryItemRoute.patch('/categoryItem/:id', update);

/**
 * @swagger
 * /categoryItem/{id}:
 *   delete:
 *     summary: Kategoriya elementini o'chirish
 *     tags: [Category Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Kategoriya elementi ID
 *     responses:
 *       200:
 *         description: Kategoriya elementi o'chirildi
 *       404:
 *         description: Kategoriya elementi topilmadi
 */
categoryItemRoute.delete('/categoryItem/:id', remove);

export default categoryItemRoute;
