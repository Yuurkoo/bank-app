const mongoose = require('mongoose')

const mongo_url = process.env.MONGO_CONN

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log('Mongo connected succsess...')
  })
  .catch((err) => {
    console.log('Mongo connecting error: ', err)
  })
