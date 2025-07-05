import React, { useState } from 'react';
import PreferenceForm from './components/PreferenceForm';
import Results from './components/Results';
import './App.css';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (preferences) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>NeighborFit</h1>
      <PreferenceForm onSubmit={handleSubmit} />
      {loading ? <p>Loading...</p> : <Results neighborhoods={results} />}
    </div>
  );
}

export default App;