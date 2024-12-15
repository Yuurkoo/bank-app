// Підключаємо роутер до бек-енду
// const express = require('express')
// const router = express.Router()

// Підключіть файли роутів
// const test = require('./test')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
// router.use('/', test)
// Використовуйте інші файли роутів, якщо є

// router.get('/', (req, res) => {
//   res.status(200).json('Hello World')
// })

// Експортуємо глобальний роутер
// module.exports = router

const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config() // Завантаження змінних з .env

const router = express.Router() // Основний роутер
const app = express() // Створення екземпляру Express

app.use(express.json())
app.use(cors())

// Налаштування підключення до бази даних
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
})

// Перевірка підключення до бази даних
db.connect((err) => {
  if (err) {
    console.error(
      'Database connection error:',
      err.message || err,
    )
    process.exit(1) // Завершити процес, якщо підключення не вдалося
  } else {
    console.log('Connected to the database')
  }
})

// Генерація коду для відновлення
let recoveryCodes = {}
function generateCode() {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  const length = 8
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length),
    )
  }
  return result
}

// Роут: Реєстрація користувача
router.post('/signup', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({
      error: 'Invalid input',
      details: 'Email or password is missing',
    })
  }

  const SQL =
    'INSERT INTO users (email, password) VALUES (?, ?)'
  db.query(SQL, [email, password], (err, result) => {
    if (err) {
      console.error(
        'Error inserting user:',
        err.sqlMessage || err,
      )
      return res.status(500).send({
        error: 'Database insertion error',
        details: err.sqlMessage || err,
      })
    }
    console.log('User added successfully:', email)
    res
      .status(200)
      .send({ message: 'User added successfully' })
  })
})

// Роут: Логін користувача
router.post('/signin', (req, res) => {
  const { LoginEmail, LoginPassword } = req.body

  const SQL =
    'SELECT * FROM users WHERE email = ? AND password = ?'
  db.query(
    SQL,
    [LoginEmail, LoginPassword],
    (err, result) => {
      if (err) {
        console.error('Error during login:', err)
        return res
          .status(500)
          .send({ error: 'Database query error' })
      } else if (result.length > 0) {
        res
          .status(200)
          .send({
            message: 'Login successful',
            user: result[0],
          })
      } else {
        res
          .status(401)
          .send({ error: 'Invalid credentials' })
      }
    },
  )
})

// Роут: Відновлення пароля - генерація коду
router.post('/recovery', (req, res) => {
  const { email } = req.body

  const SQL = 'SELECT * FROM users WHERE email = ?'
  db.query(SQL, [email], (err, result) => {
    if (err) {
      console.error('Error checking email:', err)
      return res
        .status(500)
        .json({ error: 'Database query error' })
    }

    if (result.length > 0) {
      const recoveryCode = generateCode()
      recoveryCodes[email] = recoveryCode

      console.log('Generated recovery code:', recoveryCode)
      return res
        .status(200)
        .json({ exists: true, code: recoveryCode })
    }

    return res.status(404).json({ exists: false })
  })
})

// Роут: Підтвердження коду відновлення та оновлення пароля
router.post('/recovery-confirm', (req, res) => {
  const { email, code, newPassword } = req.body

  if (
    !recoveryCodes[email] ||
    recoveryCodes[email] !== code
  ) {
    return res
      .status(400)
      .send({ error: 'Invalid recovery code' })
  }

  const SQL =
    'UPDATE users SET password = ? WHERE email = ?'
  db.query(SQL, [newPassword, email], (err, result) => {
    if (err) {
      console.error('Error updating password:', err)
      return res
        .status(500)
        .send({ error: 'Database update error' })
    }

    delete recoveryCodes[email]
    res
      .status(200)
      .send({ message: 'Password updated successfully' })
  })
})

// Роут: Зміна email або пароля
router.post('/settings', (req, res) => {
  const { email, newEmail, newPassword } = req.body

  if (!email || (!newEmail && !newPassword)) {
    return res.status(400).send({ error: 'Invalid input' })
  }

  let SQL = ''
  let values = []

  if (newEmail) {
    SQL = 'UPDATE users SET email = ? WHERE email = ?'
    values = [newEmail, email]
  } else if (newPassword) {
    SQL = 'UPDATE users SET password = ? WHERE email = ?'
    values = [newPassword, email]
  }

  db.query(SQL, values, (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ error: 'Database update error' })
    }
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'Update successful' })
    } else {
      res.status(404).send({ error: 'User not found' })
    }
  })
})

// Експортуємо маршрути
module.exports = router
