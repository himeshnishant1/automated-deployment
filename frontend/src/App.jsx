import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api')
        setMessage(response.data.message)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage('Error connecting to server')
      }
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <h1>Full Stack App</h1>
      <p>{message}</p>
    </div>
  )
}

export default App 