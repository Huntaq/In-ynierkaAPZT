import React from 'react';
import '../../css/stats.css';

const Distance = ({totalCO2}) => {
  return (
    <div className='xd123'>
      <p className='Co2 inline'>{totalCO2}</p>
      <p className='KG inline'>KG</p>
    </div>
  );
};

export default Distance;
