if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const mongoose = require('mongoose');


const DB_USER = process.env.MONGODB_USER
const DB_PASS = process.env.MONGODB_PW
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@fullstack.ku7dckk.mongodb.net/?retryWrites=true&w=majority`


mongoose.set('strictQuery', false);
mongoose.connect(DB_URI)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

const add_person = (name, number) => {
    const person = new Person({
        name: name,
        number: number,
        id: Math.floor(Math.random() * 10000)
    })
    person.save().then(result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}

const print_persons = () => {
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
    add_person(name, number)
} else if (process.argv.length === 2) {
    print_persons()
} else {
    console.log("Invalid number of arguments")
    process.exit(1)
}