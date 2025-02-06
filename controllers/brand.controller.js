import database from '../config/database.js';
import brandValidation from '../validations/brands.validation.js';
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

async function findAll(req, res) {
    try {
        let [result] = await database.query('select * from brands');
        res.status(200).send({data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        let { filename } = req.file;
        let { name_uz, name_ru } = req.body;
        const { error } = brandValidation({name_uz, name_ru, image: filename});
        if(req.file && error) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                }
            }) 
            res.status(403).send({message: error.details[0].message});
            return;
        }
        let [created] = await database.query('insert into brands (name_uz, name_ru, image) values (?, ?, ?)', [name_uz, name_ru, filename]);
        let [findBrand] = await database.query('select * from brands where id = ?', [created.insertId]);
        res.status(200).send({message: 'Brands created', data: findBrand});
    } catch (error) {
        if(req.file) {
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(er.message);
                }
            }) 
        }
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        let { id } = req.params;
        let [findOne_brand] = await database.query('select * from brands where id = ?', [id]);
        if(findOne_brand.length == 0) {
            return res.status(404).send({message: 'Brand id not found ❗'});
        }
        res.status(200).send({data: findOne_brand});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        let { id } = req.params;
        let { filename } = req.file;
        let { name_uz, name_ru } = req.body;
        const { error } = brandValidation({name_uz, name_ru, image: filename});
        if(req.file && error){
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
                }
            }) 
            res.status(403).send({message: error.details[0].message});
            return;
        }
        let keys = Object.keys(req.body);
        let values = Object.values(req.body);
        let queryKey = keys.map((k) => k += ' = ?');

        let [updated] = await database.query(`update brands set ${queryKey.join(', ')} where id = ?`, [...values, id]);
        if(updated.affectedRows == 0) {
            return res.status(404).send({message: 'Brand id not found ❗'});
        }
        res.status(200).send({message: 'Brand updated'});
    } catch (error) {
        if(req.file){
            fs.unlink(req.file.path, (e) => {
                if(e) {
                    console.log(e.message);
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
        let [findBrand] = await database.query('select image from brands where id = ?', [id]);
        
        if(findBrand.affectedRows == 0) {
            return res.status(404).send({message: 'Brand id not found ❗'});
        }

        let imagePath = path.join(__dirname, '../uploads', findBrand[0].image);

        let [deleted] = await database.query('delete from brands where id = ?', [id]);
        if(deleted.affectedRows == 0) {
            return res.status(404).send({message: 'Brand id not found ❗'});
        }
        fs.unlink(imagePath, (e) => {
            if(e) {
                console.log(e.message);
            } else {
                console.log('image deleted');
            }
        })
        res.status(200).send({message: 'Brand deleted'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove };