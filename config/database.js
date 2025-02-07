import mysql from "mysql2/promise";

const database = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'Online_shop',
});

export default database;