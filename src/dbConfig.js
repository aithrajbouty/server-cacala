require("dotenv").config()

const { Pool } = require('pg');

const pool = new Pool({
   connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
   ssl: {
      rejectUnauthorized: false
    }
}); 
pool.connect();

module.exports = { pool }

// const Pool = require("pg").Pool

// const pool = new Pool({
//    user: "postgres",
//    password: "dnjs",
//    host: "localhost",
//    port: 5432,
//    database: "db_cacala"
// })

// module.exports = pool