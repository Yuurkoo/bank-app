// #!/usr/bin/env node

// /**
//  * Module dependencies.
//  */

// const app = require('./app')
// const debug = require('debug')(
//   'template-express-live-reload:server',
// )
// const http = require('http')

// /**
//  * Get port from environment and store in Express.
//  */

// const port = normalizePort(process.env.PORT || '4000')
// app.set('port', port)

// /**
//  * Create HTTP server.
//  */

// const server = http.createServer(app)

// /**
//  * Listen on provided port, on all network interfaces.
//  */

// server.listen(port)
// server.on('error', onError)
// server.on('listening', onListening)

// /**
//  * Normalize a port into a number, string, or false.
//  */

// function normalizePort(val) {
//   const port = parseInt(val, 10)

//   if (isNaN(port)) {
//     // named pipe
//     return val
//   }

//   if (port >= 0) {
//     // port number
//     return port
//   }

//   return false
// }

// /**
//  * Event listener for HTTP server "error" event.
//  */

// function onError(error) {
//   if (error.syscall !== 'listen') {
//     throw error
//   }

//   const bind =
//     typeof port === 'string'
//       ? 'Pipe ' + port
//       : 'Port ' + port

//   // handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.log(bind + ' requires elevated privileges')
//       process.exit(1)
//       break
//     case 'EADDRINUSE':
//       console.log(bind + ' is already in use')
//       process.exit(1)
//       break
//     default:
//       throw error
//   }
// }

// /**
//  * Event listener for HTTP server "listening" event.
//  */

// function onListening() {
//   const addr = server.address()
//   const bind =
//     typeof addr === 'string'
//       ? 'pipe ' + addr
//       : 'port ' + addr.port
//   debug('Listening on ' + bind)
//   console.log(
//     'Listening on ' + 'http://localhost:' + addr.port,
//   )
// }

const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

// Налаштування підключення до бази даних
const db = mysql.createConnection({
  user: 'root',
  host: '127.0.0.1',
  password: '',
  database: 'bankapp',
  port: 3305,
})

// Перевірка підключення до бази даних
db.connect((err) => {
  if (err) {
    console.error(
      'Database connection error:',
      err.message || err,
    )
  } else {
    console.log('Connected to the database')
  }
})

// Реєстрація нового користувача
app.post('/signup', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).send({
      error: 'Invalid input',
      details: 'Email or password is missing',
    })
  }

  const SQL =
    'INSERT INTO users (email, password) VALUES (?, ?)'
  const values = [email, password]

  db.query(SQL, values, (err, result) => {
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

// Логін користувача
app.post('/signin', (req, res) => {
  const { LoginEmail, LoginPassword } = req.body

  const SQL =
    'SELECT * FROM users WHERE email = ? AND password = ?'
  const values = [LoginEmail, LoginPassword]

  db.query(SQL, values, (err, result) => {
    if (err) {
      console.error('Error during login:', err)
      res
        .status(500)
        .send({ error: 'Database query error' })
    } else if (result.length > 0) {
      console.log(
        'User authenticated successfully:',
        result[0],
      )
      res.status(200).send({
        message: 'Login successful',
        user: result[0],
      })
    } else {
      console.log('Invalid credentials for:', LoginEmail)
      res.status(401).send({ error: 'Invalid credentials' })
    }
  })
})

// Генерація коду для відновлення
let recoveryCodes = {}

// Генерація коду
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

app.post('/recovery', (req, res) => {
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

    console.log('Email not found:', email)
    return res.status(404).json({ exists: false })
  })
})

// Перевірка коду та оновлення пароля
app.post('/recovery-confirm', (req, res) => {
  const { email, code, newPassword } = req.body

  console.log('Received data:', {
    email,
    code,
    newPassword,
  })
  console.log('Stored recovery codes:', recoveryCodes)

  if (
    !recoveryCodes[email] ||
    recoveryCodes[email] !== code
  ) {
    console.error('Invalid recovery code for:', email)
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

    delete recoveryCodes[email] // Видалити код після успішного оновлення
    console.log('Password updated for:', email)
    return res
      .status(200)
      .send({ message: 'Password updated successfully' })
  })
})

// Зміна email та password
app.post('/settings', (req, res) => {
  const { email, password, newEmail, newPassword } =
    req.body

  if (!email || (!newEmail && !newPassword)) {
    return res.status(400).send({
      error: 'Invalid input',
      details: 'Email or updates are missing',
    })
  }

  let sql = ''
  let values = []

  if (newEmail) {
    sql = 'UPDATE users SET email = ? WHERE email = ?'
    values = [newEmail, email]
  } else if (newPassword) {
    sql = 'UPDATE users SET password = ? WHERE email = ?'
    values = [newPassword, email]
  }

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(
        'Error updating email:',
        err.sqlMessage || err,
      )
      return res.status(500).send({
        error: 'Database update error',
        details: err.sqlMessage || err,
      })
    }

    if (result.affectedRows > 0) {
      res
        .status(200)
        .send({ message: 'Email updated successfully' })
    } else {
      res.status(404).send({ error: 'User not found' })
    }
  })

  res.status(200).send({ message: 'Route is working' })
})
// Запуск сервера
const PORT = 3002
app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`,
  )
})
