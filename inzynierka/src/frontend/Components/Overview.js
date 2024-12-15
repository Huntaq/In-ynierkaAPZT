import React, { useEffect } from 'react';
import CalendarComponent from './CalendarCompontent';
import Notifications from './NotificationsModal';


const Overview = ({
  sections,
  totalCO2,
  totalMoney,
  currentStreak,
  longestStreak,
  meter,
  notifications,
  showNextNotification,
  setPopupVisible1,
  totalThisYear,
  totalThisMonth,
  totalThisWeek,
}) => {
  useEffect(() => {
    const intervalId = setInterval(showNextNotification, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [notifications.length]);

  const emisionPerKM= 0.12;
  const km = (totalCO2 / emisionPerKM).toFixed(0);

  return (
    <div className='diff-browser-center mt-[10px] flex flex-wrap w-full max-w-[1200px] gap-[10px] justify-center'>
      <div className=' flex flex-col gap-[10px] w-[200px] min-w-[200px] OverviewTestCol1:w-full OverviewTestCol1:contents diff-browser-center'>

        <div className="absolute bottom-[40px] right-[40px] max-h-[90px] gap-[10px]">
          <button className='hover:scale-105' onClick={() => setPopupVisible1(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M28 5.5C31.814 5.5 34.524 5.504 36.58 5.78C38.59 6.05 39.75 6.558 40.596 7.404C41.442 8.25 41.95 9.41 42.22 11.422C42.496 13.478 42.5 16.186 42.5 20C42.5 20.3978 42.658 20.7794 42.9393 21.0607C43.2206 21.342 43.6022 21.5 44 21.5C44.3978 21.5 44.7794 21.342 45.0607 21.0607C45.342 20.7794 45.5 20.3978 45.5 20V19.888C45.5 16.212 45.5 13.3 45.194 11.022C44.878 8.678 44.214 6.78 42.718 5.282C41.22 3.786 39.322 3.122 36.978 2.806C34.698 2.5 31.788 2.5 28.112 2.5H28C27.6022 2.5 27.2206 2.65804 26.9393 2.93934C26.658 3.22064 26.5 3.60218 26.5 4C26.5 4.39782 26.658 4.77936 26.9393 5.06066C27.2206 5.34196 27.6022 5.5 28 5.5ZM19.888 2.5H20C20.3978 2.5 20.7794 2.65804 21.0607 2.93934C21.342 3.22064 21.5 3.60218 21.5 4C21.5 4.39782 21.342 4.77936 21.0607 5.06066C20.7794 5.34196 20.3978 5.5 20 5.5C16.186 5.5 13.478 5.504 11.42 5.78C9.41 6.05 8.25 6.558 7.404 7.404C6.558 8.25 6.05 9.41 5.78 11.42C5.504 13.478 5.5 16.186 5.5 20C5.5 20.3978 5.34196 20.7794 5.06066 21.0607C4.77936 21.342 4.39782 21.5 4 21.5C3.60218 21.5 3.22064 21.342 2.93934 21.0607C2.65804 20.7794 2.5 20.3978 2.5 20V19.888C2.5 16.212 2.5 13.3 2.806 11.022C3.122 8.678 3.786 6.78 5.282 5.282C6.78 3.786 8.678 3.122 11.022 2.806C13.302 2.5 16.212 2.5 19.888 2.5Z" fill="#3B4A3F" />
              <path d="M11.054 11.054C10 12.108 10 13.806 10 17.2C10 19.462 10 20.594 10.702 21.298C11.406 22 12.54 22 14.8 22H17.2C19.462 22 20.594 22 21.298 21.298C22 20.594 22 19.46 22 17.2V14.8C22 12.538 22 11.406 21.298 10.702C20.594 10 19.46 10 17.2 10C13.806 10 12.108 10 11.054 11.054ZM11.054 36.946C10 35.892 10 34.194 10 30.8C10 28.538 10 27.406 10.702 26.702C11.406 26 12.54 26 14.8 26H17.2C19.462 26 20.594 26 21.298 26.702C22 27.406 22 28.538 22 30.8V33.2C22 35.462 22 36.594 21.298 37.296C20.594 38 19.46 38 17.2 38C13.806 38 12.108 38 11.054 36.946ZM26 14.8C26 12.538 26 11.406 26.702 10.702C27.408 10 28.54 10 30.8 10C34.194 10 35.892 10 36.946 11.054C38 12.108 38 13.806 38 17.2C38 19.462 38 20.594 37.296 21.298C36.596 22 35.462 22 33.2 22H30.8C28.538 22 27.406 22 26.702 21.298C26 20.594 26 19.46 26 17.2V14.8ZM26.704 37.298C26 36.594 26 35.46 26 33.2V30.8C26 28.538 26 27.406 26.702 26.702C27.408 26 28.54 26 30.8 26H33.2C35.462 26 36.594 26 37.296 26.702C38 27.406 38 28.538 38 30.8C38 34.194 38 35.892 36.946 36.946C35.892 38 34.194 38 30.8 38C28.538 38 27.406 38 26.702 37.296" fill="#3B4A3F" />
              <path d="M44 26.5C44.3978 26.5 44.7794 26.658 45.0607 26.9393C45.342 27.2206 45.5 27.6022 45.5 28V28.112C45.5 31.788 45.5 34.7 45.194 36.978C44.878 39.322 44.214 41.22 42.718 42.718C41.22 44.214 39.322 44.878 36.978 45.194C34.698 45.5 31.788 45.5 28.112 45.5H28C27.6022 45.5 27.2206 45.342 26.9393 45.0607C26.658 44.7794 26.5 44.3978 26.5 44C26.5 43.6022 26.658 43.2206 26.9393 42.9393C27.2206 42.658 27.6022 42.5 28 42.5C31.814 42.5 34.524 42.496 36.58 42.22C38.59 41.95 39.75 41.442 40.596 40.596C41.442 39.75 41.95 38.59 42.22 36.578C42.496 34.524 42.5 31.814 42.5 28C42.5 27.6022 42.658 27.2206 42.9393 26.9393C43.2206 26.658 43.6022 26.5 44 26.5ZM5.5 28C5.5 27.6022 5.34196 27.2206 5.06066 26.9393C4.77936 26.658 4.39782 26.5 4 26.5C3.60218 26.5 3.22064 26.658 2.93934 26.9393C2.65804 27.2206 2.5 27.6022 2.5 28V28.112C2.5 31.788 2.5 34.7 2.806 36.978C3.122 39.322 3.786 41.22 5.282 42.718C6.78 44.214 8.678 44.878 11.022 45.194C13.302 45.5 16.212 45.5 19.888 45.5H20C20.3978 45.5 20.7794 45.342 21.0607 45.0607C21.342 44.7794 21.5 44.3978 21.5 44C21.5 43.6022 21.342 43.2206 21.0607 42.9393C20.7794 42.658 20.3978 42.5 20 42.5C16.186 42.5 13.478 42.496 11.42 42.22C9.41 41.95 8.25 41.442 7.404 40.596C6.558 39.75 6.05 38.59 5.78 36.578C5.504 34.524 5.5 31.814 5.5 28Z" fill="#3B4A3F" />
            </svg>
          </button>
        </div>

        {sections.map((section) => {
          if (!section.visible) return null;

          switch (section.id) {
            case 'co2':
            case 'pln':
            case 'streak':
              return (
                <div className='flex CustomXSM:block ' key={section.id}>
                  <div className=' content-center justify-items-center mt-[5px] overflow-y-auto w-[200px] CustomXSM:w-[150px] CustomXSM:h-[150px] max-w-[100%] h-[150px] bg-[#F1FCF3] rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
                    {section.id === 'co2' && (
                      <div className=' w-full place-items-start pl-[20px]'>
                        <p className='flex text-[#B5B5B5] font-bold mb-[20px] w-full justify-start mt-[5px]'>CO2 Saved</p>
                        <div className='flex h-[95px] gap-[10px]'>
                          <p className='text-[#3B4A3F] font-bold text-[50px] self-end'>{totalCO2.toFixed(0)}</p>
                          <p className='text-[#3B4A3F] font-bold self-end mb-[12px]'>KG</p>
                        </div>
                      </div>
                    )}
                    {section.id === 'pln' && (
                      <div className='h-auto w-full pl-[20px]'>
                        <p className='flex text-[#B5B5B5] font-bold mb-[20px] w-full justify-start mt-[5px]'>PLN Saved</p>
                        <div className='flex h-[95px] gap-[10px]'>
                          <p className='text-[#3B4A3F] font-bold text-[50px] self-end'>{totalMoney.toFixed(0)}</p>
                          <p className='text-[#3B4A3F] font-bold self-end mb-[12px]'>PLN</p>
                        </div>
                      </div>
                    )}
                    {section.id === 'streak' && (
                      <div className=' w-full place-items-start pl-[20px]'>
                      <p className='text-[#B5B5B5] font-bold'>Your Streak</p>
                        <div className='flex gap-[20px] ml-[-20px]'>
                          <p className='text-[#3B4A3F] w-auto font-bold text-[50px]'>&nbsp; {currentStreak}</p>
                          <img src={meter} alt='Earth' className='w-[80px] h-[80px]' />
                        </div>
                        <p className='text-[#B5B5B5] text-[12px] font-bold'>Longest Streak : {longestStreak}</p>
                      </div>
                    )}
                    
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      <div className='flex flex-col gap-[10px] w-[500px] max-w-[100%] min-w-[200px]'>
        {sections.map((section) => {
          if (!section.visible) return null;

          switch (section.id) {
            case 'Calendar':
              return (
                <div className='w-[600px] max-w-[100%]' key={section.id}>
                  <CalendarComponent />
                </div>
              );
              case 'Info':
                return (
                  <div className='w-[600px] max-w-[100%]' key={section.id}>
                    <div className='content-center justify-items-center w-[400px] max-w-[100%] h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
                    <div className='place-items-start m-[25px] '>
                      <p className='text-[#3B4A3F] text-[28px] font-bold'> Do you know that... </p>
                      <p className='text-[16px] text-start'>You have saved as much CO₂ as would be produced by driving approximately {km} kilometers by car!</p>
                    </div>
                  </div>
                  </div>
                );

            default:
              return null;
          }
        })}
      </div>

      <div className='flex flex-col gap-[10px] w-[200px] min-w-[200px] OverviewTest:contents OverviewTest:w-full'>
        {sections.map((section) => {
          if (!section.visible) return null;

          switch (section.id) {
            case 'Trophies':
              return (
                
                <div className=' mt-[5px] trohpies mt-[5px] w-[600px] max-w-[100%]  m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.1]' key={section.id}>
                 <div className='content-center justify-items-center m-[5px] mt-[5px] w-[200px] max-w-[100%] h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
                    <p className='text-[16px] text-[#B5B5B5] font-semibold'>This Year </p>
                    <p className='text-[24px] text-[#3B4A3F] font-semibold'>{totalThisYear.toFixed(0)} KM</p>
                  </div>
                  <div className='content-center justify-items-center m-[5px] mt-[15px] w-[200px] max-w-[100%] h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
                    <p className='text-[16px] text-[#B5B5B5] font-semibold'>This Month </p>
                    <p className='text-[24px] text-[#3B4A3F] font-semibold'>{totalThisMonth.toFixed(0)} KM</p>
                  </div>
                  <div className='content-center justify-items-center m-[5px] mt-[15px] w-[200px] max-w-[100%] h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
                    <p className='text-[16px] text-[#B5B5B5] font-semibold'>This Week </p>
                    <p className='text-[24px] text-[#3B4A3F] font-semibold'> {totalThisWeek.toFixed(0)} KM</p>
                  </div>
                </div>





              );

            default:
              return null;
          }
        })}
      </div>
      <Notifications />
    </div>
  );
};

export default Overview;

