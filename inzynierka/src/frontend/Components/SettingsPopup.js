import React, { useEffect, useRef } from 'react';
import '../../css/SettingsPopup.css';

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
        <div className="flex bg-white p-[15px] rounded-lg w-[450px]" ref={popupRef}>
      
          <div className='w-[140px] justify-items-center'>
            <p className="font-semibold mb-2">First Row</p>
            <div className="grid-cols-4 gap-4 mb-4">
              {sections.slice(0, 4).map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleSectionVisibility1(section.id)}
                    className="mr-2"
                  />
                  <span>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
      
          <div className='w-[140px] justify-items-center'>
            <p className="font-semibold mb-2">Second Row</p>
            <div className="grid-cols-2 gap-4 mb-4">
              {sections.slice(4, 7).map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleSectionVisibility1(section.id)}
                    className="mr-2"
                  />
                  <span>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
      
          <div className='w-[140px] justify-items-center'>
            <p className="font-semibold mb-2">Third Row</p>
            <div className="grid-cols-2 gap-4">
              {sections.slice(7, 10).map((section) => (
                <div key={section.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={section.visible}
                    onChange={() => toggleSectionVisibility1(section.id)}
                    className="mr-2"
                  />
                  <span>{section.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    );
};

export default SettingsPopup;
