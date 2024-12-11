import React, { useEffect, useState, useRef } from 'react';
import '../css/stats.css';
import Header from './Components/Header';
import earthImage from './Components/earth.png';
import meter from './Components/meter.png';
import { jwtDecode } from "jwt-decode";
import SettingsPopup from './Components/SettingsPopup';
import { useNavigate } from 'react-router-dom';
import Overview from './Components/Overview';
import UniqueEvents from './Components/UniqueEvents';
import BackGround from './Components/BackGround';

const UserAcc = () => {
  const [user, setUser] = useState(null);
  const [userRoutes, setUserRoutes] = useState([]);
  const [runningDistance, setRunningDistance] = useState(0);
  const [cyclingDistance, setCyclingDistance] = useState(0);
  const [walkingDistance, setWalkingDistance] = useState(0);
  const [Co2Saved, setCo2Saved] = useState(0);
  const [CaloriesBurned, setCaloriesBurned] = useState(0);
  const [MoneySaved, setMoneySaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [transportMode, setTransportMode] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [popupVisible1, setPopupVisible1] = useState(false);
  const [notifications] = useState([]);
  const [notificationPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [currentNotificationIndex] = useState(0);
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressData, setProgressData] = useState({});
  const [totalThisYear, settotalThisYear] = useState(0);
  const [totalThisMonth, settotalThisMonth] = useState(0);
  const [totalThisWeek, settotalThisWeek] = useState(0);



  useEffect(() => {

    fetchUserData();

  }, [navigate]);

  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const sessionKey = decodedToken.sessionKey;

        const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'sessionKey': sessionKey
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData[0]);
          if (decodedToken.Admin === 1) {
            setShowAdminButton(true);
          }
          if (userData[0].is_banned === 1) {
            navigate('/Banned');
          }
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('cooldownTimestamp');
          localStorage.removeItem('userSections');
          navigate('/');
        }

        const routesResponse = await fetch(`http://localhost:5000/api/users/${userId}/routes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'sessionKey': sessionKey
          },
        });

        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          setUserRoutes(routesData);
          calculateStreaks(routesData);

          const now = new Date();

          const isSameYear = (date) => new Date(date).getFullYear() === now.getFullYear();

          const isSameMonth = (date) => {
            const d = new Date(date);
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
          };

          const isSameWeek = (date) => {
            const d = new Date(date);
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            return d >= startOfWeek && d <= endOfWeek;
          };

          const totalThisYearTemp = routesData
            .filter(route => isSameYear(route.date))
            .reduce((sum, route) => sum + route.distance_km, 0);

          settotalThisYear(totalThisYearTemp);

          const totalThisMonthTemp = routesData
            .filter(route => isSameMonth(route.date))
            .reduce((sum, route) => sum + route.distance_km, 0);

            settotalThisMonth(totalThisMonthTemp);


          const totalThisWeekTemp = routesData
            .filter(route => isSameWeek(route.date))
            .reduce((sum, route) => sum + route.distance_km, 0);

            settotalThisWeek(totalThisWeekTemp);




          const runningDistance = routesData
            .filter(route => route.transport_mode_id === 1)
            .reduce((acc, route) => acc + route.distance_km, 0);
          const cyclingDistance = routesData
            .filter(route => route.transport_mode_id === 2)
            .reduce((acc, route) => acc + route.distance_km, 0);
          const walkingDistance = routesData
            .filter(route => route.transport_mode_id === 3)
            .reduce((acc, route) => acc + route.distance_km, 0);
          const totalCo2Saved = routesData.reduce((acc, route) => acc + route.CO2, 0);
          const totalCaloriesBurned = routesData.reduce((acc, route) => acc + route.kcal, 0);
          const totalMoneySaved = routesData.reduce((acc, route) => acc + route.money, 0);

          setRunningDistance(runningDistance);
          setCyclingDistance(cyclingDistance);
          setWalkingDistance(walkingDistance);
          setCo2Saved(totalCo2Saved);
          setCaloriesBurned(totalCaloriesBurned);
          setMoneySaved(totalMoneySaved);

          const eventsResponse = await fetch(`http://localhost:5000/api/event`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });

          if (eventsResponse.ok) {
            const data = await eventsResponse.json();
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];

            const activeEvents = data.filter(event => {
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);

              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(23, 59, 59, 999);

              const startDateString = startDate.toISOString().split('T')[0];
              const endDateString = endDate.toISOString().split('T')[0];

              return event.status === 'active' &&
                startDateString <= todayString &&
                endDateString >= todayString;
            });

            setEvents(activeEvents);

            const progressMap = {};

            const userAlreadyAdded = async (eventId) => {
              const eventResponse = await fetch(`http://localhost:5000/api/event/${eventId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'sessionKey': sessionKey
                },
              });

              if (eventResponse.ok) {
                const eventData = await eventResponse.json();

                const userIds = eventData.user_ids ? eventData.user_ids.split(',') : [];

                return userIds.includes(userId.toString());
              }
              return false;
            };

            for (const event of activeEvents) {
              const isUserAdded = await userAlreadyAdded(event.id);
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              startDate.setHours(0, 0, 0, 0);
              endDate.setHours(23, 59, 59, 999);

              const relevantRoutes = routesData.filter(route => {
                const routeDate = new Date(route.date);
                routeDate.setHours(0, 0, 0, 0);
                return routeDate >= startDate && routeDate <= endDate;
              });

              let progress = 0;
              let neededDistance = event.distance || 0;
              if (event.type === 'run') {
                progress = relevantRoutes
                  .filter(route => route.transport_mode_id === 1)
                  .reduce((acc, route) => acc + route.distance_km, 0);

              } else if (event.type === 'bike') {
                progress = relevantRoutes
                  .filter(route => route.transport_mode_id === 2)
                  .reduce((acc, route) => acc + route.distance_km, 0);
              }

              const progressPercentage = Math.min((progress / neededDistance) * 100, 100);
              progressMap[event.id] = progressPercentage;

              if (isUserAdded) {
                continue;
              }

              handleProgressUpdate(event, progressPercentage);

            }

            setProgressData(progressMap);
          } else {
            setError('events query/server error');
          }


        } else {
          setError('user_routes query/server error');
        }
      } catch (err) {
        setError('query/server error');
      }
    } else {
      navigate('/');
      setError('Token is required');
    }
    setLoading(false);
  };

  const calculateTrophyLevel = (value, thresholds) => {
    const levels = [
      { level: 5, color: 'gold' },
      { level: 4, color: 'silver' },
      { level: 3, color: 'bronze' },
      { level: 2, color: 'blue' },
      { level: 1, color: 'green' },
      { level: 0, color: 'grey' }
    ];

    for (let i = 0; i < thresholds.length; i++) {
      if (value >= thresholds[i]) {
        return {
          level: levels[i].level,
          color: levels[i].color,
          next: thresholds[i + 1] ? thresholds[i + 1] - value : 0,
        };
      }
    }

    return { level: 0, color: 'grey', next: thresholds[0] - value };
  };
  const runningTrophy = calculateTrophyLevel(runningDistance, [10, 20, 50, 75, 100]);
  const cyclingTrophy = calculateTrophyLevel(cyclingDistance, [10, 20, 50, 75, 100]);
  const walkingTrophy = calculateTrophyLevel(walkingDistance, [10, 20, 50, 75, 100]);
  const co2Trophy = calculateTrophyLevel(Co2Saved, [10, 20, 50, 75, 100]);
  const caloriesTrophy = calculateTrophyLevel(CaloriesBurned, [1000, 2000, 5000, 7500, 10000]);
  const moneyTrophy = calculateTrophyLevel(MoneySaved, [50, 100, 200, 500, 1000]);

  const defaultSections = [
    { id: 'co2', label: 'CO2 Saved', visible: true },
    { id: 'pln', label: 'PLN Saved', visible: true },
    { id: 'streak', label: 'Current Streak', visible: true },
    { id: 'Test', label: 'Test', visible: false },
    { id: 'Calendar', label: 'Calendar', visible: true },
    { id: 'Info', label: 'Info', visible: true },
    { id: 'Trophies', label: 'Stats', visible: true },
    // tu bedzie wiecej sekcji 
  ];

  const [sections, setSections] = useState(() => {
    const savedSections = localStorage.getItem('userSections');
    return savedSections ? JSON.parse(savedSections) : defaultSections;
  });

  useEffect(() => {
    localStorage.setItem('userSections', JSON.stringify(sections));
  }, [sections]);

  const toggleSectionVisibility1 = (id) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  };

  const handleProgressUpdate = async (event, progressPercentage) => {
    if (progressPercentage === 100) {
      try {
        const token = localStorage.getItem('authToken');
        const userId = jwtDecode(token).id;

        const response = await fetch(`http://localhost:5000/api/event/${event.id}/complete`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

      } catch (err) {
        console.error('error ', err);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  const trophyDetailsMap = {
    running: {
      title: '🏃‍♂️ Running',
      level: runningTrophy.level,
      detail: `Distance covered: ${runningDistance.toFixed(2)} km`,
      fact: 'Running improves cardiovascular and lung health.',
    },
    cycling: {
      title: '🚴‍♂️ Cycling',
      level: cyclingTrophy.level,
      detail: `Distance covered: ${cyclingDistance.toFixed(2)} km`,
      fact: 'Cycling is great exercise for the lower body.',
    },
    walking: {
      title: '🚴‍♂️ Walking',
      level: walkingTrophy.level,
      detail: `Distance covered: ${walkingDistance.toFixed(2)} km`,
      fact: 'Walking is great exercise for the lower body.',
    },
    co2: {
      title: '🌍 CO2 Savings',
      level: co2Trophy.level,
      detail: `CO2 saved: ${Co2Saved.toFixed(2)} kg`,
      fact: 'Reducing CO2 emissions helps slow climate change.',
    },
    calories: {
      title: '🔥 Calories Burned',
      level: caloriesTrophy.level,
      detail: `Calories burned: ${CaloriesBurned.toFixed(2)} kcal`,
      fact: 'Burning calories through exercise helps maintain a healthy weight.',
    },
    money: {
      title: '💸 Money Saved',
      level: moneyTrophy.level,
      detail: `Money saved: ${MoneySaved.toFixed(2)} PLN`,
      fact: 'Saving money by using eco-friendly transport options.',
    }
  };

  const handleTrophyClick = (trophyType) => {
    const content = trophyDetailsMap[trophyType];
    if (content) {
      setPopupContent(content);
      setPopupVisible(true);
    }
  };

  useEffect(() => {

    const handleClickOutside = (event) => {

    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupRef]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupVisible && popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupVisible]);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const calculateStreaks = (routes) => {
    const normalizeDate = (date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      return newDate;
    };

    const today = normalizeDate(new Date());

    const uniqueDates = Array.from(new Set(
      routes.map(route => normalizeDate(new Date(route.date)).toDateString())
    )).filter(dateStr => {
      const routeDate = new Date(dateStr);
      return routeDate <= today;
    });

    const sortedDates = uniqueDates
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b);

    let longestStreakCount = 0;
    let currentStreakCount = 0;
    let previousDate = null;

    sortedDates.forEach((date, index) => {
      if (previousDate === null) {
        currentStreakCount = 1;
      } else {
        const dayDifference = (date - previousDate) / (1000 * 60 * 60 * 24);

        if (dayDifference === 1) {
          currentStreakCount += 1;
        } else if (dayDifference > 1) {
          currentStreakCount = 1;
        }
      }

      longestStreakCount = Math.max(longestStreakCount, currentStreakCount);
      previousDate = date;

    });

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (sortedDates.length > 0) {
      const lastActivityDate = sortedDates[sortedDates.length - 1];
      const dayDifferenceWithYesterday = (yesterday - lastActivityDate) / (1000 * 60 * 60 * 24);
      const dayDifferenceWithToday = (today - lastActivityDate) / (1000 * 60 * 60 * 24);



      if (dayDifferenceWithYesterday >= 1 && dayDifferenceWithToday >= 1) {
        currentStreakCount = 0;
      }
    } else {
      currentStreakCount = 0;
    }

    setCurrentStreak(currentStreakCount);
    setLongestStreak(longestStreakCount);
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleTransportChange = (selectedMode) => {
    setTransportMode(selectedMode);
  };
  const totalCO2 = userRoutes.reduce((acc, route) => acc + route.CO2, 0);
  const totalMoney = userRoutes.reduce((acc, route) => acc + route.money, 0);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 30);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <BackGround>
      <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
        <div className='flex justify-start min-h-screeen items-center flex-col w-[1600px] max-w-[95%] justify-self-center  scrollbar-hide'>

          <Header user={user} theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
          <div className='CustomSM:contents flex justify-center w-full pr-[10px] pl-[10px] box-border mt-[5px]'>

            <UniqueEvents
              events={events}
              currentIndex={currentIndex}
              progressData={progressData}
              handleDotClick={handleDotClick}
            />

            <div className="absolute top-[40px] left-0 max-h-[90px]gap-[10px]">
              {showAdminButton && (
                <button onClick={() => navigate('/AdminPanel')} className="w-[100px] h-[40px] bg-white rounded text-black">
                  Admin
                </button>
              )}
            </div>

            {popupVisible1 && (
              <SettingsPopup
                sections={sections}
                toggleSectionVisibility1={toggleSectionVisibility1}
                onClose={() => setPopupVisible1(false)}
              />
            )}
          </div>

          <Overview
            totalThisWeek={totalThisWeek}
            totalThisMonth={totalThisMonth}
            totalThisYear={totalThisYear}
            sections={sections}
            totalCO2={totalCO2}
            earthImage={earthImage}
            totalMoney={totalMoney}
            handleMonthChange={handleMonthChange}
            handleTransportChange={handleTransportChange}
            month={month}
            year={year}
            transportMode={transportMode}
            userRoutes={userRoutes}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            meter={meter}
            runningDistance={runningDistance}
            cyclingDistance={cyclingDistance}
            walkingDistance={walkingDistance}
            Co2Saved={Co2Saved}
            CaloriesBurned={CaloriesBurned}
            MoneySaved={MoneySaved}
            handleTrophyClick={handleTrophyClick}
            notifications={notifications}
            notificationPopupVisible={notificationPopupVisible}
            popupRef={popupRef}
            currentNotificationIndex={currentNotificationIndex}
            setPopupVisible1={setPopupVisible1}
          />
          {popupVisible && (
            <div className="fixed justify-center items-center top-0 left-0 w-full h-full flex bg-black bg-opacity-60 z-50">
              <div className="animate-fadeIn p-[30px] bg-[#fff] rounded-[15px] w-[95%] max-w-[500px] h-[300px] text-center" ref={popupRef}>
                <p>{popupContent.title}</p>
                <p>Level: {popupContent.level}</p>
                <p>{popupContent.detail}</p>
                <p>{popupContent.fact}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </BackGround>


  );
};

export default UserAcc;
