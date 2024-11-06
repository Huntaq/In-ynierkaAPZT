import React from 'react';
import '../../css/stats.css';

const Distance = ({totalCO2}) => {
  return (
    <div className='flex'>
      <p className=''>{totalCO2}</p>
      <p className=''>KG</p>
    </div>
  );
};

export default Distance;
