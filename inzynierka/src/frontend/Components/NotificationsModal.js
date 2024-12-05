export  default function Notifications({notifications,notificationPopupVisible,popupRef,currentNotificationIndex,handleX}){
    
    return(
        <>
        {notifications.length > 0 && (
            <>
              {/* ? */}
    
              <div className={` fixed  transition-all  ease-in-out rounded h-[30px]   top-0 left-0 w-full bg-[#4BD0FF] z-50 ${notificationPopupVisible ? 'visible' : 'invisible'}`} ref={popupRef}>
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