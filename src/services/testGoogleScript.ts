
// Simple test function to diagnose Google Apps Script connection
export async function testGoogleScript() {
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEzsxLZDOIqnJSLnrQpQQF2Ms-Vw9WqULtCPmqYJ4yjTHYcqM3xCLP72YFT3UqBNj3/exec';
  
  console.log('Testing Google Apps Script connection...');
  
  try {
    // Test 1: Simple GET request
    const response = await fetch(`${GOOGLE_SCRIPT_URL}?test=1`, {
      method: 'GET',
      mode: 'no-cors' // This bypasses CORS for testing
    });
    
    console.log('Response received:', response);
    console.log('Response status:', response.status);
    console.log('Response type:', response.type);
    
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    console.error('Connection failed:', error);
    return { success: false, error: error.message };
  }
}

// Alternative test with different approach
export async function testWithJsonp() {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    const callbackName = 'testCallback' + Date.now();
    
    // Create global callback
    (window as any)[callbackName] = (data: any) => {
      console.log('JSONP response:', data);
      document.head.removeChild(script);
      delete (window as any)[callbackName];
      resolve({ success: true, data });
    };
    
    // Add error handling
    script.onerror = () => {
      console.error('JSONP failed');
      document.head.removeChild(script);
      delete (window as any)[callbackName];
      resolve({ success: false, error: 'JSONP failed' });
    };
    
    script.src = `https://script.google.com/macros/s/AKfycbyEzsxLZDOIqnJSLnrQpQQF2Ms-Vw9WqULtCPmqYJ4yjTHYcqM3xCLP72YFT3UqBNj3/exec?callback=${callbackName}&test=1`;
    document.head.appendChild(script);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      if ((window as any)[callbackName]) {
        document.head.removeChild(script);
        delete (window as any)[callbackName];
        resolve({ success: false, error: 'Timeout' });
      }
    }, 10000);
  });
}
