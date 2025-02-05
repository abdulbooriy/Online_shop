import mysql2 from "mysql2/promise"

let db = await mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"qosim1207",
    database:"online_shop"

})

export default db