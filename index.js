const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/Person')

// configure morgan to log the response body
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// error handling middleware
const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }
    next(error)
}

app.use(express.static('dist'))

app.use(express.json())
app.use(morgan('tiny'))

app.get('/api/persons', (_, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    }).catch(error => next(error))
})

app.get('/api/info', (_, res, next) => {
    const date = new Date()
    Person.find({}).count().then(count => {
        res.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    }).catch(error => {
        next(error)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)
    Person.findOne({ id }).exec().then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)
    // update number of person with id
    const newPerson = req.body
    const name = newPerson.name
    const number = newPerson.number
    Person.updateOne({ id }, { name, number }).exec().then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = Number(req.params.id)
    Person.findOneAndDelete({ id }).exec().then(person => {
        if (person) {
            res.status(204).end()
        } else {
            res.status(404).end()
        }
    }).catch(error => {
        next(error)
    })
})

app.post('/api/persons', (req, res, next) => {
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

    Person.findOne({ name }).exec().then(person => {
        if (person) {
            return res.status(400).json({
                error: 'name must be unique'
            })
        } else {
            const person = new Person({
                name,
                number,
                id: Math.floor(Math.random() * 10000)
            })

            Person.create(person).then(person => {
                res.json(person)
            }).catch(error => {
                next(error)
            })
        }
    }).catch(error => {
        next(error)
    })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
