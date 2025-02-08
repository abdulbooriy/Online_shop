import productValidation from "../validations/product.validation.js";
import database from "../config/database.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

async function findAll(req, res) {
  try {
    let [products] = await database.query("select * from product");
    if (products.length == 0) {
      return res.status(404).send({ error: "No products found." });
    }
    res.status(200).send({ data: products });
  } catch (error) {
    res.status(500).send({ error_message: error.message });
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

      let categories = req.body.categories ? JSON.parse(req.body.categories) : [];
      
      let { name_ru, name_uz, brand_id, country_id, oldPrice, available, description_uz, description_ru, washable, size, discount } = req.body;

      let { error } = productValidation({
          name_ru, name_uz, brand_id, country_id, oldPrice, available,
          description_uz, description_ru, washable, size, discount, categories, image: filename
      });

      if (req.file && error) {
          fs.unlink(req.file.path, (e) => {
              if (e) console.log(e.message);
          });
          res.status(403).send({ message: error.details[0].message });
          return;
      }

      let price = oldPrice - oldPrice * (discount / 100);

      let [c] = await database.query("SELECT * FROM country WHERE id = ?", [country_id]);
      let [b] = await database.query("SELECT * FROM brands WHERE id = ?", [brand_id]);

      if (c.length === 0 || b.length === 0) {
          return res.status(403).send({ error: "country_id or brand_id not available in table." });
      }

      let [productData] = await database.query(
          "INSERT INTO product (name_ru, name_uz, brand_id, country_id, price, oldPrice, available, description_uz, description_ru, washable, size, image, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [name_ru, name_uz, brand_id, country_id, price, oldPrice, available, description_uz, description_ru, washable, size, filename, discount]
      );

      let productID = productData.insertId;
      let newCategories = [];

      for (let category of categories) {
          let [existingCategory] = await database.query("SELECT * FROM category WHERE name_uz = ? OR name_ru = ?", [category.name_uz, category.name_ru]);

          let categoryID;
          if (existingCategory.length > 0) {
              categoryID = existingCategory[0].id;
          } else {
              let [createdCategory] = await database.query(
                  "INSERT INTO category (name_uz, name_ru, image) VALUES (?, ?, ?)",
                  [category.name_uz, category.name_ru, category.image || ""]
              );
              categoryID = createdCategory.insertId;
          }

          await database.query(
              "INSERT INTO product_category (product_id, category_id) VALUES (?, ?)",
              [productID, categoryID]
          );

          let [finalCategory] = await database.query("SELECT * FROM category WHERE id = ?", [categoryID]);
          newCategories.push(finalCategory[0]);
      }

      res.status(200).send({
          message: "Product and Category created successfully",
          product: {
              product_id: productID,
              name_uz,
              name_ru,
              image: filename
          },
          categories: newCategories
      });

  } catch (error) {
      if (req.file) {
          fs.unlink(req.file.path, (e) => {
              if (e) console.log(e.message);
          });
      }
      res.status(500).send({ error_message: error.message });
  }
}

async function update(req, res) {
  try {
    let { filename } = req.file;
    let { value, error } = productValidation(req.body);
    if (req.file && error) {
      fs.unlink(req.file.path, (e) => {
        if (e) {
          console.log(e.message);
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
    let price = oldPrice - oldPrice * (discount / 100);
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
    if (req.file) {
      fs.unlink(req.file.path, (e) => {
        if (e) {
          return res.status(403).send({ message: e.message });
        }
      });
    }
    res.status(500).send({ message: error.message });
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function remove(req, res) {
  try {
    let { id } = req.params;

    let [findProducts] = await database.query(
      "select image from product where id = ?",
      [id]
    );

    if (findProducts.affectedRows == 0) {
      return res.status(404).send({ message: "Product id not found ❗" });
    }

    let imagePath = path.join(__dirname, "../uploads", findProducts[0].image);

    let [oldData] = await database.query("select * from product where id = ?", [
      id,
    ]);
    if (oldData.length == 0) {
      return res.status(403).send({ message: "Product not found." });
    }
    let [data] = await database.query("delete from product where id = ?", [id]);
    let check = data.affectedRows;
    if (check > 0) {
      fs.unlink(imagePath, (e) => {
        if (e) {
          console.log(e.message);
        } else {
          console.log("image deleted");
        }
      });
      res.status(200).send({ "Deleted product": oldData });
    }
  } catch (error) {
    res.status(500).send({ error_message: error.message });
  }
}

async function searchByNameRus(req, res) {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).send({ error: "Product name is required." });
    }

    let [data] = await database.query(
      `
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
      where lower(product.name_ru) like lower(?)`,
      [`%${name}%`]
    );
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

    let [data] = await database.query(
      `
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
      where lower(product.name_uz) like lower(?)`,
      [`%${name}%`]
    );
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

    let [data] = await database.query(
      `
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
            where lower(country.name_uz) like lower(?)`,
      [`%${country}%`]
    );
    if (data.length == 0) {
      return res
        .status(404)
        .send({ error: "Bunday mamlakatda ishlangan product topilmadi." });
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

    let [data] = await database.query(
      `
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
            where lower(country.name_ru) like lower(?)`,
      [`%${country}%`]
    );
    if (data.length == 0) {
      return res
        .status(404)
        .send({ error: "Bunday mamlakatda ishlangan product topilmadi." });
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

    let [data] = await database.query(
      `
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
            where lower(brands.name_ru) like lower(?)`,
      [`%${brand}%`]
    );
    if (data.length == 0) {
      return res
        .status(404)
        .send({ error: "Bunday brandga tegishli product topilmadi." });
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

    let [data] = await database.query(
      `
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
            where lower(brands.name_uz) like lower(?)`,
      [`%${brand}%`]
    );
    if (data.length == 0) {
      return res
        .status(404)
        .send({ error: "Bunday brandga tegishli product topilmadi." });
    }
    res.status(200).send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
    console.log({ error });
  }
}

export {
  findAll,
  findOne,
  create,
  update,
  remove,
  searchByNameRus,
  searchByNameUzb,
  searchByCountryUzb,
  searchByCountryRus,
  searchByBrandRus,
  searchByBrandUzb,
};
