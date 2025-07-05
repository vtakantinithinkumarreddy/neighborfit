import React from 'react';

export default function Results({ neighborhoods }) {
  return (
    <div className="results">
      {neighborhoods.length > 0 ? (
        <ul>
          {neighborhoods.map(hood => (
            <li key={hood.id}>
              <h3>{hood.name}</h3>
              <p>Match Score: {hood.matchScore}%</p>
              <p>Amenities: {hood.amenities} | Safety: {100 - Math.round(hood.crimeRate)}/100</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Submit your preferences to see matching neighborhoods</p>
      )}
    </div>
  );
}