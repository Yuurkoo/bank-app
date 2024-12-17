const express = require('express')
const router = express.Router()
const User = require('../models/User') // Імпортуємо модель користувача
const bcrypt = require('bcrypt')
const crypto = require('crypto')

// Головний маршрут
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running!' })
})

// Реєстрація нового користувача
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: 'Email and password are required.' })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email already exists.',
      })
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      email,
      password: hashedPassword,
    })
    await newUser.save()
    res
      .status(201)
      .json({ message: 'User registered successfully' })
  } catch (err) {
    console.error('Error during signup:', err.message)
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    })
  }
})

// Логін користувача
router.post('/signin', async (req, res) => {
  const { LoginEmail, LoginPassword } = req.body

  if (!LoginEmail || !LoginPassword) {
    return res
      .status(400)
      .json({ error: 'Email and password are required.' })
  }

  try {
    const user = await User.findOne({ email: LoginEmail })
    if (!user) {
      return res
        .status(401)
        .json({ error: 'Invalid email or password' })
    }

    // Порівняння хешованого пароля
    const isPasswordValid = await bcrypt.compare(
      LoginPassword,
      user.password,
    )
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: 'Invalid email or password' })
    }

    res.status(200).json({
      message: 'Login successful',
      user: { email: user.email, id: user._id },
    })
  } catch (err) {
    console.error('Error during signin:', err.message)
    res.status(500).json({
      error: 'Database error',
      details: err.message,
    })
  }
})

// Об'єкт для тимчасового зберігання кодів
let recoveryCodes = {}

// Генерація коду
function generateCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase() // Генерує 8-символьний код
}

// Генерація коду відновлення
router.post('/recovery', async (req, res) => {
  const { email } = req.body

  if (!email) {
    return res
      .status(400)
      .json({ error: 'Email is required' })
  }

  try {
    const user = await User.findOne({ email })

    if (!user) {
      return res
        .status(404)
        .json({ error: 'Email not found' })
    }

    const recoveryCode = generateCode()
    recoveryCodes[email] = recoveryCode

    console.log(
      'Generated recovery code for',
      email,
      ':',
      recoveryCode,
    )

    // Імітація надсилання коду (реалізація надсилання залежить від вимог)
    // TODO: Інтегрувати поштовий сервіс для відправки коду

    res.status(200).json({
      message: 'Recovery code sent to email',
      code: recoveryCode,
    })
  } catch (err) {
    console.error('Error during recovery:', err.message)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Перевірка коду та оновлення пароля
router.post('/recovery-confirm', async (req, res) => {
  const { email, code, newPassword } = req.body

  if (!email || !code || !newPassword) {
    return res
      .status(400)
      .json({ error: 'All fields are required' })
  }

  console.log('Received data for recovery:', {
    email,
    code,
    newPassword,
  })

  if (
    !recoveryCodes[email] ||
    recoveryCodes[email] !== code
  ) {
    return res
      .status(400)
      .json({ error: 'Invalid recovery code' })
  }

  try {
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10,
    )

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
    )

    if (!user) {
      return res
        .status(404)
        .json({ error: 'User not found' })
    }

    // Видаляємо код після успішного оновлення
    delete recoveryCodes[email]

    console.log('Password updated successfully for:', email)
    res
      .status(200)
      .json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error(
      'Error during password update:',
      err.message,
    )
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Зміна email та password
router.post('/settings', async (req, res) => {
  const { email, password, newEmail, newPassword } =
    req.body

  if (!email || (!newEmail && !newPassword)) {
    return res.status(400).send({
      error: 'Invalid input',
      details: 'Email or updates are missing',
    })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(404)
        .send({ error: 'User not found' })
    }

    // Перевірка пароля, якщо оновлюється email або пароль
    if (password) {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password,
      )
      if (!isPasswordValid) {
        return res
          .status(401)
          .send({ error: 'Invalid current password' })
      }
    }

    // Оновлення email
    if (newEmail) {
      user.email = newEmail
    }

    // Оновлення пароля
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(
        newPassword,
        10,
      )
      user.password = hashedPassword
    }

    await user.save()
    res.status(200).send({
      message: 'User settings updated successfully',
    })
  } catch (err) {
    console.error(
      'Error updating user settings:',
      err.message,
    )
    res.status(500).send({
      error: 'Database update error',
      details: err.message,
    })
  }
})

module.exports = router
