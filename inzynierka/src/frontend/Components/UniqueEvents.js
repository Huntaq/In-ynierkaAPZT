import React from 'react';

const UniqueEvents = ({ events, currentIndex, progressData, handleDotClick }) => {
  if (events.length === 0) return null;

  return (
    <div className="relative CustomSM:max-w-[95%] max-w-[920px] w-[100%] h-[150px]  text-white  shadow-[5px_5px_10px_rgba(0,0,0,0.2)]">
      <div className="bg-none">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover rounded-[5px] transition ease-in duration-800"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 60%), url(http://localhost:3000/uploads/${events[currentIndex].image.split('/').pop()})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <div className="relative flex items-center justify-between m-[10px]">
          <h3 className="text-[28px] font-medium uppercase">{events[currentIndex].title}</h3>
          <div className="flex flex-col justify-center w-[150px]">
            <div className="w-full bg-white h-[20px] overflow-hidden rounded-[4px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]">
              <div className="h-full bg-progress-gradient bg-[length:200%_100%] animate-scrolling-progress "
                style={{ width: `${progressData[events[currentIndex].id] || 0}%` }}>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <p className="pl-[10px] text-white uppercase">{events[currentIndex].description}</p>
        </div>
        <div className="relative flex justify-between mt-[40px] text-center CustomXSM:mt-[20px]">
          <p className="flex-1 text-white font-medium">Start Date: {new Date(events[currentIndex].startDate).toLocaleDateString("en-gb",
            {
              day:"2-digit",
              month: "long",
              year: "numeric"
            }
          )}</p>
          <div className="flex-1 flex justify-center translate-x-[-0%] CustomXSM:items-center">
          {events.map((_, index) => (
            <span
              key={index}
              className={`m-[2px] w-[15px] h-[15px] bg-gray-300 rounded-[50%] border-[2px] border-gray-300 cursor-pointer unique-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
          <p className="flex-1 text-white font-medium ">End Date: {new Date(events[currentIndex].endDate).toLocaleDateString("en-gb",
            {
              day:"2-digit",
              month: "long",
              year: "numeric"
            })}</p>
        </div>
      </div>
    </div>
  );
};

export default UniqueEvents;
