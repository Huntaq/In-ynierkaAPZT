import React from 'react';

const ModalInfo = React.forwardRef(({ children }, ref) => {
  return (
    <>
      <div className="fixed justify-center items-center top-0 left-0 w-full h-full flex bg-black bg-opacity-60 z-50">
        <div className="animate-fadeIn p-[30px] bg-[#fff] rounded-[15px] w-[95%] max-w-[500px] h-[300px] text-center" ref={ref}>
          {children}
        </div>
      </div>
    </>
  );
});

export default ModalInfo;
