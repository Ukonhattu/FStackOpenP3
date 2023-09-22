if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

const DB_URI = process.env.MONGODB_URI

mongoose.connect(DB_URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: (v) => {
                // validate so that:
                // 1. only numbers and '-' are allowed
                // 2. its either 2 numbers, a '-', rest of the numbers OR 3 numbers, a '-', rest of the numbers
                return /^(\d{2}-\d+|\d{3}-\d+)$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    id: Number
})

module.exports = mongoose.model('Person', personSchema)
