const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/Person')

//configure morgan to log the response body
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))


app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/persons', (_, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/info', (_, res) => { 
    const date = new Date()
    Person.find({}).count().then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
   
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.findOne({id: id}).exec().then(person => {
        if(person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
        
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    Person.findOneAndDelete({id: id}).exec().then(person => {
        if(person) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
        
    })
})

app.post('/api/persons', (req, res) => {
    const newPerson = req.body
    const name = newPerson.name
    const number = newPerson.number

    if (!name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    if (!number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    Person.findOne({name: name}).exec().then(person => {
        if(person) {
            return res.status(400).json({
                error: 'name must be unique'
            })
        } else {
            const person = new Person({
                name: name,
                number: number,
                id: Math.floor(Math.random() * 10000)
            })
        
            Person.create(person).then(person => {
                res.json(person)
                })
                .catch(error => {
                console.log(error)
            })
        }
    })


    
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})