import React, { useState, useEffect } from 'react';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const transportModes = {
  1: 'Running',
  2: 'Bike'
};

const MonthSelector = ({ onMonthChange, onTransportChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [transportMode, setTransportMode] = useState(1);

 
  const handleTransportChange = (event) => {
    const selectedMode = parseInt(event.target.value, 10);
    setTransportMode(selectedMode);
    onTransportChange(selectedMode);
  };

  useEffect(() => {
    onTransportChange(transportMode);
  },[onTransportChange, transportMode]);

  return (
    <div>
      <div className='row monthSelector'>
        <span>{monthNames[currentMonth]}</span>
      </div>
      <div className='row transportSelector'>
      <select value={transportMode} onChange={handleTransportChange} className='transport-selector'>
        {Object.entries(transportModes).map(([modeId, modeName]) => (
          <option key={modeId} value={modeId}>
            {modeName}
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default MonthSelector;
