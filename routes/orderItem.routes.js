import { Router } from "express";
import { findAll, findOne, create, update, remove } from "../controllers/orderItem.controller.js";

let orderItemRouter = Router();
 
orderItemRouter.get("/orderItem", findAll);
orderItemRouter.get("/orderItem/:id", findOne);
orderItemRouter.post("/orderItem", create);
orderItemRouter.patch("/orderItem/:id", update);
orderItemRouter.delete("/orderItem/:id", remove);

/**
 * @swagger
 * tags:
 *   name: OrderItem
 *   description: The orderItem managing
 *
 * /orderItem:
 *   get:
 *     summary: Get all order items
 *     tags: [OrderItem]
 *     responses:
 *       200:
 *         description: A list of order items
 *
 *   post:
 *     summary: Create a new order item
 *     tags: [OrderItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       201:
 *         description: Order item created successfully
 *
 * /orderItem/{id}:
 *   get:
 *     summary: Get order item by ID
 *     tags: [OrderItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order item found
 *       404:
 *         description: Order item not found
 *
 *   patch:
 *     summary: Update order item by ID
 *     tags: [OrderItem]
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
 *             $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *       404:
 *         description: Order item not found
 *
 *   delete:
 *     summary: Delete order item by ID
 *     tags: [OrderItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *       404:
 *         description: Order item not found
 */

export default orderItemRouter;