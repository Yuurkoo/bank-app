const app = require('./app')
const connectDB = require('./db')
require('dotenv').config()

const PORT = process.env.PORT || 3002

// Підключення до MongoDB
connectDB()

// Запуск серверу
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`,
  )
})
