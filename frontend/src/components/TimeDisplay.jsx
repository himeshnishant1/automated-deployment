import { useState, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Format time as HH:MM:SS with AM/PM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Format date for additional context
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="time-display-enhanced">
      <div className="time-icon">
        <AccessTimeIcon sx={{ fontSize: 20, color: '#6b7280' }} />
      </div>
      <div className="time-content">
        <div className="time-text-enhanced">{formatTime(currentTime)}</div>
        <div className="date-text">{formatDate(currentTime)}</div>
      </div>
    </div>
  );
}

export default TimeDisplay; 