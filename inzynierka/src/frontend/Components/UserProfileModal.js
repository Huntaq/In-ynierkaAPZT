import React, { useEffect, useState } from 'react';
import "../../css/UserProfileModal.css"
const UserProfileModal = ({ userId, onClose }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {

        fetchUserData();

    }, [userId]);

    const fetchUserData = async () => {
        const token = localStorage.getItem('authToken');

        try {

            const response = await fetch(`http://localhost:5000/api/friends/get/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error("Error fetching data:", response.statusText);
                return;
            }

            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    if (!userData) return null;

    return (
        <div className="modal-overlay-profile" onClick={onClose}>
            <div className="modal-content-profile" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-profile-title">User Profile</h2>

                {userData.profilePicture && (
                    <img
                        src={`http://localhost/uploads/${userData.profilePicture.split('/').pop()}`}
                        alt={`${userData.username}'s profile`}
                        className="modal-profile-picture"
                    />
                )}

                <p className="modal-profile-username">Username: {userData.username}</p>
                <p className="modal-profile-email">Email: {userData.email}</p>

                <div className="modal-profile-posts">
                    <h3 className="modal-profile-posts-title">User Posts</h3>
                    {userData.posts.length > 0 ? (
                        <ul className="modal-profile-posts-list">
                            {userData.posts.map(post => (
                                <li key={post.id} className="modal-profile-post-item">
                                    <p className="modal-profile-post-content">{post.content}</p>
                                    <p className="modal-profile-post-date">
                                        Created at: {new Date(post.created_at).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="modal-profile-no-posts">No posts available.</p>
                    )}
                </div>

                <button onClick={onClose} className="modal-profile-close-button">X</button>
            </div>
        </div>
    );
};

export default UserProfileModal;
