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
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru,
            product.price as Narxi,
            orderItem.count as Soni,
            orderItem.total as JamiNarx,
            product.discount as Chegirma,
            product.oldPrice as Eski_Narxi, 
            product.available as Mavjudigi,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.image as Rasmi,
            country.name_uz as Made_in_Uz,
            country.name_ru as Made_in_Ru,
            brands.name_uz as Brand_uz,
            brands.name_ru as Brand_ru
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
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru,
            product.price as Narxi,
            orderItem.count as Soni,
            orderItem.total as JamiNarx,
            product.discount as Chegirma,
            product.oldPrice as Eski_Narxi, 
            product.available as Mavjudigi,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.image as Rasmi,
            country.name_uz as Made_in_Uz,
            country.name_ru as Made_in_Ru,
            brands.name_uz as Brand_uz,
            brands.name_ru as Brand_ru
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
        let {product_id, order_id, count} = value;
        let [narxi] = await database.query("select product.price from orderItem inner join product on product.id = orderItem.product_id");
        let totalPrice = narxi[0].price * count;
        let [o] = await database.query("select * from orders where id = ?", [order_id]);
        let [p] = await database.query("select * from product where id = ?", [product_id]);
        if(o.length==0||p.length==0){
            return res.status(403).send({message:"Siz kiritgan order_id yoki product_id mavjud emas❗"});
        }
        let a = await database.query("insert into orderItem (product_id, order_id, count, total) values (?,?,?,?)", [product_id, order_id, count, totalPrice]);
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

async function findByExpensivePrice(req, res) {
    try {
        let [data] = await database.query(`
            select 
                orderItem.id as id,
                users.fullname as username,
                users.password as password,
                users.role as role,
                users.phone as phone, 
                product.name_uz as product_uz,
                product.name_ru as product_ru,
                product.description_uz as tavsifi_uz,
                product.description_ru as tavsifi_ru,
                product.price as narxi,
                orderItem.count as soni,
                orderItem.total as jami_narx,
                product.discount as chegirma,
                product.oldPrice as eski_narxi, 
                product.available as mavjudligi,
                product.washable as yuvilishi,
                product.size as hajmi,
                product.image as rasmi,
                country.name_uz as made_in_uz,
                country.name_ru as made_in_ru,
                brands.name_uz as brand_uz,
                brands.name_ru as brand_ru
            from orderItem
            inner join orders on orderItem.order_id = orders.id
            inner join users on orders.user_id = users.id
            inner join product on orderItem.product_id = product.id
            inner join country on product.country_id = country.id
            inner join brands on product.brand_id = brands.id
            order by product.price desc
        `);

        if (data.length == 0) {
            return res.status(404).send({ message: "orderItem jadvali bo'sh 😞" });
        }

        res.status(200).send({ data });

    } catch (error) {
        console.log({ error });
        res.status(500).send({ error });
    }
}

async function findByCheapPrice(req, res) {
    try {
        let [data] = await database.query(`
            select 
                orderItem.id as id,
                users.fullname as username,
                users.password as password,
                users.role as role,
                users.phone as phone, 
                product.name_uz as product_uz,
                product.name_ru as product_ru,
                product.description_uz as tavsifi_uz,
                product.description_ru as tavsifi_ru,
                product.price as narxi,
                orderItem.count as soni,
                orderItem.total as jami_narx,
                product.discount as chegirma,
                product.oldPrice as eski_narxi, 
                product.available as mavjudligi,
                product.washable as yuvilishi,
                product.size as hajmi,
                product.image as rasmi,
                country.name_uz as made_in_uz,
                country.name_ru as made_in_ru,
                brands.name_uz as brand_uz,
                brands.name_ru as brand_ru
            from orderItem
            inner join orders on orderItem.order_id = orders.id
            inner join users on orders.user_id = users.id
            inner join product on orderItem.product_id = product.id
            inner join country on product.country_id = country.id
            inner join brands on product.brand_id = brands.id
            order by product.price asc
        `);

        if (data.length == 0) {
            return res.status(404).send({ message: "orderItem jadvali bo‘sh 😞" });
        }

        res.status(200).send({ data });

    } catch (error) {
        console.log({ error });
        res.status(500).send({ error });
    }
}





export {findAll, findOne, create, update, remove, findByExpensivePrice, findByCheapPrice};