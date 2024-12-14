import React from 'react';

const ModalInfo = React.forwardRef(({ children, height = '500px' }, ref) => {
  return (
    <>
      <div className="fixed justify-center items-center top-0 left-0 w-full h-full flex bg-black bg-opacity-60 z-50">
        <div className="animate-fadeIn p-[30px] bg-[#F1FCF3] rounded-[10px] w-[95%] max-w-[500px] text-center" ref={ref} style={{ height }}>
          {children}
        </div>
      </div>
    </>
  );
});

export default ModalInfo;
