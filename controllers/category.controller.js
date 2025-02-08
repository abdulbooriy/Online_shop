import database from '../config/database.js';
import categoryValidation from '../validations/category.validation.js';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

async function findAll(req, res) {
    try {
        const [result] = await database.query('select * from category');
        res.status(200).send({data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        const { filename } = req.file;
        const { name_ru, name_uz} = req.body;
        const { error, _ } = categoryValidation({name_ru, name_uz, image: filename});
        if(req.file && error) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                } else {
                    console.log('image deleted');
                }
            })
            res.status(403).send({message: error.details[0].message});
            return;
        }
        let [categories] = await database.query('insert into category (name_ru, name_uz, image) values (?, ?, ?)', [name_ru, name_uz, filename]);
        
        let [result] = await database.query('select * from category where id = ?', [categories.insertId]);
        res.status(200).send({message: 'Category created', data: result});
    } catch (error) {
        if(req.file) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                } else {
                    console.log('image deleted');
                }
            });
        }
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        const { id } = req.params;
        const [result] = await database.query('select * from category where id = ?', [id]);
        if(result.length == 0) {
            return res.status(404).send({message: 'Category id not found ❗'});
        }
        res.status(200).send({data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        let { filename } = req.file;
        let { id } = req.params;
        let { name_ru, name_uz } = req.body;
        const { error } = categoryValidation({name_ru, name_uz, image: filename});
        if(req.file && error){
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                } else {
                    console.log('image deleted');
                }
            }) 
            res.status(403).send({message: error.details[0].message});
            return;
        }
        let keys = Object.keys(req.body);
        let values = Object.values(req.body);
        let queryKey = keys.map((k) => k += ' = ?');

        let [result] = await database.query(`update category set ${queryKey.join(', ')} where id = ?`, [...values, id]);
        if(result.affectedRows == 0) {
            return res.status(403).send({message: 'Category id not found ❗'});
        }
        res.status(200).send({message: 'Category updated'});
    } catch (error) {
        if(req.file) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                } else {
                    console.log('image deleted');
                }
            }) 
        }
        res.status(500).send({error_message: error.message});
    }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function remove(req, res) {
    try {
        let { id } = req.params;

        let [findCategory] = await database.query('select image from category where id = ?', [id]);
        
        if(findCategory.affectedRows == 0) {
            return res.status(404).send({message: 'Category id not found ❗'});
        }

        let imagePath = path.join(__dirname, '../uploads', findCategory[0].image);

        let [result] = await database.query('delete from category where id = ?', [id]);

        if(result.affectedRows == 0) {
            return res.status(404).send({message: 'Category id not found ❗'});   
        }
        fs.unlink(imagePath, (e) => {
            if(e) {
                console.log(e.message);
            } else {
                console.log('image deleted');
            }
        })
        res.status(200).send({message: 'Category deleted'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function categoryWithPagination(req, res) {
    try {
        let { page, limit } = req.query;
        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 10;

        let offset = (page - 1) * limit;

        let [categories] = await database.query(`SELECT * FROM category LIMIT ${limit} OFFSET ${offset}`);
        res.status(200).send({data: categories});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function getBycategoryName_ru (req, res) {
    try {
        let {name_ru} = req.query;
        let [categories] = await database.query(`SELECT * FROM category ORDER BY name_ru ${name_ru}`);
        res.status(200).send({data: categories});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function getBycategoryName_uz (req, res) {
    try {
        let {name_uz} = req.query;
        let [categories] = await database.query(`SELECT * FROM category ORDER BY name_uz ${name_uz}`);
        res.status(200).send({data: categories});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove, categoryWithPagination, getBycategoryName_ru, getBycategoryName_uz };