const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create and export a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST , 
    port: process.env.DB_PORT ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
});

module.exports = db;
