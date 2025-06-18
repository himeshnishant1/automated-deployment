import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Widget from './Widget';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h2>Welcome, {user.email}</h2>
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