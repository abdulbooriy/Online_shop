import database from '../config/database.js';
import countryValidation from '../validations/country.validation.js';

async function findAll(req, res) {
    try {
        const [countries] = await database.query('select * from country');
        res.status(200).send({data: countries});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function create(req, res) {
    try {
        const { name_uz, name_ru } = req.body;
        const { error, _ } = countryValidation({name_uz, name_ru});
        if(error) {
            return res.status(403).send({message: error.details[0].message});
        }
        const [countries] = await database.query('insert into country (name_uz, name_ru) values (?, ?)', [name_uz, name_ru]);
        const [result] = await database.query('select * from country where id = ?', [countries.insertId]);
        res.status(200).send({message: 'Country created', data: result});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function findOne(req, res) {
    try {
        let { id } = req.params;
        let [find_country] = await database.query('select * from country where id = ?', [id]);
        if(!find_country.length) {
            return res.status(404).send({message: 'Country id not found ❗'});
        }
        res.status(200).send({data: find_country});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function update(req, res) {
    try {
        let { id } = req.params;
        const { name_uz, name_ru } = req.body;
        const { error, _ } = countryValidation({name_uz, name_ru});
        if(error) {
            return res.status(403).send({message: error.details[0].message});
        }
        let [updated] = await database.query('update country set name_uz = ?, name_ru = ? where id = ?', [name_uz, name_ru, id]);
        if(!updated.affectedRows) {
            return res.status(404).send({message: 'Country id not found ❗'});
        }
        res.status(200).send({message: 'Country updated'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function remove(req, res) {
    try {
        let { id } = req.params;
        let [deleted_country] = await database.query('delete from country where id = ?', [id]);
        if(!deleted_country.affectedRows) {
            return res.status(404).send({message: 'Country id not found ❗'});
        }
        res.status(200).send({message: 'Country deleted'});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function getByCountryName_uz(req, res) {
    try { 
        let { name_uz } = req.query;
        let [findCountries] = await database.query(`select * from country order by name_uz ${name_uz}`);
        res.status(200).send({data: findCountries});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function getByCountryName_ru(req, res) {
    try {
        let { name_ru } = req.query;
        let [findCountries] = await database.query(`select * from country order by name_ru ${name_ru}`);
        res.status(200).send({data: findCountries});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function countriesWithLimit (req, res) {
    try {
        let { limit } = req.query;
        let [countries] = await database.query(`SELCT * FROM country LIMIT ${limit}`);
        res.status(200).send({data: countries});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

async function countriesWithPagination (req, res) {
    try {
        let { page, limit } = req.query;

        page = parseInt(page, 10) || 1;
        limit = parseInt(limit, 10) || 10;
        let offset = (page - 1) * limit;

        let [country] = await database.query(`SELECT * FROM country LIMIT ${limit} OFFSET ${offset}`);
        res.status(200).send({data: country});
    } catch (error) {
        res.status(500).send({error_message: error.message});
    }
}

export { findAll, create, findOne, update, remove, getByCountryName_uz, getByCountryName_ru, countriesWithLimit, countriesWithPagination };