import productValidation from "../validations/product.validation.js";
import db from "../config/db.js"

async function findAll(req,res) {
    try {
        let [data] = await db.query("select * from product");
        if(data.length==0){
            return res.status(403).send({error:"No products found."});
        }
        res.status(200).send({products:data});
    } catch (error) {
        res.status(500).send({error});
        console.log({error});
    }
}

async function findOne(req,res) {
    try {
        let {id} = req.params;
        let [data] = await db.query(`select product.id as ID,
            product.name_uz as Product,
            product.available as Mavjudligi, 
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru,
            product.size as Hajmi, 
            brands.name_uz as Brand, 
            product.price as PriceSale,
            product.oldPrice as Price,
            product.washable as Yuvilishi,
            product.image as Rasmi,
            country.name_uz as Country 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
            where product.id = ?`, [id]);
        if(data.length==0){
            return res.status(403).send({message:"Product not found"});
        }
        res.status(200).send({product:data});
    } catch (error) {
        res.status(500).send({message:error});
        console.log({error});
    }
}

async function create(req,res) {
    try {
        let {value, error} = productValidation(req.body);
        if(error){
            return res.status(403).send({message:error.details[0].message});
        }
        let {name_ru,name_uz,brand_id,country_id,price,oldPrice,available, description_uz,description_ru,washable,size,image} = value;
        let [c] = await db.query("select * from country where id = ?", [country_id]);
        let [b] = await db.query("select * from brands where id = ?", [brand_id]);
        if(c.length==0||b.length==0){
            return res.status(403).send({error:"country_id or brand_id not available on table."});
        }   
        let a = await db.query("insert into product (name_ru,name_uz,brand_id,country_id,price,oldPrice,available, description_uz,description_ru,washable,size,image) values (?,?,?,?,?,?,?,?,?,?,?,?)", [name_ru,name_uz,brand_id,country_id,price,oldPrice,available, description_uz,description_ru,washable,size,image]);
        let newID = a[0].insertId;
        let [newData] = await db.query("select * from product where id = ?", [newID]);
        res.status(200).send({"Product created successfully":newData});
    } catch (error) {
        res.status(500).send({error});
        console.log({error}); 
    }
}

async function update(req,res) {
    try {
        let {value, error} = productValidation(req.body);
        if(error){
            return res.status(403).send({message:error.details[0].message});
        }
        let {name_ru,name_uz,brand_id,country_id,price,oldPrice,available, description_uz,description_ru,washable,size,image} = value;
        let [c] = await db.query("select * from country where id = ?", [country_id]);
        let [b] = await db.query("select * from brands where id = ?", [brand_id]);
        if(c.length==0||b.length==0){
            return res.status(403).send({error:"country_id or brand_id not available on table."});
        }
        let {id} = req.params;
        let [oldData] = await db.query("select * from product where id = ? ", [id]);
        if(oldData.length==0){
            return res.status(403).send({error:"Product not found."});
        }
        let [data] = await db.query("update product set name_ru = ?, name_uz = ?, brand_id = ?, country_id = ?, price = ?, oldPrice = ?, available = ?, description_uz = ?, description_ru = ?, washable = ?, size = ?, image = ? where id = ?", [name_ru,name_uz,brand_id,country_id,price,oldPrice,available, description_uz,description_ru,washable,size,image,id]);
        let check = data.affectedRows;
        if(check>0){
            let [updatedData] = await db.query("select * from product where id = ? ", [id]);
            res.status(200).send({"Product updated successfully":updatedData});
        }
    } catch (error) {
        res.status(500).send({error});
        console.log({error});
    }
}

async function remove(req,res) {
    try {
        let {id} = req.params;
        let [oldData] = await db.query("select * from product where id = ?", [id]);
        if(oldData.length==0){
            return res.status(403).send({message:"Product not found."});
        }
        let [data] = await db.query("delete from product where id = ?", [id]);
        let check = data.affectedRows;
        if(check>0){
            res.status(200).send({"Deleted product":oldData});
        }
    } catch (error) {
        console.log({error});
    }

}

cc
export {findAll, findOne, create, update, remove};