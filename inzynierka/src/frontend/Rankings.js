import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import first from './Components/img/ranking/1st.png';
import second from './Components/img/ranking/2nd.png';
import third from './Components/img/ranking/3rd.png';
import left from './Components/img/ranking/arrow left.svg';
import right from './Components/img/ranking/arrow right.svg';
import BackGround from './Components/BackGround';

const Rankings = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [rankingType, setRankingType] = useState('total_CO2');
  const navigate = useNavigate();
  const [userIndex, setUserIndex] = useState(-1);
  const [rankingChanged, setRankingChanged] = useState(false);

  useEffect(() => {
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
            if (userData[0].is_banned === 1) {
              navigate('/Banned');
            }
          } else {
            localStorage.removeItem('authToken');
            navigate('/');
          }

          const routesResponse = await fetch(`http://localhost:5000/api/users/${userId}/routes_with_usernames`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });

          if (routesResponse.ok) {
            const routesData = await routesResponse.json();
            setUserRoutes(routesData);
          } else {
            setError('Błąd podczas pobierania tras użytkownika');
          }

          const rankingResponse = await fetch(`http://localhost:5000/api/ranking/ranking`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });

          if (rankingResponse.ok) {
            const rankingData = await rankingResponse.json();

            const parsedRanking = rankingData.map(entry => ({
              user_id: entry.user_id,
              total_CO2: parseFloat(entry.total_CO2) || 0,
              total_kcal: parseFloat(entry.total_kcal) || 0,
              total_money: parseFloat(entry.total_money) || 0,
            }));

            setRanking(parsedRanking);

            const index = parsedRanking.findIndex(entry => entry.user_id === userId);

            setUserIndex(index);

          } else {
            setError('ranking query/server error');
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



  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };

  const formatValue = (value, type) => {
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : '0.00';
    switch (type) {
      case 'total_CO2':
        return `${formattedValue} KG`;
      case 'total_kcal':
        return `${formattedValue} Kcal`;
      case 'total_money':
        return `${formattedValue} PLN`;
      default:
        return formattedValue;
    }
  };

  const handleArrowClick = (direction) => {
    const rankingTypes = ['CO2', 'kcal', 'money'];
    let currentIndex = rankingTypes.indexOf(rankingType.replace('total_', ''));

    if (direction === 'next') {
      currentIndex = (currentIndex + 1) % rankingTypes.length;
    } else {
      currentIndex = (currentIndex - 1 + rankingTypes.length) % rankingTypes.length;
    }

    setRankingType(`total_${rankingTypes[currentIndex]}`);
    setRankingChanged(true);
  };

  const getRankingItems = (type) => {
    const sortedRanking = [...ranking].sort((a, b) => b[type] - a[type]);

    return sortedRanking.map((entry, index) => {
      const userData = usernameMap[entry.user_id] || { username: 'Unknown User', profilePicture: '' };
      const showImage = index < 3;

      const userClass = index < 3 ? 'text-[#3B4A3F] text-center relative ' : ' h-[45px] shadow-[0px_4px_4px_rgba(11,14,52,0.2)]  CustomXXSM:h-[40px] text-black w-full  mb-[10px] pr-[25px] pl-[25px] p-[5px] rounded-[15px] flex box-border bg-[#F1FCF3] gap-[10px]';

      let borderClass = '';
      if (index === 0) {
        borderClass = 'p-[5px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600';
      } else if (index === 1) {
        borderClass = 'p-[5px] bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500';
      } else if (index === 2) {
        borderClass = 'p-[5px] bg-gradient-to-r from-yellow-900 via-orange-700 to-yellow-800';
      }

      return (
        entry[type] !== undefined && (
          <ul key={entry.user_id} className={`${userClass} justify-between `}>
            {showImage && !userData.profilePicture && (
              <div className={` mb-[35px]  CustomXSM:w-[90px] CustomXSM:h-[90px] w-[130px] h-[130px] rounded-full flex items-center justify-center ${borderClass}`}>
                <span className=" text-[#3C4A3B]  text-[32px] bg-[#C6C6C6] w-full h-full rounded-full content-center font-bold">{userData.username.charAt(0).toUpperCase()}</span>
              </div>
            )}
            {showImage && userData.profilePicture && (
              <img
                src={`http://localhost:3000${userData.profilePicture}`}
                alt="Profile"
                className={`mb-[35px]  CustomXSM:w-[90px] CustomXSM:h-[90px] w-[130px] h-[130px] rounded-full ${borderClass}`}
              />
            )}
            {index === 0 && <img alt='first' className="absolute CustomXSM:top-[80px] CustomXSM:w-[30px] CustomXSM:h-[40px] top-[125px] w-[40px] h-[60px] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src={first} />}
            {index === 1 && <img alt='second' className="absolute CustomXSM:top-[80px] CustomXSM:w-[30px] CustomXSM:h-[40px] top-[125px] w-[40px] h-[60px] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src={second} />}
            {index === 2 && <img alt='third' className="absolute CustomXSM:top-[80px] CustomXSM:w-[30px] CustomXSM:h-[40px] top-[125px] w-[40px] h-[60px] left-1/2 transform -translate-x-1/2 -translate-y-1/2" src={third} />}
            {index >= 3 && <span className='font-bold text-[24px] content-center CustomXXSM:text-[16px] '>{index + 1} </span>}
            <span className=' content-center font-400 text-[20px] CustomXXSM:text-[14px]'>
              {userData.username.length > 12 ? userData.username.slice(0, 10) + '...' : userData.username}
            </span>
            <span className="block content-center CustomXXSM:text-[12px]">{formatValue(entry[type], rankingType)}</span>
          </ul>
        )
      );
    });
  };

  useEffect(() => {
    const sortedRanking = [...ranking].sort((a, b) => b[rankingType] - a[rankingType]);
    setRanking(sortedRanking);
    const index = sortedRanking.findIndex(entry => entry.user_id === user?.id);
    setUserIndex(index);
    setRankingChanged(false);
  }, [rankingType, rankingChanged, user]);


  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const usernameMap = userRoutes.reduce((map, route) => {
    map[route.user_id] = { username: route.username, profilePicture: route.profilePicture };
    return map;
  }, {});


  return (

    <BackGround>
      <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
        <div className='flex relative justify-start min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
          <Header user={user} theme={theme} toggleTheme={toggleTheme} />
          <div className='absolute top-[20px] font-bold m-[10px] text-[#3B4A3F] text-[16px] CustomRankingXS:top-[60px]'>
            Total {rankingType.split('_').slice(-1)[0]}
          </div>
          <div className="flex justify-between w-[600px] max-w-[98%] pt-[30px] CustomRankingXS:mt-[30px]">
            <div className="flex justify-start w-1/3">
              {getRankingItems(rankingType).slice(1, 2)}
            </div>
            <div className="flex justify-center w-1/3 relative">
              <div className="absolute top-[-40px]">
                {getRankingItems(rankingType).slice(0, 1)}
              </div>
            </div>
            <div className="flex justify-end w-1/3 relative">
              {getRankingItems(rankingType).slice(2, 3)}
            </div>
          </div>
          <div className='flex w-full justify-center max-h-[400px]'>
            <div className="flex w-[53px] h-[53px] self-center CustomXSM:mr-[10px] mr-[50px]">
              <button onClick={() => handleArrowClick('prev')}><img className='hover:scale-105' src={right} /></button>
            </div>
            <div className="w-[95%] max-w-[450px] overflow-y-scroll scrollbar-hide">
              <div>
                <div className='justify-between h-[45px] shadow-[0px_4px_4px_rgba(11,14,52,0.2)]  CustomXXSM:h-[40px] mt-[20px] text-black w-full  mb-[10px] p-[5px] rounded-[15px] flex box-border bg-[#84D49D] gap-[10px]'>
                  <p className='ml-[20px] font-bold text-[28px] content-center CustomXXSM:text-[12px]'>{userIndex === -1 ? '-' : userIndex + 1}</p>
                  <p className='content-center text-[24px] CustomXXSM:text-[12px] font-400'>{user.username}</p>
                  <span className="block content-center CustomXXSM:text-[12px] mr-[20px]">{formatValue(ranking[userIndex]?.[rankingType], rankingType)}</span>
                </div>
                <ul className=' CustomXXSM:text-[12px] '>
                  {getRankingItems(rankingType).slice(3, 100)}
                </ul>
              </div>
            </div>
            <div className='flex w-[53px] h-[53px] self-center ml-[50px] CustomXSM:ml-[10px]'>
              <button onClick={() => handleArrowClick('next')}><img className='hover:scale-105' src={left} /></button>
            </div>
          </div>
        </div>
      </div>
    </BackGround>

  );
};

export default Rankings;
