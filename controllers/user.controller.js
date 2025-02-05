import db from "../config/db.js";
import bcrypt from "bcrypt"
import { userValid, userPatchValid } from "../config/joi.js";
import { totp } from "otplib";
import { sendOTP } from "../config/eskiz.js";


async function otpsend(req, res) {
    try {
        let { phone } = req.body;
        let otp = totp.generate("sekret" + phone);

        await sendOTP(phone, otp);

        res.status(200).send({ message:  `OTP yuborildi ${otp}` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


async function verifyOtp(req, res) {
    try {
        let { phone, token } = req.params;
        let isValid = totp.check(token, "sekret" + phone);

        if (!isValid) {
            res.status(401).json({ message: "Not verified" });
            return;
        }

        res.status(200).json({ message: "Verified" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
async function register(req, res) {
    try {
        let { error } = userValid.validate(req.body);
        if (error) {
            res.status(422).send({ message: error.details[0].message });
            return
        }

        let { fullname, phone, role, password } = req.body;
        let [user] = await db.query("select * from users where phone = ?", [phone])

        if (user.length) {
            res.status(409).send({ message: "you have an account" });
            return
        }


        let hashed = bcrypt.hashSync(password, 5);
        let [data] = await db.query(
            "insert into users (fullname, phone, password, role) values (?,?,?,?)",
            [fullname, phone, hashed, role]);

        let [newUser] = await db.query("select * from users where id = ?", [
            data.insertId,
        ]);

        res.status(201).send({ data: newUser[0] });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}





async function login(req, res) {
    try {
        let { phone, password } = req.body;
        let [user] = await db.query("select * from users where phone = ?", [
            phone,
        ]);

        if (!user.length) {
            res.status(401).send({ message: "Not authorized" });
            return;
        }

        let correct = bcrypt.compareSync(password, user[0].password);
        if (!correct) {
            res.status(400).send({ message: "Wrong password" });
            return
        }

        res.send({message: "You have successfully"})

    } catch (error) {
        res.send({ message: error.message })
    }
}



async function findAll(req, res) {
    try {
        let [users] = await db.query("select * from users");
        if (!users.length) {
            return res.status(200).send({ message: "Empty users" });
        }

        res.status(200).send({ data: users });
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




export { register, login, otpsend, verifyOtp, findAll, findOne, update, remove }