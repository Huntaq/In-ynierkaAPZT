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
        <div className='settings-popup'>
            <div className='settings-popup-content' ref={popupRef}>
                {sections.map((section) => (
                    <div key={section.id}>
                        <input
                            type='checkbox'
                            checked={section.visible}
                            onChange={() => toggleSectionVisibility1(section.id)}
                        />
                        {section.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SettingsPopup;
