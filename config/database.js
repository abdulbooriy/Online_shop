import mysql from 'mysql2/promise.js';

const database = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Online_shop',
});

export default database;