import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token') || !!sessionStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 