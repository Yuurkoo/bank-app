const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware для CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE',
  )
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization',
  )
  next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// LiveReload для розробки
if (process.env.NODE_ENV === 'development') {
  const livereload = require('livereload')
  const connectLiveReload = require('connect-livereload')

  const liveReloadServer = livereload.createServer()
  liveReloadServer.watch(path.join(__dirname, 'public'))
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/')
    }, 100)
  })
  app.use(connectLiveReload())
}

// Імпортуємо маршрути
const route = require('./src/route/index.js')
app.use('/', route)

// Обробка 404 помилки
app.use((req, res, next) => {
  next(createError(404))
})

// Обробка помилок
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error =
    req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500).json({ error: err.message })
})

module.exports = app // Експортуємо для використання в index.js
