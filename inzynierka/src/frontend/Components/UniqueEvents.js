import React from 'react';

const UniqueEvents = ({ events, currentIndex, progressData, handleDotClick }) => {
  if (events.length === 0) return null;

  return (
    <div className="unique-events-container">
      <div className="unique-event-item">
        <div
          className="unique-event-background"
          style={{ backgroundImage: `url(${events[currentIndex].image})` }}
        />
        <div className="unique-event-header">
          <h3 className="unique-event-title">{events[currentIndex].title}</h3>
          <div className="progress-bar-container-wrapper">
            <p className="progress-label">Progress</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar1"
                style={{ width: `${progressData[events[currentIndex].id] || 0}%` }}
              />
            </div>
          </div>
        </div>
        <div className="unique-event-content">
          <p className="unique-event-description">{events[currentIndex].description}</p>
        </div>
        <div className="unique-event-footer">
          <p className="unique-event-date"><strong>Start Date:</strong> {new Date(events[currentIndex].startDate).toLocaleDateString()}</p>
          <p className="unique-event-date"><strong>End Date:</strong> {new Date(events[currentIndex].endDate).toLocaleDateString()}</p>
        </div>
        <div className="unique-dots-container">
          {events.map((_, index) => (
            <span
              key={index}
              className={`unique-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniqueEvents;
