// src/components/RecentDistance.js
import React from 'react';
import '../../css/stats.css';

const RecentDistance = ({ recentDistance, recentKcal, recentCO2, recentMoney }) => {
  return (
    <div className='activity-card'>
      <p><strong>Last 30 days :</strong></p>
      <p>{recentDistance} km traveled</p>
      <p>{recentKcal} kcal burnt</p>
      <p>{recentCO2} CO2</p>
      <p>{recentMoney} PLN saved</p>
    </div>
  );
};

export default RecentDistance;
