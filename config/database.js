import mysql from "mysql2/promise";

const database = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'qosim1207',
    database: 'Online_shop',
});

export default database;
