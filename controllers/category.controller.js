import database from '../config/database.js';
import categoryValidation from '../validations/category.validation.js';
import fs from 'fs';

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
        const { error, _ } = categoryValidation(req.body);
        if(error) {
            fs.unlink(req.file.path, (error) => {
                if(error) {
                    console.log(error.message);
                } else {
                    console.log('image deleted');
                }
            })
            return res.status(403).send({message: error.details[0].message});
        }
        await database.query('insert into category (name_ru, name_uz, image) values (?, ?, ?)', [name_ru, name_uz, filename]);
        res.status(200).send({message: 'Category created'});
    } catch (error) {
        if(error) {
            fs.unlink(req.file.path, (error) => {
                if(error) {
                    console.log(error.message);
                } else {
                    console.log('image deleted');
                }
            })
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
        let { id } = req.params;
        const { error, _ } = categoryValidation(req.body);
        if(error){
            fs.unlink(req.file.path, (error) => {
                if(error) {
                    console.log(error.message);
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
        fs.unlink(req.file.path, (error) => {
            if(error) {
                console.log(error.message);
            } else {
                console.log('image deleted');
            }
        }) 
        res.status(500).send({error_message: error.message});
    }
}

async function remove(req, res) {
    try {
        let { id } = req.params;
        let [result] = await database.query('delete from category where id = ?', [id]);
        if(result.affectedRows == 0) {
            return res.status(404).send({message: 'Category id not found ❗'});   
        }
        res.status(200).send({message: 'Category deleted'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove };