import React, { useEffect } from 'react';
import MonthSelector from './MonthSelector';
import Chart from './Chart';
import TrophyList from './TrophyList';
import Calendar1 from '../Calendar';
import CalendarComponent from './CalendarCompontent';

const Overview = ({
  sections,
  totalCO2,
  savedKm,
  earthImage,
  totalMoney,
  handleMonthChange,
  handleTransportChange,
  month,
  year,
  transportMode,
  userRoutes,
  currentStreak,
  longestStreak,
  meter,
  runningDistance,
  cyclingDistance,
  Co2Saved,
  CaloriesBurned,
  MoneySaved,
  handleTrophyClick,
  notifications,
  notificationPopupVisible,
  popupRef,
  currentNotificationIndex,
  goToNotification,
  showNextNotification,
}) => {
  useEffect(() => {
    const intervalId = setInterval(showNextNotification, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [notifications.length]);
  return (
    <div className='flex'>
      <div className='mt-[5px]'>
        {sections.map((section) => {
          if (!section.visible) return null;

          switch (section.id) {
            case 'co2':
            case 'pln':
            case 'streak':
            case 'Test':
              return (
                <div className='flex CustomXSM:block' key={section.id}>
                  <div className='content-center justify-items-center mt-[5px] overflow-y-auto min-w-[200px] min-h-[200px] w-full h-auto bg-[#F1FCF3] rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'>
                    {section.id === 'co2' && (
                      <>
                        <p className='text-[#3B4A3F] font-bold'>CO2 Saved</p>
                        <div className=' flex'>
                          <p className='text-[#3B4A3F] font-bold'>{totalCO2.toFixed(2)}</p>
                          <p className='text-[#3B4A3F] font-bold'>KG</p>
                        </div>
                      </>
                    )}
                    {section.id === 'pln' && (
                      <>
                        <p className='text-[#3B4A3F] font-bold'>PLN Saved</p>
                        <div className='flex'>
                          <p className='text-[#3B4A3F] font-bold'>{totalMoney.toFixed(2)}</p>
                          <p className='text-[#3B4A3F] font-bold'>PLN</p>
                        </div>
                      </>
                    )}
                    {section.id === 'streak' && (
                      <>
                        <div className='flex'>
                          <p className='text-[#3B4A3F] font-bold'>Current Streak: </p>
                          <p className='text-[#3B4A3F] font-bold'>&nbsp; {currentStreak}</p>
                        </div>
                        <img src={meter} alt='Earth' className='w-[80px] h-[80px]' />
                        <p className='text-[#3B4A3F] font-bold'>Longest Streak 🔥: {longestStreak}</p>
                      </>
                    )}
                    {section.id === 'Test' && (
                      <>
                        <p>Test1</p>
                      </>
                    )}
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      <div className='m-[5px] max-w-[600px]'>
        {sections.map((section) => {
          if (!section.visible) return null;

          switch (section.id) {
            case 'Calendar':
              return (
                <div className='max-w-[600px]' key={section.id}>
                <CalendarComponent/>
                </div>
              );

            case 'Chart':
              return (
                <div className=' mt-[5px] min-w-[400px] max-w-[400px] w-full h-[220px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.1]' key={section.id}>
                  <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
                  <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
                </div>
              );

            case 'Trophies':
              return (
                <div className=' mt-[5px] trohpies max-w-[400px] w-full overflow-auto min-h-[200px] h-[200px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.1]' key={section.id}>
                  <h2 className='justify-self-center'>🏅 Your Trophies 🏅</h2>
                  <TrophyList
                    runningDistance={runningDistance}
                    cyclingDistance={cyclingDistance}
                    Co2Saved={Co2Saved}
                    CaloriesBurned={CaloriesBurned}
                    MoneySaved={MoneySaved}
                    handleTrophyClick={handleTrophyClick}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      <div className='mt-[5px]'>
        {sections.map((section) => {
          if (!section.visible) return null;

          switch (section.id) {
            case 'kmYear':
              return (
                <div className='content-center justify-items-center m-[5px] mt-[5px] min-w-[200px] w-full h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]' key={section.id}>
                  <p> KM THIS YEAR </p>
                </div>
              );

            case 'kmMonth':
              return (
                <div className='content-center justify-items-center m-[5px] mt-[5px] min-w-[200px] w-full h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]' key={section.id}>
                  <p> KM THIS MONTH </p>
                </div>
              );

            case 'kmWeek':
              return (
                <div className='content-center justify-items-center m-[5px] mt-[5px] min-w-[200px] w-full h-[150px] bg-[#F1FCF3] m-auto rounded-[10px] shadow-[2px_2px_5px_rgba(0,0,0,0.2)]' key={section.id}>
                  <p> KM THIS WEEK </p>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {notifications.length > 0 && (
        <>
          <div className={`fixed h-full w-full top-0 bg-black opacity-50 left-0 z-50  transition-all  ease-in-out ${notificationPopupVisible ? 'visible' : 'invisible'}`}></div>
          <div className={`CustomSM:max-w-[95%] fixed border-[10px] border-[#409A55]  box-border transition-all  ease-in-out rounded h-[250px] shadow-[0_4px_8px_rgba(0,0,0,0.2)] -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 w-[600px] bg-white z-50 ${notificationPopupVisible ? 'visible' : 'invisible'}`} ref={popupRef}>
            <div>
              <div className='mt-[10px] justify-self-center'>
                <p className='font-bold text-[30px] text-[#409A55] uppercase'>{notifications[currentNotificationIndex]?.header}</p>
              </div>
              <div className='mt-[10px] justify-self-center'>
                <p className='text-[18px]'>{notifications[currentNotificationIndex]?.content}</p>
              </div>
            </div>
            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 flex justify-center gap-[10px]">
              {notifications.map((_, index) => (
                <div
                  key={index}
                  onClick={() => goToNotification(index)}
                  className={`w-[20px] h-[20px] rounded-full cursor-pointer transition-all ${index === currentNotificationIndex ? 'bg-[#409A55]' : 'bg-gray-300'
                    }`}
                ></div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;

