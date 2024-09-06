import React from 'react';
import PropTypes from 'prop-types';
import '../../css/trophy.css';

const Trophy = ({ type, isEarned }) => {
    const getIcon = () => {
      switch (type) {
        case 'running':
          return '🏃';
        case 'cycling':
          return '🚴'; 
        default:
          return '🏆'; 
      }
    };
  
    return (
      <div className={`trophy ${isEarned ? 'earned' : 'locked'}`}>
        <span className='trophy-icon'>{getIcon()}</span>
        <p className='trophy-type'>{type.charAt(0).toUpperCase() + type.slice(1)} Trophy</p>
      </div>
    );
  };
  
  Trophy.propTypes = {
    type: PropTypes.string.isRequired,
    isEarned: PropTypes.bool.isRequired,
  };
  
  export default Trophy;
