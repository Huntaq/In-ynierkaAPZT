import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import "../css/friends.css"
const Friends = () => {
    const [invitedFriends, setInvitedFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetchFriendsData();
    }, [navigate]);

    const fetchFriendsData = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const sessionKey = decodedToken.sessionKey;
                const currentUserId = decodedToken.id;
                setUserId(currentUserId);


                const friendsResponse = await fetch(`http://localhost:5000/api/friends/${currentUserId}`, { // Używamy currentUserId
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'sessionKey': sessionKey,
                    },
                });

                if (!friendsResponse.ok) {
                }

                const data = await friendsResponse.json();

                const invited = data.filter(friend => friend.user_id === currentUserId && friend.status !== 'accepted');
                const pending = data.filter(friend => friend.friend_id === currentUserId && friend.status !== 'accepted');
                const accepted = data.filter(
                    friend => (friend.user_id === currentUserId || friend.friend_id === currentUserId) && friend.status === 'accepted'
                );

                setInvitedFriends(invited);
                setPendingFriends(pending);
                setAcceptedFriends(accepted);
            } catch (error) {
                console.error('Błąd podczas pobierania danych przyjaciół:', error);
                setError('Błąd podczas pobierania danych przyjaciół.');
            }
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('cooldownTimestamp');
            localStorage.removeItem('userSections');
            navigate('/');
        }
        setLoading(false);
    };
    const handleAccept = async (friendId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Brak tokenu autoryzacyjnego');
            return;
        }

        const decodedToken = jwtDecode(token);
        const sessionKey = decodedToken.sessionKey;

        try {
            const response = await fetch(`http://localhost:5000/api/friends/accept/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'sessionKey': sessionKey,
                },
                body: JSON.stringify({ friendId }),
            });

            if (response.ok) {
                const data = await response.json();

                await fetchFriendsData();
            } else {
                console.error('Nie udało się zmienić statusu zaproszenia:', response.statusText);
            }
        } catch (error) {
            console.error('Błąd podczas próby akceptacji zaproszenia:', error);
        }
    };

    const handleDecline = async (friendId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Brak tokenu autoryzacyjnego');
            return;
        }

        const decodedToken = jwtDecode(token);
        const sessionKey = decodedToken.sessionKey;

        try {
            const response = await fetch(`http://localhost:5000/api/friends/decline/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'sessionKey': sessionKey,
                },
                body: JSON.stringify({ friendId }),
            });

            if (response.ok) {
                const data = await response.json();

                await fetchFriendsData();
            } else {
                console.error('Nie udało się zmienić statusu zaproszenia:', response.statusText);
            }
        } catch (error) {
            console.error('Błąd podczas próby akceptacji zaproszenia:', error);
        }
    };

    const handleSearch = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Brak tokenu autoryzacyjnego');
            return;
        }

        const decodedToken = jwtDecode(token);
        const sessionKey = decodedToken.sessionKey;

        try {
            const response = await fetch(`http://localhost:5000/api/friends/allusers/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'sessionKey': sessionKey,
                },
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać użytkowników.');
            }

            const allUsers = await response.json();
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filteredUsers = allUsers.filter(user =>
                user.username.toLowerCase().includes(lowerCaseQuery)
            );

            setSearchResults(filteredUsers);
        } catch (error) {
            console.error('Błąd podczas wyszukiwania użytkowników:', error);
        }
    };

    if (loading) return <p>Ładowanie...</p>;
    if (error) return <p>Błąd: {error}</p>;
    const handleInvite = async (friendId) => {
        console.log(`Attempting to invite friend with ID: ${friendId} for user ID: ${userId}`);

        try {
            const response = await fetch(`http://localhost:5000/api/friends/invite/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friend_id: friendId,
                    status: 'pending',
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Invite sent:', data);
                await fetchFriendsData();
                setSearchResults(prevResults => prevResults.filter(user => user.id !== friendId));

            } else {
                console.error('Error sending invite:', response.statusText);
            }
        } catch (error) {
            console.error('Error inviting user:', error);
        }
    };
    
    return (
        <div className='friends-container'>
    <h2 className='friends-title'>Friends List</h2>
    <div className='search-bar'>
        <input
            type="text"
            placeholder="User Nickname"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input'
        />
        <button onClick={handleSearch} className='search-button'>🔍</button>
    </div>

    {searchResults.length > 0 && (
                <div className='search-results'>
                    <h3 className='search-results-title'>Search Results:</h3>
                    <ul className='results-list'>
                        {searchResults.map(user => (
                            <li key={user.id} className='result-item'>
                                {user.id} {user.username}
                                <button onClick={() => handleInvite(user.id)} className='invite-button'>Invite</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
    
    <h3 className='friends-subtitle'>Invited Friends:</h3>
    {invitedFriends.length > 0 ? (
        <ul className='friends-list'>
            {invitedFriends.map(friend => (
                <li key={`${friend.user_id}-${friend.friend_id}`} className='friend-item'>
                    {friend.friend_id} - Status: {friend.status}
                </li>
            ))}
        </ul>
    ) : (
        <p>No invited friends.</p>
    )}

    <h3 className='friends-subtitle'>Friends Awaiting Response:</h3>
    {pendingFriends.length > 0 ? (
        <ul className='pending-friends-list'>
            {pendingFriends.map(friend => (
                <li key={`${friend.user_id}-${friend.id}`} className='pending-friend-item'>
                    {friend.user_id} - Status: {friend.status}
                    <div className='pending-actions'>
                        <button onClick={() => handleAccept(friend.user_id)} className='accept-button'>Accept</button>
                        <button onClick={() => handleDecline(friend.user_id)} className='decline-button'>Decline</button>
                    </div>
                </li>
            ))}
        </ul>
    ) : (
        <p>No friends awaiting response.</p>
    )}

    <h3 className='friends-subtitle'>Friends:</h3>
    {acceptedFriends.length > 0 ? (
        <ul className='accepted-friends-list'>
            {acceptedFriends.map(friend => (
                <li key={`${friend.user_id}-${friend.friend_id}`} className='accepted-friend-item'>
                    {friend.user_id === userId ? friend.friend_id : friend.user_id} - Status: {friend.status}
                </li>
            ))}
        </ul>
    ) : (
        <p>No accepted friends.</p>
    )}
</div>
    );
};

export default Friends;
