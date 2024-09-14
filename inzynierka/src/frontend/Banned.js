import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Banned = () => {
    const navigate = useNavigate();

    useEffect(() => {

        localStorage.removeItem('authToken');
        localStorage.removeItem('cooldownTimestamp');

    }, []);
    const GoHome =() => {
        navigate('/')
    }

    return (
        <div className='container1'>
            <div>
                <div className='background2 Banned'>
                    <div className='row BannedTitle'>
                        You have been banned
                    </div>
                    <div className='row Banned'>
                        <button className='button'onClick={GoHome}>Go Home</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banned;
