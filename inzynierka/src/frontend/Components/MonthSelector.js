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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [transportMode, setTransportMode] = useState(1);

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    onMonthChange(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    onMonthChange(currentMonth === 11 ? 0 : currentMonth + 1, currentMonth === 11 ? currentYear + 1 : currentYear);
  };
  const handleTransportChange = (event) => {
    const selectedMode = parseInt(event.target.value, 10);
    setTransportMode(selectedMode);
    onTransportChange(selectedMode);
  };

  useEffect(() => {
    onTransportChange(transportMode); // initial transport mode
  },[onTransportChange, transportMode]);

  return (
    <div>
      <div className='row monthSelector'>
        <button onClick={handlePreviousMonth}>&lt;</button>
        <span>{monthNames[currentMonth]} {currentYear}</span>
        <button onClick={handleNextMonth}>&gt;</button>
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
