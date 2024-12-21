import React, { useEffect, useState, useRef } from 'react';
import '../css/stats.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import TrophyList from './Components/TrophyList';
import { useNavigate } from 'react-router-dom';
import BackGround from './Components/BackGround';
import ModalInfo from './Components/ModalInfo';

const Trophies = () => {
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
  const [user, setUser] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const popupRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [EventsOpen, setEventsOpen] = useState(true);
  const navigate = useNavigate();

  const getTrophyLevel = (distance , thresholds) => {
    if (distance >= thresholds[4]) return { level: 5,  next: 0 };
    if (distance >= thresholds[3]) return { level: 4,  next: thresholds[4] - distance };
    if (distance >= thresholds[2]) return { level: 3,  next: thresholds[3] - distance };
    if (distance >= thresholds[1]) return { level: 2,  next: thresholds[2] - distance };
    if (distance >= thresholds[0]) return { level: 1, next: thresholds[1] - distance };
    return { level: 0, next: thresholds[0] - distance };
  };

  const getTrophyLevelForStats = (value, thresholds) => {
    if (value >= thresholds[4]) return { level: 5,  next: 0 };
    if (value >= thresholds[3]) return { level: 4,  next: thresholds[4] - value };
    if (value >= thresholds[2]) return { level: 3,  next: thresholds[3] - value };
    if (value >= thresholds[1]) return { level: 2,  next: thresholds[2] - value };
    if (value >= thresholds[0]) return { level: 1,  next: thresholds[1] - value };
    return { level: 0, next: thresholds[0] - value };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          const sessionKey = decodedToken.sessionKey;

          const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData[0]);

            if (userData[0].is_banned === 1) {
              navigate('/Banned');
            }
            const routesResponse = await fetch(`http://localhost:5000/api/users/${id}/routes`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey
              },
            });

            if (routesResponse.ok) {
              const routesData = await routesResponse.json();

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
            } else {
              localStorage.removeItem('authToken');
              navigate('/');
            }
            const eventsResponse = await fetch(`http://localhost:5000/api/event/thropies/${id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey,
              },
            });

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              const filteredEvents = eventsData.filter(event => {
                const userIdsArray = event.user_ids ? event.user_ids.split(',').map(id => parseInt(id, 10)) : [];
                return userIdsArray.includes(id);
              });

              setEvents(filteredEvents);
            } else {
              setError('events query/server error');
            }
          } else {
            setError('user info query/server error');
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

    fetchUserData();
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleTrophyEventClick = (event) => {
    setSelectedEvent(event);
  };
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };

  const runningTrophy = getTrophyLevel(runningDistance, [15, 50, 150, 350, 500]);
  const cyclingTrophy = getTrophyLevel(cyclingDistance, [15, 50, 150, 350, 500]);
  const walkingTrophy = getTrophyLevel(walkingDistance, [15, 50, 150, 350, 500]);

  const co2Trophy = getTrophyLevelForStats(Co2Saved, [10, 20, 50, 75, 100]);
  const caloriesTrophy = getTrophyLevelForStats(CaloriesBurned, [1000, 2000, 5000, 7500, 10000]);
  const moneyTrophy = getTrophyLevelForStats(MoneySaved, [50, 100, 200, 500, 1000]);

  const handleTrophyClick = (trophyType) => {
    let content;
    switch (trophyType) {
      case 'running':
        content = {
          title: 'Running',
          level: runningTrophy.level,
          detail: `Distance covered: ${runningDistance.toFixed(2)} km`,
          fact: runningTrophy.level < 5 ? `Next threshold: Level ${runningTrophy.level + 1}- ${runningTrophy.next.toFixed(2)} km left` : 'Amazing! You`ve conquered all levels!',
        };
        break;
      case 'walking':
        content = {
          title: 'Walking',
          level: walkingTrophy.level,
          detail: `Distance covered: ${walkingDistance.toFixed(2)} km`,
          fact: walkingTrophy.level < 5 ? `Next threshold: Level ${walkingTrophy.level + 1}; ${walkingTrophy.next.toFixed(2)} km left` : 'Congrats! You`ve completed all levels!',
        };
        break;
      case 'cycling':
        content = {
          title: 'Cycling',
          level: cyclingTrophy.level,
          detail: `Distance covered: ${cyclingDistance.toFixed(2)} km`,
          fact: cyclingTrophy.level < 5 ? `Next threshold: Level ${cyclingTrophy.level + 1}; ${cyclingTrophy.next.toFixed(2)} km left` : 'All levels finished! Great job!',
        };
        break;
      case 'co2':
        content = {
          title: 'CO2 Savings',
          level: co2Trophy.level,
          detail: `CO2 saved: ${Co2Saved.toFixed(2)} kg`,
          fact: co2Trophy.level < 5 ? `Next threshold: Level ${co2Trophy.level + 1}; ${co2Trophy.next.toFixed(0)} kg left` : 'Mission complete! All levels done!',
        };
        break;
      case 'calories':
        content = {
          title: 'Calories Burned',
          level: caloriesTrophy.level,
          detail: `Calories burned: ${CaloriesBurned.toFixed(2)} kcal`,
          fact: caloriesTrophy.level < 5 ? `Next threshold: Level ${caloriesTrophy.level + 1} - ${caloriesTrophy.next.toFixed(0)} kcal left` : 'Congrats! All levels achieved!',
        };
        break;
      case 'money':
        content = {
          title: 'Money Saved',
          level: moneyTrophy.level,
          detail: `Money saved: ${MoneySaved.toFixed(2)} PLN`,
          fact: moneyTrophy.level < 5 ? `Next threshold: Level ${moneyTrophy.level + 1}; ${moneyTrophy.next.toFixed(0)} money left` : 'You`re a master! All levels completed!',
        };
        break;
      default:
        content = {};
    }
    setPopupContent(content);
    setPopupVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        if (popupVisible) {
          setPopupVisible(false);
        }
        if (selectedEvent) {
          setSelectedEvent(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupVisible, selectedEvent]);

  function OpenEvents() {
    setEventsOpen(!EventsOpen);
  }

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (

    <BackGround>
      <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
        <div className=' flex justify-start min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center relative'>
          <Header
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />
          <div className='w-[170px] h-[40px] absolute top-[20px] left-1/2 -translate-x-1/2 CustomXXSM:top-[90px]'>
            <button onClick={OpenEvents} className='w-[170px] h-[40px] bg-[#84D49D] text-white rounded-[20px] hover:scale-105'>{EventsOpen ? 'Show event trophies' : 'Show level trophies'}</button>
          </div>
          {EventsOpen ? (
            <div className="">
              <TrophyList
                runningDistance={runningDistance}
                walkingDistance={walkingDistance}
                cyclingDistance={cyclingDistance}
                Co2Saved={Co2Saved}
                CaloriesBurned={CaloriesBurned}
                MoneySaved={MoneySaved}
                handleTrophyClick={handleTrophyClick}
                cyclingTrophy={cyclingTrophy}
                runningTrophy={runningTrophy}
                moneyTrophy={moneyTrophy}
                caloriesTrophy={caloriesTrophy}
                co2Trophy={co2Trophy}
                walkingTrophy={walkingTrophy}
              />
              
            </div>
          ) : (
            <div className="mt-[20px] ">
              {events.length > 0 && (
                <ul className="flex gap-[20px]">
                  {events.map(event => (
                    <li key={event.id} className=" hover:scale-105 hover:cursor-pointer" onClick={() => handleTrophyEventClick(event)}>
                      <div className='flex w-[350px] h-[150px] bg-white rounded-[12px]'>
                        <img className='w-[150px] h-[150px] rounded-[12px] shadow-[0px_4px_4px_rgba(11,14,52,0.20)]' src={`http://localhost:3000/uploads/${event.TrophyImage.split('/').pop()}`} alt={event.title} />
                        <div className='justify-items-center m-auto p-[10px]'>
                          <p className='font-semibold text-center content-center'>{event.title}</p>
                          <p className='font-500 text-center content-center'>{event.description}</p>
                          <button className='w-[130px] h-[40px] bg-[#84D49D] text-white rounded-[20px] mt-[10px]'>Achived!</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {selectedEvent && (
                <ModalInfo ref={popupRef} >
                  <div className=''><p className='font-medium text-center text-xl'>Congratulations!</p></div>
                  <div className=''><p>Trophy earned by competing in</p></div>
                  <div className=''><p className='text-2xl'>{selectedEvent.title} Event</p></div>
                </ModalInfo>
              )}
            </div>
          )}


          {popupVisible && (
            <ModalInfo ref={popupRef}>
              <p className='font-medium text-xl'>{popupContent.title}</p>
              <img src='./imagesTrophy/trophy-modal.svg' className='mt-4 mb-2 h-auto w-[260px] justify-self-center'/>
              <p className='font-medium text-2xl'>Level: {popupContent.level}</p>
              <p className='font-normal text-xl'>{popupContent.detail}</p>
              <p className='font-normal text-xl'>{popupContent.fact}</p>
            </ModalInfo>
          )}
        </div>
      </div>
    </BackGround>



  );
};

export default Trophies;
