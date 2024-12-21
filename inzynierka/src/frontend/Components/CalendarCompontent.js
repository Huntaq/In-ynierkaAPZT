import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import { jwtDecode } from "jwt-decode";

const CalendarComponent = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dailyActivities, setDailyActivities] = useState([]);
    const [userRoutes, setUserRoutes] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.id;
                    const sessionKey = decodedToken.sessionKey;

                    const routesResponse = await fetch(`http://localhost:5000/api/users/${userId}/routes`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'sessionKey': sessionKey
                        },
                    });


                    if (routesResponse.ok) {
                        const routesData = await routesResponse.json();
                        setUserRoutes(routesData);
                    } else {
                    }
                } catch (err) {
                }
            } else {
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const activities = userRoutes.filter(route => {
            const routeDate = normalizeDate(new Date(route.date));
            return (
                routeDate.getDate() === selectedDate.getDate() &&
                routeDate.getMonth() === selectedDate.getMonth() &&
                routeDate.getFullYear() === selectedDate.getFullYear()
            );
        });
        setDailyActivities(activities);
    }, [selectedDate, userRoutes]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const activities = userRoutes.filter(route => {
            const routeDate = normalizeDate(new Date(route.date));
            return (
                routeDate.getDate() === date.getDate() &&
                routeDate.getMonth() === date.getMonth() &&
                routeDate.getFullYear() === date.getFullYear()
            );
        });
        setDailyActivities(activities);
        setIsModalOpen(true);
    };

    const normalizeDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const getTransportModeName = (id) => {
        switch (id) {
            case 1:
                return 'Running';
            case 2:
                return 'Bike';
            case 3:
                return 'Walking';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className='max-w-[95%] w-[600px]'>
            <div>
                <div className='justify-items-center CustomXXSM:text-[12px]'>
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        tileClassName={({ date }) => {
                            const isActiveDay = userRoutes.some(route => {
                                const routeDate = normalizeDate(new Date(route.date));
                                return (
                                    routeDate.toDateString() === date.toDateString()
                                );
                            });
                            return isActiveDay ? 'react-calendar__tile--highlighted' : null;
                        }}
                    />
                </div>

            </div>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Daily Activities"
                className="fixed bg-white z-50 w-[95%] max-w-[600px] h-auto p-[30px] rounded-[20px] top-[40%] left-[50%] translate-x-[-50%] translate-y-[-50%] "
                overlayClassName="fixed top-0 left-0 bg-black bg-opacity-60 w-full h-full"
            >
                <p className='text-[24px] mb-[15px]'>Activities on {selectedDate.toLocaleDateString()}</p>
                {dailyActivities.length > 0 ? (
                    <ul className='text-[18px] font-bold'>
                        {dailyActivities.map((activity, index) => (
                            <li key={index}>
                                {getTransportModeName(activity.transport_mode_id)} - {activity.distance_km} km // {activity.duration} // CO2: {activity.CO2} kg // kcal: {activity.kcal}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='text-[18px] font-bold'>No activity that day</p>
                )}
                <button className='bg-[#84D49D] text-white mt-[15px] w-[120px] h-[40px] rounded-[10px] hover:scale-105' onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default CalendarComponent;
