import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://automated-deployment-frontend-uc5h.vercel.app'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_URL}/api`)
        setMessage(response.data.message)
        setError(null)
      } catch (error) {
        console.error('Error fetching data:', error)
        setMessage('Error connecting to server')
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="App">
      <h1>Full Stack App</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="error">
          <p>Error: {error}</p>
          <p>API URL: {API_URL}</p>
        </div>
      ) : (
        <div>
          <p>{message}</p>
          <p className="api-url">Connected to: {API_URL}</p>
        </div>
      )}
    </div>
  )
}

export default App 