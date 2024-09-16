import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

const OverviewModalAdmin = () => {
    const [userCount, setUserCount] = useState(0);
    const [newUserCount, setNewUserCount] = useState(0);
    const [activeEventsCount, setActiveEventsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const id = decodedToken.id;
                    const sessionKey = decodedToken.sessionKey;


                    const userResponse = await fetch(`http://localhost:5000/api/admin`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'sessionKey': sessionKey
                        },
                    });


                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUserCount(userData.userCount); 
                    } else {
                        console.error('Error fetching user data:', userResponse.status);
                    }


                 const newUserResponse = await fetch(`http://localhost:5000/api/admin/this-week`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'sessionKey': sessionKey
                        },
                    });

                    if (newUserResponse.ok) {
                        const newUserData = await newUserResponse.json();
                        setNewUserCount(newUserData.userCountThisWeek);
                    } else {
                        console.error('Error fetching new user data:', newUserResponse.status);
                    }

                    const activeEventsResponse = await fetch(`http://localhost:5000/api/admin/active-events`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'sessionKey': sessionKey
                        },
                    });

                    if (activeEventsResponse.ok) {
                        const activeEventsData = await activeEventsResponse.json();
                        setActiveEventsCount(activeEventsData.activeEventsCount);
                    } else {
                        console.error('Error fetching active events data:', activeEventsResponse.status);
                    }

                } catch (err) {
                    console.error('Error during fetch or token decode:', err);
                }
            } else {
                console.warn('No token found in localStorage');
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);
    return (
        <>
            <div className='row'>
                <div className='backgroundInfo'>
                    <p className='textStyleActivity'>Number of users</p>
                    <div className='AdminStats'>
                        <p className='Co2 inline'>{userCount}</p>
                    </div>
                </div>
                <div className='backgroundInfo'>
                    <p className='textStyleActivity'>New users (This Week)</p>
                    <div className='AdminStats'>
                        <p className='Co2 inline'>{newUserCount}</p>
                    </div>
                </div>
                <div className='backgroundInfo'>
                    <p className='textStyleActivity'>Active Events</p>
                    <div className='AdminStats'>
                        <p className='Co2 inline'>{activeEventsCount}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OverviewModalAdmin;
