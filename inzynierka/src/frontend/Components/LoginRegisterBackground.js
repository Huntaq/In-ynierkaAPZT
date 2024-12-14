import React from 'react';
import Logo from './img/earthLogo.png';


export default function LoginRegisterBackground({children}){
    return(
        <div className='grid grid-cols-2 CustomLogin:grid-cols-1 justify-start h-screen overflow-hidden'>
        <div className='flex items-center justify-center h-full CustomLogin:hidden'>
          <img
            src='./welcome-photo.jpg'
            alt='Welcome'
            className='object-cover w-full h-full' />
        </div>

        <div className='relative flex flex-col items-center justify-center w-full h-dvh bg-[#D9EDDF]'>

          <div className='flex absolute top-0 left-0 w-full p-6 justify-center gap-x-2'>
            <img src={Logo} alt='Earth' className='w-[40px] h-[40px]' />
            <h1 className='text-2xl font-bold content-center mb-6 text-[#3B4A3F] ' id='AppName'>
              EcoSphere
            </h1>
          </div>
          {children}
          </div>
      </div>
    );
}