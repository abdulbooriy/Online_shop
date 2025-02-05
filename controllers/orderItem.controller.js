import database from "../config/database.js";
import orderItemValidation from "../validations/orderItem.validation.js";

async function findAll(req,res) {
    try {
        let [data] = await database.query(`select 
            orderItem.id as ID,
            users.fullname as Username,
            users.password as Password,
            users.role as Role,
            users.phone as Phone, 
            product.name_uz as Product,
            orderItem.count as Count,
            orderItem.total as Total,
            product.description_uz as Tavsifi,
            product.price as Price,
            product.oldPrice as Old_Price, 
            product.available as Mavjudigi,
            country.name_uz as Made_in,
            brands.name_uz as Brand
            from orderItem
            inner join orders on orderItem.order_id = orders.id
            inner join users on orders.user_id = users.id
            inner join product on orderItem.product_id = product.id
            inner join country on product.country_id = country.id
            inner join brands on product.brand_id = brands.id
        `);
        if(data.length==0){
            return res.status(403).send({message:"Table 'orderItems' is empty😞"});
        }
        res.status(200).send({data});
    } catch (error) {
        console.log({error});
        res.status(500).send({error});
    }
}

async function findOne(req,res) {
    try {
        let {id} = req.params;
        let [data] = await database.query(`select 
            orderItem.id as ID,
            users.fullname as Username,
            users.password as Password,
            users.role as Role,
            users.phone as Phone, 
            orderItem.count as Count,
            orderItem.total as Total,
            product.name_uz as Product,
            product.description_uz as Tavsifi,
            product.price as Price,
            product.oldPrice as Old_Price, 
            product.available as Mavjudigi,
            country.name_uz as Made_in,
            brands.name_uz as Brand
            from orderItem
            inner join orders on orderItem.order_id = orders.id
            inner join users on orders.user_id = users.id
            inner join product on orderItem.product_id = product.id
            inner join country on product.country_id = country.id
            inner join brands on product.brand_id = brands.id
            where orderItem.id = ?`, [id]);
        if(data.length==0){
            return res.status(403).send({message:"Order item not found❗"});
        }
        res.status(200).send({data});
    } catch (error) {
        res.status(500).send({error});
        console.log(error);
        
    }
}

async function create(req,res) {
    try {
        let {value, error} = orderItemValidation(req.body);
        if(error){
            return res.status(403).send({message:error.details[0].message});
        }
        let {product_id, order_id, count, total} = value;
        let [o] = await database.query("select * from orders where id = ?", [order_id]);
        let [p] = await database.query("select * from product where id = ?", [product_id]);
        if(o.length==0||p.length==0){
            return res.status(403).send({message:"Siz kiritgan order_id yoki product_id mavjud emas❗"});
        }
        let a = await database.query("insert into orderItem (product_id, order_id, count, total) values (?,?,?,?)", [product_id, order_id, count, total]);
        let newID = a[0].insertId;
        let [newData] = await database.query("select * from orderItem where id = ?", [newID]);
        res.send({"Order item created successfully":newData});
    } catch (error) {
        console.log({error}); 
        res.status(500).send({error});
    }
}

async function update(req,res) {
    try {
        let {value, error} = orderItemValidation(req.body);
        if(error){
            return res.status(403).send({message:error.details[0].message});
        }
        let {product_id, order_id, count, total} = value;
        let [o] = await database.query("select * from orders where id = ?", [order_id]);
        let [p] = await database.query("select * from product where id = ?", [product_id]);
        if(o.length==0||p.length==0){
            return res.status(403).send({message:"Siz kiritgan order_id yoki product_id mavjud emas❗"});
        }
        let {id} = req.params;
        let [oldData] = await database.query("select * from orderItem where id = ? ", [id]);
        if(oldData.length==0){
            return res.status(403).send({message:"order item not found❗"});
        }
        let [data] = await database.query("update orderitem set order_id = ?, product_id = ?, count = ?, total = ? where id = ?", [product_id, order_id, count, total,id]);
        let check = data.affectedRows;
        if(check>0){
            let [updatedData] = await database.query("select * from orderItem where id = ? ", [id]);
            res.status(200).send({"order item updated successfully":updatedData});
        }
    } catch (error) {
        res.status(500).send({error});
        console.log({error});
    }
}

async function remove(req,res) {
    try {
        let {id} = req.params;
        let [oldData] = await database.query("select * from orderItem where id = ?", [id]);
        if(oldData.length==0){
            return res.status(403).send({message:"Order item not found❗"});
        }
        let [data] = await database.query("delete from orderItem where id = ?", [id]);
        let check = data.affectedRows;
        if(check>0){
            res.status(200).send({"Deleted order item":oldData});
        }
    } catch (error) {
        console.log({error});
    }

}


export {findAll, findOne, create, update, remove};