import React from 'react';

const UniqueEvents = ({ events, currentIndex, progressData, handleDotClick }) => {
  if (events.length === 0) return null;

  return (
    <div className="relative w-[500px] h-[150px]  text-white  shadow-[5px_5px_10px_rgba(0,0,0,0.2)]">
      <div className="bg-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover rounded-[5px] transition ease-in duration-800"
          style={{
            backgroundImage: `url(http://localhost/uploads/${events[currentIndex].image.split('/').pop()})`,
          }}
        />

        <div className="flex items-center justify-between m-[10px]">
          <h3 className="text-[24px] z-40">{events[currentIndex].title}</h3>
          <div className="flex flex-col justify-center w-[150px]">
            <div className="w-full bg-white h-[20px] overflow-hidden z-40">
              <div className="h-full bg-progress-gradient bg-[length:200%_100%] animate-scrolling-progress"
                style={{ width: `${progressData[events[currentIndex].id] || 0}%` }}>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <p className="pl-[10px] text-white">{events[currentIndex].description}</p>
        </div>
        <div className="flex justify-between p-[10px] mt-[30px]">
          <p className="text-white font-bold z-40"><strong>Start Date:</strong> {new Date(events[currentIndex].startDate).toLocaleDateString()}</p>
          <p className="text-white font-bold z-40 "><strong>End Date:</strong> {new Date(events[currentIndex].endDate).toLocaleDateString()}</p>
        </div>
        <div className="absolute flex justify-center top-[124px] left-[50%] translate-x-[-50%]">
          {events.map((_, index) => (
            <span
              key={index}
              className={`m-[2px] w-[15px] h-[15px] bg-gray-300 rounded-[50%] border-[2px] border-gray-300 cursor-pointer unique-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UniqueEvents;
