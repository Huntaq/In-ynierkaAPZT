import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {

  const [notificationPopupVisible, setNotificationPopupVisible] = useState(true);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');
    const showPopup = localStorage.getItem('showPopup') === 'true';

    if (showPopup) {
      const notificationsResponse = await fetch(`http://localhost:5000/api/notifications/popup`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);
        setNotificationPopupVisible(notificationsData.length > 0);
      } else {
        console.log('notification query/server error');
      }
    }
  };

  useEffect(() => {

    fetchUserData();

  }, [navigate]);

  function handleX(){
    setNotificationPopupVisible(false);
    localStorage.setItem('showPopup', 'false');
  }

  
  const showNextNotification = () => {
    setCurrentNotificationIndex((prevIndex) => (prevIndex + 1) % notifications.length);
  };

  useEffect(() => {
    const intervalId = setInterval(showNextNotification, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [notifications.length]);

  return (
    <>
      {notifications.length > 0 && (
        <>
          {/* ? */}

          <div className={` fixed  transition-all  ease-in-out  h-[30px] content-center  top-0 left-0 w-full bg-[#4BD0FF] z-50 ${notificationPopupVisible ? 'visible' : 'invisible'}`} ref={popupRef}>
            <div className='relative flex justify-center text-center'>
              <div className=' justify-self-center'>
                <p className='font-bold text-[16px] text-white uppercase'>{notifications[currentNotificationIndex]?.header} / </p>
              </div>
              <div className=' justify-self-center'>
                <p className='text-[16px] text-white'>&nbsp;{notifications[currentNotificationIndex]?.content}</p>
              </div>
              <p onClick={handleX} className='absolute right-[10px] text-white hover:scale-105 hover:cursor-pointer'>X</p>
            </div>
          </div>

          {/* ? */}
        </>
      )}
    </>
  );
};