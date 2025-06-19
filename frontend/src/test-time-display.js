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