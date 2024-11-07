import React, { useEffect } from 'react';
import MonthSelector from './MonthSelector';
import Chart from './Chart';
import TrophyList from './TrophyList';

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
    <div className='mt-[5px]'>
      {sections.map((section) => {
        if (!section.visible) return null;

        switch (section.id) {
          case 'co2':
            return (
              <div className='flex gap-[10px] m-[5px] box-sizing CustomXSM:block' key={section.id}>
                <div className='m-auto overflow-y-auto max-w-[200px] min-h-[200px] w-full h-auto bg-white rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <p className=''>CO2 Saved</p>
                  <div className='flex'>
                    <p className=''>{totalCO2.toFixed(2)}</p>
                    <p className=''>KG</p>
                  </div>
                </div>
                <div className='max-w-[600px] w-full h-[200px] bg-blue-500 m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <p className=''>
                    You have saved as much CO₂ as would be produced by driving approximately {savedKm.toFixed(0)} kilometers by car.
                  </p>
                  <img src={earthImage} alt='Earth' className='w-[80px] h-[80px]' />
                </div>
              </div>
            );
          case 'pln':
            return (
              <div className='flex gap-[10px] m-[5px] box-sizing CustomXSM:block' key={section.id}>
                <div className='m-auto overflow-y-auto max-w-[200px] min-h-[200px] w-full h-auto bg-white rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <p className=''>PLN Saved</p>
                  <div className='flex'>
                    <p className=''>{totalMoney.toFixed(2)}</p>
                    <p className=''>PLN</p>
                  </div>
                </div>
                <div className='flex max-w-[600px] w-full h-[200px] bg-white m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
                  <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes}/>
                </div>
              </div>
            );
          case 'streak':
            return (
              <div className='flex gap-[10px] m-[5px] box-sizing CustomXSM:block' key={section.id}>
                <div className='m-auto overflow-y-auto max-w-[200px] min-h-[200px] w-full h-auto bg-white rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <div className='flex'>
                  <p className=''>Current Streak: </p>
                  <p className=''>&nbsp; {currentStreak}</p>
                  </div>
                    <img src={meter} alt='Earth' className='w-[80px] h-[80px]'/>
                  <p className=''>Longest Streak 🔥: {longestStreak}</p>
                </div>
                <div className='trohpies max-w-[600px] w-full overflow-auto max-h-[200px] h-[200px] bg-white  m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <h2 className='justify-self-center'>🏅 Your Trophies 🏅</h2>
                  <TrophyList
                    runningDistance={runningDistance}
                    cyclingDistance={cyclingDistance}
                    Co2Saved={Co2Saved}
                    CaloriesBurned={CaloriesBurned}
                    MoneySaved={MoneySaved}
                    handleTrophyClick={handleTrophyClick}
                  />
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
              </div>
            );
          case 'Test':
            return (
              <div className='flex gap-[10px] m-[5px] box-sizing CustomXSM:block' key={section.id}>
                <div className='m-auto overflow-y-auto max-w-[200px] min-h-[200px] w-full h-auto bg-white rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                <p>Test1</p>
                </div>
                <div className='max-w-[600px] w-full h-[200px] bg-white m-auto rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.2)]'>
                  <p>Test2</p>
                </div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

export default Overview;
