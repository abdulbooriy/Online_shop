import { Router } from "express";
import {findAll,findOne,register,remove,sendOtpLogin,update, verifyLoginOtp} from "../controllers/user.controller.js";

let userRoute = Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Foydalanuvchilarni boshqarish API
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: "Foydalanuvchini ro‘yxatdan o‘tkazish"
 *     tags: [Users]
 *     description: "Foydalanuvchi fullname, phone, password va role orqali ro‘yxatdan o‘tadi"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi"
 *       400:
 *         description: "Telefon raqam yoki parol noto‘g‘ri"
 *       409:
 *         description: "Foydalanuvchi allaqachon ro‘yxatdan o‘tgan"
 */
userRoute.post("/register", register);

/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: "Foydalanuvchiga OTP jo‘natish"
 *     tags: [Users]
 *     description: "Telefon raqam orqali OTP kod jo‘natish"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: "OTP yuborildi"
 *       400:
 *         description: "Telefon raqam noto‘g‘ri"
 *       401:
 *         description: "Foydalanuvchi topilmadi"
 */
userRoute.post("/send-otp", sendOtpLogin);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: "OTP kodini tekshirish"
 *     tags: [Users]
 *     description: "Telefon raqam va OTP kod orqali foydalanuvchini tasdiqlash"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "OTP tasdiqlandi"
 *       400:
 *         description: "Noto‘g‘ri OTP yoki parol"
 *       401:
 *         description: "Foydalanuvchi topilmadi"
 */
userRoute.post("/verify-otp", verifyLoginOtp);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Barcha foydalanuvchilarni olish"
 *     tags: [Users]
 *     description: "Foydalanuvchilar ro‘yxatini qaytaradi"
 *     parameters:
 *       - in: query
 *         name: fullname
 *         required: false
 *         schema:
 *           type: string
 *         description: "Foydalanuvchi ismiga asoslangan qidiruv"
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: "Sahifa raqami"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: "Foydalanuvchilar soni"
 *     responses:
 *       200:
 *         description: "Foydalanuvchilar ro‘yxati"
 *       404:
 *         description: "Foydalanuvchilar topilmadi"
 */
userRoute.get("/users", findAll);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: "Bitta foydalanuvchini olish"
 *     tags: [Users]
 *     description: "ID bo‘yicha foydalanuvchini olish"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Foydalanuvchi ID raqami"
 *     responses:
 *       200:
 *         description: "Foydalanuvchi ma’lumotlari"
 *       404:
 *         description: "Foydalanuvchi topilmadi"
 */
userRoute.get("/users/:id", findOne);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: "Foydalanuvchi ma’lumotlarini yangilash"
 *     tags: [Users]
 *     description: "ID bo‘yicha foydalanuvchi ma’lumotlarini yangilash"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Foydalanuvchi ID raqami"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Foydalanuvchi ma’lumotlari yangilandi"
 *       400:
 *         description: "Foydalanuvchi ID noto‘g‘ri"
 *       404:
 *         description: "Foydalanuvchi topilmadi"
 */
userRoute.patch("/users/:id", update);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: "Foydalanuvchini o‘chirish"
 *     tags: [Users]
 *     description: "ID bo‘yicha foydalanuvchini o‘chirish"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: "Foydalanuvchi ID raqami"
 *     responses:
 *       200:
 *         description: "Foydalanuvchi o‘chirildi"
 *       404:
 *         description: "Foydalanuvchi topilmadi"
 */
userRoute.delete("/users/:id", remove);

export default userRoute;