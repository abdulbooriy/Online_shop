import  { Router } from 'express';
import { findAll, findOne, create, update, remove } from '../controllers/order.controller.js';

const orderRoute = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API
 *
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     description: Retrieve a list of all orders
 *     responses:
 *       200:
 *         description: A list of orders
 *       403:
 *         description: Orders table is empty
 *       500:
 *         description: Server error
 */
orderRoute.get('/', findAll);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *       403:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRoute.get('/:id', findOne);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               totalPrice:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     totalSumma:
 *                       type: number
 *     responses:
 *       200:
 *         description: Order created successfully
 *       403:
 *         description: Validation error or user not found
 *       500:
 *         description: Server error
 */
orderRoute.post('/', create);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     tags: [Orders]
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
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       403:
 *         description: Validation error or user not found
 *       500:
 *         description: Server error
 */
orderRoute.put('/:id', update);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       403:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
orderRoute.delete('/:id', remove);

export default orderRoute;