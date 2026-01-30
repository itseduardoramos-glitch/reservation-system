//This file connects the database to this api.
require('dotenv').config();
const mysql = require('mysql2/promise');

//Setting values from .env file
const pool = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   port: process.env.DB_PORT,
   connectionLimit: 10
});

module.exports = pool;