
const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}
const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
}

const Notification = ({ message }) => {
    console.log('Notification', message)
  if (message === null) {
    return null
  }
  return (
    <div style={message.type == 'error' ? errorStyle : successStyle}>
      {message.text}
    </div>
  )
}

export default Notification