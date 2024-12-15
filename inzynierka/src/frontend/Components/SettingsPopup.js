import React, { useEffect, useRef } from 'react';

const SettingsPopup = ({ sections, toggleSectionVisibility1, onClose }) => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex bg-white p-[15px] rounded-lg w-[550px] justify-center gap-10" ref={popupRef}>
      
          <div className='w-[160px] justify-items-center'>
            <p className="font-medium mb-2 text-2xl">First Row</p>
            <div className="grid-cols-4 gap-4 mb-4">
              {sections.slice(0, 3).map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleSectionVisibility1(section.id)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className='font-medium text-xl'>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
      
          <div className='w-[140px] justify-items-center'>
            <p className="font-medium mb-2 text-2xl">Second Row</p>
            <div className="grid-cols-2 gap-4 mb-4">
              {sections.slice(3, 5).map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleSectionVisibility1(section.id)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  />
                  <span className='font-medium text-xl'>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
      
          <div className='w-[140px] justify-items-center'>
            <p className="font-medium mb-2 text-2xl">Third Row</p>
            <div className="grid-cols-2 gap-4">
              {sections.slice(5).map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleSectionVisibility1(section.id)}
                    className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                  />
                  <span className='font-medium text-xl'>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    );
};

export default SettingsPopup;
