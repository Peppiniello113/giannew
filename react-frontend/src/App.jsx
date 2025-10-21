import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [xValue, setXValue] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setError(null);
    setMessage('');

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');

        if (lines.length < 2) {
          throw new Error('File must have at least 2 lines (header and data).');
        }

        const dataLine = lines[1];
        const firstValue = dataLine.split(',')[0].trim();
        const parsedX = parseInt(firstValue, 10);

        if (isNaN(parsedX)) {
          throw new Error(`Could not read a number from the second line. Found: "${firstValue}"`);
        }

        setXValue(parsedX);
        setLoading(false);

      } catch (err) {
        setError(`Error reading file: ${err.message}`);
        setLoading(false);
        setXValue(null);
        setFileName('');
      }
    };

    reader.readAsText(file);
  };

  const fetchData = async () => {
    if (xValue === null) {
      setError('Please select a valid CSV file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');

    try {
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

  return (
    <div className="app-container">
      <div className="main-card">
        <div className="header-section">
          <div className="icon-wrapper">
            <svg className="api-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="title">Data Processing Hub</h1>
          <p className="subtitle">Upload your CSV file and process it through our API</p>
        </div>

        <div className="content-section">
          <div className="upload-section">
            <label className="upload-label">
              <input
                type="file"
                accept=".csv, .txt"
                onChange={handleFileChange}
                className="file-input"
                disabled={loading}
              />
              <div className="upload-button">
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="upload-text">
                  {fileName ? fileName : 'Choose CSV or TXT file'}
                </span>
              </div>
            </label>
          </div>

          {xValue !== null && (
            <div className="file-info">
              <svg className="check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="file-details">
                <span className="file-label">Loaded value:</span>
                <span className="file-value">{xValue}</span>
                <span className="file-name">from {fileName}</span>
              </div>
            </div>
          )}

          <button
            onClick={fetchData}
            disabled={loading || xValue === null}
            className={`action-button ${loading ? 'loading' : ''} ${xValue === null ? 'disabled' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <svg className="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Process with API
              </>
            )}
          </button>

          {message && (
            <div className="result-card success">
              <div className="result-header">
                <svg className="result-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="result-label">API Response</span>
              </div>
              <p className="result-message">{message}</p>
            </div>
          )}

          {error && (
            <div className="result-card error">
              <div className="result-header">
                <svg className="result-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="result-label">Error</span>
              </div>
              <p className="result-message">{error}</p>
            </div>
          )}
        </div>

        <div className="footer-section">
          <div className="tech-stack">
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;