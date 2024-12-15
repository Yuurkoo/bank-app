const app = require('./app.js')
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.SERVER_PORT || 3002

// Запуск сервера
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`,
  )
})
