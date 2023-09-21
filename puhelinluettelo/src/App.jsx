import { useState, useEffect } from 'react'
import Phonebook from './Components/Phonebook.jsx'
import PersonForm from './Components/PersonForm.jsx'
import personService from './services/persons.js'
import Notification from './Components/Notification.jsx'

const MessageType = {
  ERROR: 'error',
  SUCCESS: 'success'
}
const Message = ({ text, type }) => {
  return (
    {
      text: text,
      type: type
    }
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then(persons => {
      setPersons(persons)
    } )
  }, [])

  const handleAddPerson = (event) => {
    event.preventDefault()
    const  newPerson = {
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)) {
      personService.update(persons.find(person => person.name === newName).id, newPerson).then(returnedPerson => {
        setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
        showMessage(Message({ text: `Updated ${newName}`, type: MessageType.SUCCESS }))
      }).catch( _ => {
        showMessage(Message({ text: `Information of ${newName} has already been removed from server`, type: MessageType.ERROR }))
        setPersons(persons.filter(person => person.name !== newName))
      })
    } else {
      personService.create(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showMessage(Message({ text: `Added ${newName}`, type: MessageType.SUCCESS }))
      })
  }
    setNewName('')
    setNewNumber('')
  }
  
  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id).then(() => {
        const newPersons = persons.filter(p => p.id !== person.id)
        setPersons(newPersons)
        showMessage(Message({ text: `Deleted ${person.name}`, type: MessageType.SUCCESS }))
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const showMessage = message => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)

  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}/>
      <div>
        filter shown with <input value={search} onChange={handleSearchChange}/>
      </div>
      <h3>Add a new</h3>
      <PersonForm addPerson={handleAddPerson} 
                    newName={newName} 
                    handleNameChange={handleNameChange} 
                    newNumber={newNumber} 
                    handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Phonebook persons={persons} 
                  filter={search}
                  handleDeletePerson={handleDeletePerson}
                  />
    </div>
  )

}

export default App