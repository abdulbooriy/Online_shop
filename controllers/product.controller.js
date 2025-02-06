import productValidation from "../validations/product.validation.js";
import database from "../config/database.js";
import fs from "fs";


async function findAll(req, res) {
  try {
    let [data] = await database.query("select * from product");
    if (data.length == 0) {
      return res.status(403).send({ error: "No products found." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function findOne(req, res) {
  try {
    let { id } = req.params;
    let [data] = await database.query(
      `select product.id as ID,
            product.name_uz as Product,
            product.available as Mavjudligi, 
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru,
            product.discount as Chegirma,
            product.size as Hajmi, 
            brands.name_uz as Brand, 
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.image as Rasmi,
            country.name_uz as Country 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
            where product.id = ?`,
      [id]
    );
    if (data.length == 0) {
      return res.status(403).send({ message: "Product not found" });
    }
    res.status(200).send({ product: data });
  } catch (error) {
    res.status(500).send({ message: error });
    console.log({ error });
  }
}

async function create(req, res) {
  try {
    let { filename } = req.file;
    let { value, error } = productValidation(req.body);
    if (error) {
      fs.unlink(req.file.path, (error) => {
        if(error){
          return res.status(403).send({ message: error });
        }
      });
      res.status(403).send({ message: error.details[0].message });
      return;
    }
    let {
      name_ru,
      name_uz,
      brand_id,
      country_id,
      oldPrice,
      available,
      description_uz,
      description_ru,
      washable,
      size,
      discount
    } = value;
    let price = oldPrice - (oldPrice * (discount/100));
    let [c] = await database.query("select * from country where id = ?", [
      country_id,
    ]);
    let [b] = await database.query("select * from brands where id = ?", [
      brand_id,
    ]);
    if (c.length == 0 || b.length == 0) {
      return res
        .status(403)
        .send({ error: "country_id or brand_id not available on table." });
    }
    let a = await database.query(
      "insert into product (name_ru, name_uz, brand_id, country_id, price, oldPrice, available, description_uz, description_ru, washable, size, image, discount) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        name_ru,
        name_uz,
        brand_id,
        country_id,
        price,
        oldPrice,
        available,
        description_uz,
        description_ru,
        washable,
        size,
        filename,
        discount
      ]
    );
    let newID = a[0].insertId;
    let [newData] = await database.query("select * from product where id = ?", [
      newID,
    ]);
    res.status(200).send({ "Product created successfully": newData });
  } catch (error) {
      fs.unlink(req.file.path, (error) => {
        if(error){
          return res.status(403).send({ message: error });
        }
      });
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function update(req, res) {
  try {
    let { filename } = req.file;
    let { value, error } = productValidation(req.body);
    if (error) {
        fs.unlink(req.file.path, (error) => {
          if(error){
            return res.status(403).send({ message: error });
          }
        });
       res.status(403).send({ message: error.details[0].message });
       return;
  } 
    let {
      name_ru,
      name_uz,
      brand_id,
      country_id,
      oldPrice,
      available,
      description_uz,
      description_ru,
      washable,
      size,
      discount,
    } = value;
    let price = oldPrice - (oldPrice * (discount/100));
    let [c] = await database.query("select * from country where id = ?", [
      country_id,
    ]);
    let [b] = await database.query("select * from brands where id = ?", [
      brand_id,
    ]);
    if (c.length == 0 || b.length == 0) {
      return res
        .status(403)
        .send({ error: "country_id or brand_id not available on table." });
    }
    let { id } = req.params;
    let [oldData] = await database.query(
      "select * from product where id = ? ",
      [id]
    );
    if (oldData.length == 0) {
      return res.status(403).send({ error: "Product not found." });
    }
    let [data] = await database.query(
      "update product set name_ru = ?, name_uz = ?, brand_id = ?, country_id = ?, price = ?, oldPrice = ?, available = ?, description_uz = ?, description_ru = ?, washable = ?, size = ?, image = ?, discount = ? where id = ?",
      [
        name_ru,
        name_uz,
        brand_id,
        country_id,
        price,
        oldPrice,
        available,
        description_uz,
        description_ru,
        washable,
        size,
        filename,
        discount,
        id,
      ]
    );
    let check = data.affectedRows;
    if (check > 0) {
      let [updatedData] = await database.query(
        "select * from product where id = ? ",
        [id]
      );
      res.status(200).send({ "Product updated successfully": updatedData });
    }
  } catch (error) {
    fs.unlink(req.file.path, (error) => {
      if(error){
        return res.status(403).send({ message: error });
      }
    });
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function remove(req, res) {
  try {
    let { id } = req.params;
    let [oldData] = await database.query("select * from product where id = ?", [
      id,
    ]);
    if (oldData.length == 0) {
      return res.status(403).send({ message: "Product not found." });
    }
    let [data] = await database.query("delete from product where id = ?", [id]);
    let check = data.affectedRows;
    if (check > 0) {
      res.status(200).send({ "Deleted product": oldData });
    }
  } catch (error) {
    console.log({ error });
  }
}

async function searchByNameRus(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).send({ error: "Product name is required." });
    }

    let [data] = await database.query(`
            select product.id as ID,
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru, 
            brands.name_uz as Brand_Uz, 
            brands.name_ru as Bran_Ru,
            product.discount as Chegirma,
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.available as Mavjudligi, 
            product.image as Rasmi,
            country.name_uz as Country_Uz,
            country.name_ru as Country_Ru 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
      where lower(product.name_ru) like lower(?)`, [`%${name}%`]);
    if (data.length == 0) {
      return res.status(404).send({ error: "Bunday product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function searchByNameUzb(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).send({ error: "Product name is required." });
    }

    let [data] = await database.query(`
            select product.id as ID,
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru, 
            brands.name_uz as Brand_Uz, 
            brands.name_ru as Bran_Ru,
            product.discount as Chegirma,
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.available as Mavjudligi, 
            product.image as Rasmi,
            country.name_uz as Country_Uz,
            country.name_ru as Country_Ru 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
      where lower(product.name_uz) like lower(?)`, [`%${name}%`]);
    if (data.length == 0) {
      return res.status(404).send({ error: "Bunday product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function searchByCountryUzb(req, res) {
  try {
    const { country } = req.query;
    if (!country) {
      return res.status(400).send({ error: "Product country is required." });
    }

    let [data] = await database.query(`
            select product.id as ID,
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru, 
            brands.name_uz as Brand_Uz, 
            brands.name_ru as Bran_Ru,
            product.discount as Chegirma,
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.available as Mavjudligi, 
            product.image as Rasmi,
            country.name_uz as Country_Uz,
            country.name_ru as Country_Ru 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
            where lower(country.name_uz) like lower(?)`, [`%${country}%`]);
    if (data.length == 0) {
      return res.status(404).send({ error: "Bunday mamlakatda ishlangan product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function searchByCountryRus(req, res) {
  try {
    const { country } = req.query;
    if (!country) {
      return res.status(400).send({ error: "Product country is required." });
    }

    let [data] = await database.query(`
            select product.id as ID,
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru, 
            brands.name_uz as Brand_Uz, 
            brands.name_ru as Bran_Ru,
            product.discount as Chegirma,
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.available as Mavjudligi, 
            product.image as Rasmi,
            country.name_uz as Country_Uz,
            country.name_ru as Country_Ru 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
            where lower(country.name_ru) like lower(?)`, [`%${country}%`]);
    if (data.length == 0) {
      return res.status(404).send({ error: "Bunday mamlakatda ishlangan product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function searchByBrandRus(req, res) {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).send({ error: "Product brand is required." });
    }

    let [data] = await database.query(`
            select product.id as ID,
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru, 
            brands.name_uz as Brand_Uz, 
            brands.name_ru as Bran_Ru,
            product.discount as Chegirma,
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.available as Mavjudligi, 
            product.image as Rasmi,
            country.name_uz as Country_Uz,
            country.name_ru as Country_Ru 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
            where lower(brands.name_ru) like lower(?)`, [`%${brand}%`]);
    if (data.length == 0) {
      return res.status(404).send({ error: "Bunday brandga tegishli product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

async function searchByBrandUzb(req, res) {
  try {
    const { brand } = req.query;
    if (!brand) {
      return res.status(400).send({ error: "Product brand is required." });
    }

    let [data] = await database.query(`
            select product.id as ID,
            product.name_uz as Product_Uz,
            product.name_ru as Product_Ru,
            product.description_uz as Tavsifi_Uz,
            product.description_ru as Tavsifi_Ru, 
            brands.name_uz as Brand_Uz, 
            brands.name_ru as Bran_Ru,
            product.discount as Chegirma,
            product.price as PriceSale,
            product.oldPrice as OldPrice,
            product.washable as Yuvilishi,
            product.size as Hajmi,
            product.available as Mavjudligi, 
            product.image as Rasmi,
            country.name_uz as Country_Uz,
            country.name_ru as Country_Ru 
            from product inner join country
            on product.country_id = country.id 
            inner join brands 
            on product.brand_id = brands.id
            where lower(brands.name_uz) like lower(?)`, [`%${brand}%`]);
    if (data.length == 0) {
      return res.status(404).send({ error: "Bunday brandga tegishli product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

export { findAll, findOne, create, update, remove, searchByNameRus,
        searchByNameUzb, searchByCountryUzb, searchByCountryRus,
        searchByBrandRus, searchByBrandUzb };
