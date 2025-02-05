import { Router } from "express";
import { create, findAll, findOne, remove, update } from "../controllers/order.controller.js";

const orderRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Buyurtmalarni boshqarish API
 */

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Barcha buyurtmalarni olish
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Buyurtmalar ro'yxati
 */
orderRouter.get("/order", findAll);

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Yangi buyurtma yaratish
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Buyurtma yaratildi
 */
orderRouter.post("/order", create);

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: ID bo'yicha buyurtma olish
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Buyurtma ID
 *     responses:
 *       200:
 *         description: Buyurtma ma'lumotlari
 *       404:
 *         description: Buyurtma topilmadi
 */
orderRouter.get("/order/:id", findOne);

/**
 * @swagger
 * /order/{id}:
 *   patch:
 *     summary: Buyurtma ma'lumotlarini yangilash
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Buyurtma ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Buyurtma yangilandi
 *       404:
 *         description: Buyurtma topilmadi
 */
orderRouter.patch("/order/:id", update);

/**
 * @swagger
 * /order/{id}:
 *   delete:
 *     summary: Buyurtmani o'chirish
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Buyurtma ID
 *     responses:
 *       200:
 *         description: Buyurtma o'chirildi
 *       404:
 *         description: Buyurtma topilmadi
 */
orderRouter.delete("/order/:id", remove);

export default orderRouter;
