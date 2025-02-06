import database from "../config/database.js";
import orderValidation from "../validations/order.validation.js";

async function findAll(req,res) {
    try {
        let [data] = await database.query("select * from orders");
        if(data.length==0){
            return res.status(403).send({message:"Table 'orders' is empty😞"});
        }
        res.status(200).send({data});
    } catch (error) {
        console.log({error});
    }
}

async function findOne(req,res) {
    try {
        let {id} = req.params;
        let [data] = await database.query("select * from orders where id = ?", [id]);
        if(data.length==0){
            return res.status(403).send({message:"Order not found❗"});
        }
        res.status(403).send({data});
    } catch (error) {
        console.log(error);
        
    }
}

async function create(req,res) {
    try {
        let {value, error} = orderValidation(req.body);
        if(error){
            return res.status(403).send({message:error.details[0].message});
        }
        let {user_id} = value;
        let [u] = await database.query("select * from users where id = ?", [user_id]);
        if(u.length==0){
            return res.status(403).send({message:"Siz kiritgan user_id tableda mavjud emas❗"});
        }
        let a = await database.query("insert into orders (user_id) values (?)", [user_id]);
        let newID = a[0].insertId;
        let [newData] = await db.query("select * from orders where id = ?", [newID]);
        res.send({"Order created successfully":newData});
    } catch (error) {
        console.log({error}); 
    }
}

async function update(req,res) {
    try {
        let {value, error} = orderValidation(req.body);
        if(error){
            return res.status(403).send({message:error.details[0].message});
        }
        let {user_id} = value;
        let [u] = await database.query("select * from users where id = ?", [user_id]);
        if(u.length==0){
            return res.status(403).send({message:"Siz kiritgan user_id tableda mavjud emas"});
        }
        let {id} = req.params;
        let [oldData] = await database.query("select * from orders where id = ? ", [id]);
        if(oldData.length==0){
            return res.status(403).send({message:"user_id not found❗"});
        }
        let [data] = await database.query("update orders set user_id = ?  where id = ?", [user_id, id]);
        let check = data.affectedRows;
        if(check>0){
            let [updatedData] = await database.query("select * from orders where id = ? ", [id]);
            res.status(200).send({"user_id updated successfully":updatedData});
        }
    } catch (error) {
        console.log({error});
    }
}

async function remove(req,res) {
    try {
        let {id} = req.params;
        let [oldData] = await database.query("select * from orders where id = ?", [id]);
        if(oldData.length==0){
            return res.status(403).send({message:"user_id not found"});
        }
        let [data] = await database.query("delete from orders where id = ?", [id]);
        let check = data.affectedRows;
        if(check>0){
            res.status(200).send({"Deleted order":oldData});
        }
    } catch (error) {
        console.log({error});
    }

}


export {findAll, findOne, create, update, remove};