if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const mongoose = require('mongoose');

const DB_URI = process.env.MONGODB_URI

mongoose.connect(DB_URI)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

module.exports = mongoose.model('Person', personSchema)