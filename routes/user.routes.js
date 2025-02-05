import { Router } from "express";
import { findAll, findOne, login, otpsend, register, remove, update, verifyOtp } from "../controllers/user.controller.js";
import { sendOTP } from "../config/eskiz.js";

let userRote = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: "Foydalanuvchini ro‘yxatdan o‘tkazish"
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
 *       200:
 *         description: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi"
 *       400:
 *         description: "Telefon raqam yoki parol noto‘g‘ri"
 *       409:
 *         description: "Foydalanuvchi allaqachon ro‘yxatdan o‘tgan"
 */
userRote.post("/register", register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: "Foydalanuvchini tizimga kirish"
 *     description: "Telefon raqam va parol orqali tizimga kirish"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Tizimga muvaffaqiyatli kirdingiz"
 *       400:
 *         description: "Noto‘g‘ri parol"
 *       401:
 *         description: "Not authorized"
 */
userRote.post("/login", login);

/**
 * @swagger
 * /api/users/send-otp:
 *   post:
 *     summary: "Foydalanuvchiga OTP jo‘natish"
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
 *         description: "Telefon raqam majburiy"
 */
userRote.post("/send-otp", otpsend);

/**
 * @swagger
 * /api/users/verify/{phone}/{token}:
 *   post:
 *     summary: "Foydalanuvchi OTP tekshirish"
 *     description: "Telefon raqam va OTP orqali tasdiqlash"
 *     parameters:
 *       - in: path
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *         description: "Foydalanuvchi telefon raqami"
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: "Foydalanuvchi kiritgan OTP kodi"
 *     responses:
 *       200:
 *         description: "OTP tasdiqlandi"
 *       401:
 *         description: "Noto‘g‘ri OTP"
 */
userRote.post("/verify/:phone/:token", verifyOtp);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: "Barcha foydalanuvchilarni olish"
 *     description: "Foydalanuvchilar ro‘yxatini qaytaradi"
 *     responses:
 *       200:
 *         description: "Foydalanuvchilar ro‘yxati"
 */
userRote.get("/users", findAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: "Bitta foydalanuvchini olish"
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
userRote.get("/users/:id", findOne);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: "Foydalanuvchini o‘chirish"
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
userRote.delete("/users/:id", remove);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: "Foydalanuvchi ma’lumotlarini yangilash"
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
 *       404:
 *         description: "Foydalanuvchi topilmadi"
 */
userRote.patch("/users/:id", update);

export default userRote;
