import mysql from "mysql2/promise.js";
import {configDotenv} from "dotenv";
configDotenv();

export default mysql.createPool({
    host: "127.0.0.1",
    user: process.env.USERDB,
    password: process.env.PASSWORD,
    database: process.env.DB,
    connectionLimit: 10
});