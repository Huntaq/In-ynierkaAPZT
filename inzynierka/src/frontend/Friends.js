import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
const Friends = () => {
    const [invitedFriends, setInvitedFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendsData = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.id;
                const sessionKey = decodedToken.sessionKey;

                const friendsResponse = await fetch(`http://localhost:5000/api/friends/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'sessionKey': sessionKey
                    },
                });

                if (friendsResponse.ok) {
                    const data = await friendsResponse.json();
                    
                    const invited = data.filter(friend => friend.user_id === userId );
                    const pending = data.filter(friend => friend.friend_id === userId );

                    setInvitedFriends(invited);
                    setPendingFriends(pending);
                } else {
                    console.error('Failed to fetch friends data');
                }
            } else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('cooldownTimestamp');
                localStorage.removeItem('userSections');
                navigate('/');
            }
        };

        fetchFriendsData();
    }, [navigate]);

    const handleAccept = (friendId) => {
        console.log(`Accepted invitation from ${friendId}`);
    };

    const handleDecline = (friendId) => {
        console.log(`Declined invitation from ${friendId}`);
    };

    return (
        <div className='container1'>
            <h2>Lista Przyjaciół</h2>
            
            <h3>Zaproszeni Przyjaciele:</h3>
            {invitedFriends.length > 0 ? (
                <ul>
                    {invitedFriends.map(friend => (
                        <li key={`${friend.friend_id}-${friend.status}`}>
                            {friend.friend_id} - Status: {friend.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak zaproszonych przyjaciół.</p>
            )}

            <h3>Znajomi w Oczekiwaniu na Odpowiedź:</h3>
            {pendingFriends.length > 0 ? (
                <ul>
                    {pendingFriends.map(friend => (
                        <li key={`${friend.user_id}-${friend.status}`}>
                            {friend.user_id} - Status: {friend.status}
                            <div>
                                <button onClick={() => handleAccept(friend.user_id)}>Akceptuj</button>
                                <button onClick={() => handleDecline(friend.user_id)}>Odmów</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak znajomych w oczekiwaniu na odpowiedź.</p>
            )}
        </div>
    );
};

export default Friends;
