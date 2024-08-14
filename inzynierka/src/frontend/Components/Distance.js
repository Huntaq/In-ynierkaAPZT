// src/components/Distance.js
import React from 'react';
import '../../css/stats.css';

const Distance = ({ totalDistance,totalKcal,totalCO2 ,totalMoney}) => {
  return (
    <div className='activity-card'>
      <p><strong>Total :</strong></p>
      <p>{totalDistance} km traveled</p>
      <p>{totalKcal} kcal burnt</p>
      <p>{totalCO2} CO2</p>
      <p>{totalMoney} PLN saved</p>
    </div>
  );
};

export default Distance;
