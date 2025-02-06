CREATE DATABASE IF NOT EXISTS Online_shop

USE Online_shop


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(250) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM ('admin', 'user')
)

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users (id)

)


CREATE TABLE orderItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product (id),
    order_id INT,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    count INT NOT NULL,
    total INT NOT NULL
)

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_ru VARCHAR(250) NOT NULL,
    name_uz VARCHAR(250) NOT NULL,
    image VARCHAR(250)
)

CREATE TABLE brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_uz VARCHAR(250) NOT NULL,
    name_ru VARCHAR(250) NOT NULL,
    image VARCHAR(255)
)

CREATE TABLE country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_uz VARCHAR(250) NOT NULL,
    name_ru VARCHAR(250) NOT NULL
)

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_ru VARCHAR(250) NOT NULL,
    name_uz VARCHAR(250) NOT NULL,
    brand_id INT,
    FOREIGN KEY (brand_id) REFERENCES brands (id),
    country_id INT,
    FOREIGN KEY (country_id) REFERENCES country (id),
    price INT,
    oldPrice INT,
    available BOOLEAN,
    description_uz VARCHAR(250) NOT NULL,
    description_ru VARCHAR(250) NOT NULL,
    washable BOOLEAN,
    size VARCHAR(250) NOT NULL,
    image VARCHAR(250) NOT NULL,
    discount INT not null,

)

CREATE TABLE categoryItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category (id),
    product_id INT,
    FOREIGN KEY (product_id) REFERENCES product (id)
)