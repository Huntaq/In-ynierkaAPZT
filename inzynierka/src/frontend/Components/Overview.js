import React from 'react';
import Distance from './Distance';
import PLN from './PLN';
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
  showPreviousNotification,
  showNextNotification
}) => {
  return (
    <div className='row'>
      {sections.map((section) => {
        if (!section.visible) return null;

        switch (section.id) {
          case 'co2':
            return (
              <div className='row' key={section.id}>
                <div className='backgroundInfo'>
                  <p className='textStyleActivity'>CO2 Saved</p>
                  <Distance totalCO2={totalCO2.toFixed(2)} />
                </div>
                <div className='background'>
                  <p className='Co2Info'>
                    You have saved as much CO₂ as would be produced by driving approximately {savedKm.toFixed(0)} kilometers by car.
                  </p>
                  <img src={earthImage} alt='Earth' className='earth-image' />
                </div>
              </div>
            );
          case 'pln':
            return (
              <div className='row' key={section.id}>
                <div className='backgroundInfo'>
                  <p className='textStyleActivity'>PLN Saved</p>
                  <PLN totalMoney={totalMoney.toFixed(2)} />
                </div>
                <div className='background1'>
                  <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
                  <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
                </div>
              </div>
            );
          case 'streak':
            return (
              <div className='row' key={section.id}>
                <div className='backgroundInfo'>
                  <p className='textStyleActivity'>Current Streak</p>
                  <div className='row'>
                    <p className='StreakInfo'>{currentStreak}</p>
                    <img src={meter} alt='Earth' className='meterimage inline' />
                  </div>
                  <p className='textStyleActivity'>Longest Streak 🔥: {longestStreak}</p>
                </div>
                <div className='background2'>
                  <h2>🏅 Your Trophies 🏅</h2>
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
                      <div className={`notification-overlay ${notificationPopupVisible ? 'visible' : ''}`}></div>
                      <div className={`notification-popup ${notificationPopupVisible ? 'visible' : 'hidden'}`} ref={popupRef}>
                        <div className='notification-content'>
                          <div className='row'>
                            <h3>{notifications[currentNotificationIndex]?.header}</h3>
                          </div>
                          <div className='row popupNotification'>
                            <p>{notifications[currentNotificationIndex]?.content}</p>
                          </div>
                        </div>
                        <div className='notification-controls'>
                          <button
                            className='button'
                            onClick={showPreviousNotification}
                            disabled={notifications.length <= 1}
                          >
                            Previous
                          </button>
                          <button
                            className='button'
                            onClick={showNextNotification}
                            disabled={notifications.length <= 1}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          case 'Test':
            return (
              <div className='row' key={section.id}>
                <div className='backgroundInfo'>
                  <p>Test1</p>
                </div>
                <div className='background1'>
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
