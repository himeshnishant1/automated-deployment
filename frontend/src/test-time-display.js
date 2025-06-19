// Simple test for TimeDisplay component functionality
function testTimeDisplay() {
  console.log('Testing TimeDisplay component...');
  
  // Test time formatting
  const testDate = new Date('2024-01-15T14:30:45');
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formattedTime = formatTime(testDate);
  console.log('Formatted time:', formattedTime);
  
  // Verify format is correct (HH:MM:SS)
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;
  if (timeRegex.test(formattedTime)) {
    console.log('✅ Time format is correct');
  } else {
    console.log('❌ Time format is incorrect');
  }
  
  // Test current time
  const currentTime = formatTime(new Date());
  console.log('Current time:', currentTime);
  
  console.log('TimeDisplay component test completed');
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testTimeDisplay = testTimeDisplay;
} else {
  // Node.js environment
  testTimeDisplay();
}

export default testTimeDisplay;

// Test file for enhanced TimeDisplay component
import { render, screen } from '@testing-library/react';
import TimeDisplay from './components/TimeDisplay';

// Mock the Material-UI icon
jest.mock('@mui/icons-material/AccessTime', () => {
  return function MockAccessTimeIcon(props) {
    return <div data-testid="clock-icon" {...props}>🕐</div>;
  };
});

describe('Enhanced TimeDisplay Component', () => {
  beforeEach(() => {
    // Mock the current date/time
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T10:30:45.123Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders enhanced time display with icon', () => {
    render(<TimeDisplay />);
    
    // Check if clock icon is rendered
    expect(screen.getByTestId('clock-icon')).toBeInTheDocument();
    
    // Check if time is displayed
    expect(screen.getByText(/10:30:45/)).toBeInTheDocument();
    
    // Check if date is displayed
    expect(screen.getByText(/Mon, Jan 15/)).toBeInTheDocument();
  });

  test('updates time every second', () => {
    render(<TimeDisplay />);
    
    // Initial time
    expect(screen.getByText(/10:30:45/)).toBeInTheDocument();
    
    // Advance time by 1 second
    jest.advanceTimersByTime(1000);
    
    // Should show updated time
    expect(screen.getByText(/10:30:46/)).toBeInTheDocument();
  });

  test('has proper CSS classes for enhanced styling', () => {
    const { container } = render(<TimeDisplay />);
    
    // Check for enhanced container class
    expect(container.querySelector('.time-display-enhanced')).toBeInTheDocument();
    
    // Check for time content wrapper
    expect(container.querySelector('.time-content')).toBeInTheDocument();
    
    // Check for enhanced time text
    expect(container.querySelector('.time-text-enhanced')).toBeInTheDocument();
    
    // Check for date text
    expect(container.querySelector('.date-text')).toBeInTheDocument();
  });

  test('displays time in 12-hour format with AM/PM', () => {
    // Set time to afternoon
    jest.setSystemTime(new Date('2024-01-15T14:30:45.123Z'));
    
    render(<TimeDisplay />);
    
    // Should show PM time
    expect(screen.getByText(/2:30:45 PM/)).toBeInTheDocument();
  });
}); 