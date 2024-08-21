// src/components/Distance.js
import React from 'react';
import '../../css/stats.css';

const Distance = ({ totalDistance,totalKcal,totalCO2 ,totalMoney}) => {
  return (
    <div className='xd123'>
      <p className='Co2 inline'>{totalCO2}</p>
      <p className='KG inline'>KG</p>
    </div>
  );
};

export default Distance;
