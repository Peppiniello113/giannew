import { useState } from 'react';
import './App.css'; 

function App() {
  // 1. Create state variables
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- MODIFIED: This will hold the 'x' value after we read it from the file ---
  const [xValue, setXValue] = useState(null); // Start as null
  const [fileName, setFileName] = useState(''); // Just to show the user's file name

  // --- NEW: This function runs when the user selects a file ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return; // User clicked "cancel"

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setMessage('');
    
    const reader = new FileReader();

    // This function runs when the file has been successfully read
    reader.onload = (e) => {
      try {
        const content = e.target.result; // This is the text content of the file
        
        // --- THIS IS THE UPDATED LOGIC ---
        
        // 1. Split the file into lines
        const lines = content.split('\n');

        // 2. Check if there are at least 2 lines (header + data)
        if (lines.length < 2) {
          throw new Error('File must have at least 2 lines (header and data).');
        }

        // 3. Get the SECOND line (index 1), which has the data
        const dataLine = lines[1]; 
        
        // 4. Get the first value from that data line
        const firstValue = dataLine.split(',')[0].trim();
        const parsedX = parseInt(firstValue, 10);

        if (isNaN(parsedX)) {
          // Handle cases where the file content isn't a number
          throw new Error(`Could not read a number from the second line. Found: "${firstValue}"`);
        }
        
        // --- END OF UPDATED LOGIC ---

        // 4. Save the parsed number to our state
        setXValue(parsedX);
        setLoading(false);

      } catch (err) {
        setError(`Error reading file: ${err.message}`);
        setLoading(false);
        setXValue(null);
        setFileName('');
      }
    };
    
    // Start reading the file
    reader.readAsText(file);
  };

  // 2. This function will be called when the button is clicked
  const fetchData = async () => {
    // Make sure we have a value from the file first
    if (xValue === null) {
      setError('Please select a valid CSV file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');

    try {
      // This part is the same as before. It uses the 'xValue' from the file.
      const response = await fetch(`http://127.0.0.1:8002/${xValue}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessage(data.message);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. This is the HTML (JSX) that gets rendered
  return (
    <div className="App">
      <header className="App-header">
        <h1>FastAPI + React</h1>
        
        {/* --- MODIFIED: Replaced the number input with a file input --- */}
        <div>
          <label htmlFor="csv-input" style={{ marginRight: '10px' }}>
            1. Select CSV File:
          </label>
          <input
            id="csv-input"
            type="file"
            accept=".csv, .txt" // Only allow CSV or TXT files
            onChange={handleFileChange}
          />
        </div>

        {/* Show what we loaded */}
        {xValue !== null && (
          <p>Loaded value <strong>{xValue}</strong> from <strong>{fileName}</strong></p>
        )}

        <br /> 

        {/* This button is now step 2 */}
        <button 
          onClick={fetchData} 
          disabled={loading || xValue === null} // Disable button if loading or no file is loaded
        >
          {loading ? 'Processing...' : '2. Get Message from API'}
        </button>

        {/* Display the message, error, or nothing */}
        {message && <h2>API Response: {message}</h2>}
        {error && <h2 style={{ color: 'red' }}>Error: {error}</h2>}

      </header>
    </div>
  );
}

export default App;