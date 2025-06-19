import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Widget from './Widget';
import useUserProfile from '../hooks/useUserProfile';

function Dashboard() {
  const navigate = useNavigate();
  const { profile, loading, error } = useUserProfile();

  useEffect(() => {
    // Check if user is logged in (token in either storage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  // Placeholder widgets for future utilities
  const widgets = [
    { id: 1, title: 'Quick Actions', description: 'Common tasks and shortcuts' },
    { id: 2, title: 'Analytics Overview', description: 'Key metrics and statistics' },
    { id: 3, title: 'Recent Activity', description: 'Latest updates and changes' },
    { id: 4, title: 'Notifications', description: 'Important alerts and messages' },
    { id: 5, title: 'Resource Monitor', description: 'System resource utilization' },
    { id: 6, title: 'Task Manager', description: 'Manage and track tasks' },
  ];

  const getWelcomeMessage = () => {
    if (loading) return 'Loading...';
    if (error) return 'Welcome!';
    if (profile?.full_name) return `Welcome, ${profile.full_name}!`;
    if (profile?.email) return `Welcome, User!`;
    return 'Welcome!';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h2>{getWelcomeMessage()}</h2>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="widgets-grid">
        {widgets.map(widget => (
          <Widget
            key={widget.id}
            title={widget.title}
            description={widget.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard; 