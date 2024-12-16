const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false }, // Для підключення до Render
})

pool.connect((err) => {
  if (err) {
    console.error(
      'Error connecting to PostgreSQL:',
      err.message,
    )
  } else {
    console.log('Connected to PostgreSQL database')
  }
})

module.exports = pool
