if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

const DB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(DB_URI)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
    const person = new Person({
        name,
        number,
        id: Math.floor(Math.random() * 10000)
    })
    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}

const printPersons = () => {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
if (process.argv.length === 4) {
    const name = process.argv[2]
    const number = process.argv[3]
    addPerson(name, number)
} else if (process.argv.length === 2) {
    printPersons()
} else {
    console.log('Invalid number of arguments')
    process.exit(1)
}
