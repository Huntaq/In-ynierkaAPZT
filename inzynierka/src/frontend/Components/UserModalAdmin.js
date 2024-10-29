import React from "react";



const UserModalAdmin = ({
    searchUsername,
    setSearchUsername,
    searchId,
    setSearchId,
    filteredUsers,
    banUser,
    unbanUser,
}) => {
    return (
        <>
        <div className="row AdminModal">
				<div className="search-container">
					<input
						type="text"
						placeholder="Username"
						value={searchUsername}
						onChange={(e) => setSearchUsername(e.target.value)}
						className="search-input"
					/>
					<input
						type="text"
						placeholder="ID"
						value={searchId}
						onChange={(e) => setSearchId(e.target.value)}
						className="search-input"
					/>
				</div>
			</div>
            <div className="admin-table-container inline" id="access-to-users">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Banned</th>
                        <th>Email Notifications</th>
                        <th>Push Notifications</th>
                        <th>Bans</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.age}</td>
                            <td
                                className={`gender-cell ${user.gender === "M" ? "male" : "female"
                                    }`}>
                                {user.gender}
                            </td>
                            <td>{user.is_banned ? "Yes" : "No"}</td>
                            <td>{user.email_notifications ? "Enabled" : "Disabled"}</td>
                            <td>{user.push_notifications ? "Enabled" : "Disabled"}</td>
                            <td>
                        {user.is_banned ? (
                            <button onClick={() => unbanUser(user.id)}>Unban</button>
                        ) : (
                            <button onClick={() => banUser(user.id)}>Ban</button>
                        )}
                    </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default UserModalAdmin;
