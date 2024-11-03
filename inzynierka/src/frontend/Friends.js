import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import "../css/friends.css"
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import UserProfileModal from './Components/UserProfileModal';
const Friends = () => {
    const [invitedFriends, setInvitedFriends] = useState([]);
    const [pendingFriends, setPendingFriends] = useState([]);
    const [acceptedFriends, setAcceptedFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleViewProfile = (userId) => {
        setSelectedUserId(userId);
    };

    const closeModal = () => {
        setSelectedUserId(null);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.id;
                    const sessionKey = decodedToken.sessionKey;


                    const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'sessionKey': sessionKey
                        },
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        setUser(userData[0]);
                        if (userData[0].is_banned === 1) {
                            navigate('/Banned');
                        }
                    } else {
                        localStorage.removeItem('authToken');
                        navigate('/');
                    }

                } catch (err) {
                    setError('Wystąpił błąd podczas pobierania danych');
                }
            } else {
                setError('Brak tokena uwierzytelniającego');
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);
    useEffect(() => {
        fetchFriendsData();
    }, [navigate]);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    const fetchFriendsData = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const sessionKey = decodedToken.sessionKey;
                const currentUserId = decodedToken.id;
                setUserId(currentUserId);


                const friendsResponse = await fetch(`http://localhost:5000/api/friends/${currentUserId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'sessionKey': sessionKey,
                    },
                });

                if (!friendsResponse.ok) {
                }

                const data = await friendsResponse.json();
                const invited = data.filter(friend => friend.user_id === currentUserId && friend.status !== 'accepted')
                    .map(friend => ({
                        ...friend,
                        username: friend.friend_username
                    }));

                const pending = data.filter(friend => friend.friend_id === currentUserId && friend.status !== 'accepted')
                    .map(friend => ({
                        ...friend,
                        username: friend.user_username
                    }));

                const accepted = data.filter(
                    friend => (friend.user_id === currentUserId || friend.friend_id === currentUserId) && friend.status === 'accepted'
                ).map(friend => ({
                    ...friend,
                    username: friend.user_id === currentUserId
                        ? friend.friend_username
                        : friend.user_username
                }));

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
    const handleRemove = async (friendId) => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('Brak tokenu autoryzacyjnego');
            return;
        }

        const decodedToken = jwtDecode(token);
        const sessionKey = decodedToken.sessionKey;

        try {
            const response = await fetch(`http://localhost:5000/api/friends/remove/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'sessionKey': sessionKey,
                },
                body: JSON.stringify({ friendId }),
            });

            if (response.ok) {
                await fetchFriendsData();
            } else {
                console.error('Nie udało się usunąć przyjaciela:', response.statusText);
            }
        } catch (error) {
            console.error('Błąd podczas próby usunięcia przyjaciela:', error);
        }
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
        const token = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:5000/api/friends/invite/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    friend_id: friendId,
                    status: 'pending',
                }),
            });

            if (response.ok) {
                const data = await response.json();
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
    <Header theme={theme} toggleTheme={toggleTheme} user={user} toggleSidebar={toggleSidebar} />
    <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    <div className='friends-content'>
        <h2 className='friends-title'>Friends List</h2>
        <div className='friends-search-bar'>
            <input
                type="text"
                placeholder="User Nickname"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='friends-search-input'
            />
            <button onClick={handleSearch} className='friends-search-button'>🔍</button>
        </div>

        {searchResults.length > 0 && (
            <div className='friends-search-results'>
                <h3 className='friends-search-results-title'>Search Results:</h3>
                <ul className='friends-results-list'>
                    {searchResults.map(user => (
                        <ul key={user.id} className='friends-result-item'>
                            <span className='friend-username'>{user.username}</span>
                            <button onClick={() => handleInvite(user.id)} className='friends-invite-button'>Invite</button>
                        </ul>
                    ))}
                </ul>
            </div>
        )}

        <h3 className='friends-subtitle'>Invited Friends:</h3>
        {invitedFriends.length > 0 ? (
            <ul className='friends-list'>
                {invitedFriends.map(friend => (
                    <ul key={`${friend.user_id}-${friend.friend_id}`} className='friends-item'>
                        <span className='friend-username'>{friend.friend_username}</span> &nbsp;{friend.status}&nbsp; - &nbsp;
                        <button onClick={() => handleRemove(friend.user_id === userId ? friend.friend_id : friend.user_id)} className='friends-remove-button'>Cancel Invite</button>
                    </ul>
                ))}
            </ul>
        ) : (
            <p>No invited friends.</p>
        )}

        <h3 className='friends-subtitle'>Friends Awaiting Response:</h3>
        {pendingFriends.length > 0 ? (
            <ul className='friends-pending-list'>
                {pendingFriends.map(friend => (
                    <ul key={`${friend.user_id}-${friend.id}`} className='friends-pending-item'>
                        <span className='friend-username'>{friend.user_username}</span>
                        <div className='friends-pending-actions'>
                            <button onClick={() => handleAccept(friend.user_id)} className='friends-accept-button'>Accept</button>
                            <button onClick={() => handleDecline(friend.user_id)} className='friends-decline-button'>Decline</button>
                        </div>
                    </ul>
                ))}
            </ul>
        ) : (
            <p>No friends awaiting response.</p>
        )}

<h3 className='friends-subtitle'>Friends:</h3>
            {acceptedFriends.length > 0 ? (
                <ul className='friends-accepted-list'>
                    {acceptedFriends.map(friend => {
                        const friendId = friend.user_id === userId ? friend.friend_id : friend.user_id;
                        return (
                            <ul key={`${friend.user_id}-${friend.friend_id}`} className='friends-accepted-item'>
                                <span className='friend-username'>{friend.user_id === userId ? friend.friend_username : friend.user_username}</span>&nbsp; - &nbsp;
                                <button onClick={() => handleRemove(friendId)} className='friends-remove-button'>Remove Friend</button>
                                <button onClick={() => handleViewProfile(friendId)} className='friends-remove-button'>View Profile</button>
                            </ul>
                        );
                    })}
                </ul>
            ) : (
                <p>No accepted friends.</p>
            )}

            {selectedUserId && (
                <UserProfileModal userId={selectedUserId} onClose={closeModal} />
            )}
        </div>
</div>
    );
};

export default Friends;