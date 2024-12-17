const express = require('express')
const cors = require('cors')
const routes = require('./src/route/index')

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }),
)

app.use(express.json()) // Дозволяє обробляти JSON запити

// Використовуємо маршрути
app.use('/', routes)

module.exports = app
