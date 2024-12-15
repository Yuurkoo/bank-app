const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const routes = require('./src/route/index.js')

dotenv.config()

const app = express()
const PORT = process.env.SERVER_PORT || 3002

app.use(express.json())
app.use(cors())

// Підключення роутера
app.use('/', routes)

// Запуск сервера
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`,
  )
})
