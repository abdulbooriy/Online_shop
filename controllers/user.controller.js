import db from "../config/database.js";
import bcrypt from "bcrypt"
import userValid from "../validations/user.validation.js";
import userPatchValid from "../validations/user.update.validation.js";
import { totp } from "otplib";
import { sendOTP } from "../config/eskiz.js";


async function register(req, res) {
    try {
        let { error } = userValid.validate(req.body);
        if (error) {
            return res.status(422).send({ message: error.details[0].message });
        }

        let { fullname, phone, role, password } = req.body;
        let [user] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);

        if (user.length) {
            return res.status(409).send({ message: "Siz allaqachon ro'yxatdan o'tgansiz" });
        }

        let hashed = bcrypt.hashSync(password, 5);
        let [data] = await db.query(
            "INSERT INTO users (fullname, phone, password, role) VALUES (?, ?, ?, ?)",
            [fullname, phone, hashed, role]
        );

        let [newUser] = await db.query("SELECT * FROM users WHERE id = ?", [data.insertId]);

        res.status(201).send({ data: newUser[0] });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
async function sendOtpLogin(req, res) {
    try {
        let { phone } = req.body;
        let [user] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);

        if (!user.length) {
            return res.status(401).send({ message: "Foydalanuvchi topilmadi" });
        }

        let otp = totp.generate(`sekret  ${phone}`);
        await sendOTP(phone, otp);

        res.status(200).send({ message: "OTP yuborildi", otp });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function verifyLoginOtp(req, res) {
    try {
        let { phone, otp, password } = req.body;
        let [user] = await db.query("SELECT * FROM users WHERE phone = ?", [phone]);

        if (!user.length) {
            return res.status(401).send({ message: "Noto'g'ri raqam" });
        }


        let correctPassword = bcrypt.compareSync(password, user[0].password);
        if (!correctPassword) {
            return res.status(400).send({ message: "Noto'g'ri parol" });
        }

        let isValidOtp = totp.check(otp, `sekret  ${phone}`);
        if (!isValidOtp) {
            return res.status(400).send({ message: "Noto'g'ri OTP" });
        }

        res.status(200).send({ message: "Tizimga muvaffaqiyatli kirdingiz", data: user[0] });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}



async function findAll(req, res) {
    try {

        
        let { fullname, page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        let offset = (page - 1) * limit;

        if (fullname) {
            let [users] = await db.query("SELECT * FROM users WHERE lower(fullname) = ? LIMIT ? OFFSET ?",
                [fullname, limit, offset]);

            if (!users.length) {
                return res.status(200).send({ message: "Not found" });
            }

            return res.status(200).send({ data: users, page, limit });
        }

        let [users] = await db.query("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
        if (!users.length) {
            return res.status(200).send({ message: "Empty users" });
        }

        let [[{ total }]] = await db.query("SELECT COUNT(*) AS total FROM users");

        res.status(200).send({
                data: users,
                page,
                limit,
                total,      
                totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function findOne(req, res) {
    try {
        let { id } = req.params;

        let [user] = await db.query("select * from users where id = ?", [id]);
        if (!user.length) {
            return res.status(404).send({ message: "Not found data" });
        }

        res.status(200).send({ data: user[0] });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function update(req, res) {
    try {
        let { error } = userPatchValid.validate(req.body);
        if (error) {
            return res.status(422).send({ message: error.details[0].message });
        }

        let { id } = req.params;
        let keys = Object.keys(req.body);
        let values = Object.values(req.body);

        let queryKey = keys.map((key) => (key += "=?"));
        let [data] = await db.query(
            `update users set ${queryKey.join(", ")} where id = ?`,
            [...values, id]
        );

        if (!data.affectedRows) {
            return res.status(404).send({ message: "Not found data" });
        }

        let [updated] = await db.query("select * from users where id = ?", [id]);
        res.status(200).send({ data: updated[0] });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

async function remove(req, res) {
    try {
        let { id } = req.params;

        let [data] = await db.query("delete from users where id = ?", [id]);
        console.log(data);

        if (!data.affectedRows) {
            return res.status(404).send({ message: "Not found data" });
        }

        res.status(200).send({ message: "Deleted" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}




export { register, sendOtpLogin, verifyLoginOtp, findAll, findOne, update, remove }