import database from "../config/database.js";
import categoryItemValidation from '../validations/categoryItem.validation.js';

async function findAll(req, res) {
    try {
        let [result] = await database.query('SELECT ct.id, JSON_ARRAYAGG(JSON_OBJECT("id", c.id, "name_ru", c.name_ru, "name_uz", c.name_uz, "image", c.image)) as categories, JSON_ARRAYAGG(JSON_OBJECT("id", p.id, "name_ru", p.name_ru, "name_uz", p.name_uz, "brand_id", p.brand_id, "country_id", p.country_id, "price", p.price, "oldPrice", p.OldPrice, "available", p.available, "description_uz", p.description_uz, "description_ru", p.description_ru, "washable", p.washable, "size", p.size)) as products, JSON_ARRAYAGG(JSON_OBJECT("id", b.id, "name_uz", b.name_uz, "name_ru", b.name_ru, "image", b.image)) as brands, JSON_ARRAYAGG(JSON_OBJECT("id", cr.id, "name_uz", cr.name_uz, "name_ru", cr.name_ru)) as countries FROM categoryItem ct LEFT JOIN category c ON ct.category_id = c.id LEFT JOIN product p ON ct.product_id = p.id LEFT JOIN brands b ON p.brand_id = b.id LEFT JOIN country cr ON ct.id = cr.id GROUP BY ct.id');
        res.status(200).send({data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message})
    }
} 

async function create(req, res) {
    try {
        const { category_id, product_id } = req.body;
        const { error } = categoryItemValidation({category_id, product_id});
        if(error) {
            return res.status(400).send({message: error.details[0].message});
        }
        let [createCategoryItem] = await database.query('insert into categoryItem (category_id, product_id) values (?, ?)', [category_id, product_id]);
        let [result] = await database.query('select * from categoryItem where id = ?', [createCategoryItem.insertId]);
        res.status(200).send({message: 'CategoryItem created', data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message})
    }
} 

async function findOne(req, res) {
    try {
      let { id } = req.params;
      let [result] = await database.query('SELECT ct.id, JSON_ARRAYAGG(JSON_OBJECT("id", c.id, "name_ru", c.name_ru, "name_uz", c.name_uz, "image", c.image)) as categories, JSON_ARRAYAGG(JSON_OBJECT("id", p.id, "name_ru", p.name_ru, "name_uz", p.name_uz, "brand_id", p.brand_id, "country_id", p.country_id, "price", p.price, "oldPrice", p.OldPrice, "available", p.available, "description_uz", p.description_uz, "description_ru", p.description_ru, "washable", p.washable, "size", p.size)) as products, JSON_ARRAYAGG(JSON_OBJECT("id", b.id, "name_uz", b.name_uz, "name_ru", b.name_ru, "image", b.image)) as brands, JSON_ARRAYAGG(JSON_OBJECT("id", cr.id, "name_uz", cr.name_uz, "name_ru", cr.name_ru)) as countries FROM categoryItem ct LEFT JOIN category c ON ct.category_id = c.id LEFT JOIN product p ON ct.product_id = p.id LEFT JOIN brands b ON p.brand_id = b.id LEFT JOIN country cr ON ct.id = cr.id where ct.id = ? GROUP BY ct.id', [id]);
      if(result.length == 0) {
        return res.status(400).send({message: 'CategoryItem id not found ❗'});
      }
      res.status(200).send({data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message})
    }
} 

async function update(req, res) {
    try {
        let { id } = req.params;
        const { error } = categoryItemValidation(req.body);
        if(error){
            return res.status(403).send({message: error.details[0].message});
        }
        let keys = Object.keys(req.body);
        let values = Object.values(req.body);
        let queryKey = keys.map((k) => k += ' = ?');

        let [result] = await database.query(`update categoryItem set ${queryKey.join(', ')} where id = ?`, [...values, id]);
        if(result.affectedRows == 0) {
            return res.status(403).send({message: 'CategoryItem id not found ❗'});
        }
        res.status(200).send({message: 'CategoryItem updated'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
} 

async function remove(req, res) {
    try {
      let { id } = req.params;
      let [result] = await database.query('delete from categoryItem where id = ?', [id]);
      if(result.affectedRows == 0) {
        return res.status(404).send({message: 'CategoryItem id not found ❗'});
      }
      res.status(200).send({message: 'CategoryItem deleted'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function categoryItemWithPagination(req, res) {
    try {
        let { page, limit } = req.query;
        page = parseInt(page, 10) || 1,
        limit = parseInt(limit, 10) || 10;

        let offset = (page - 1) * limit;

        let [categoryItems] = await database.query(`SELECT * FROM categoryItem LIMIT ${limit} OFFSET ${offset}`);
        res.status(200).send({data: categoryItems});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove, categoryItemWithPagination };