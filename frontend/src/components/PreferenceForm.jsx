import React, { useState } from 'react';

export default function PreferenceForm({ onSubmit }) {
  const [preferences, setPreferences] = useState({
    safety: 0.6,
    amenities: 0.5,
    cost: 0.3
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md mx-auto">
        {/* Single Centered Title - Removed absolute positioning */}

        {/* Safety Priority */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Safety Priority: {preferences.safety.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-8">Low</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.safety}
              onChange={(e) => setPreferences({...preferences, safety: parseFloat(e.target.value)})}
              className="flex-1 h-2 bg-blue-500 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8">High</span>
          </div>
        </div>

        {/* Amenities Priority */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Amenities Priority: {preferences.amenities.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-8">Low</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.amenities}
              onChange={(e) => setPreferences({...preferences, amenities: parseFloat(e.target.value)})}
              className="flex-1 h-2 bg-green-500 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8">High</span>
          </div>
        </div>

        {/* Affordability Priority */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium">Affordability Priority: {preferences.cost.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-8">Low</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={preferences.cost}
              onChange={(e) => setPreferences({...preferences, cost: parseFloat(e.target.value)})}
              className="flex-1 h-2 bg-purple-500 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500 w-8">High</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm"
        >
          Find Matching Neighborhoods
        </button>
      </div>
    </div>
  );
}