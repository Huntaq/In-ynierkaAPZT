import React from "react";



const UserModalAdmin = ({
    searchUsername,
    setSearchUsername,
    searchId,
    setSearchId,
    filteredUsers,
    isModalOpen,
    closeModal,
    openModal,
    actionType,
    confirmAction,
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
                                    className={`gender-cell ${user.gender === "M" ? "male" : "female"}`}
                                >
                                    {user.gender}
                                </td>
                                <td>{user.is_banned ? "Yes" : "No"}</td>
                                <td>{user.email_notifications ? "Enabled" : "Disabled"}</td>
                                <td>{user.push_notifications ? "Enabled" : "Disabled"}</td>
                                <td>
                                    {user.is_banned ? (
                                        <button onClick={() => openModal(user.id, "unban")}>Unban</button>
                                    ) : (
                                        <button onClick={() => openModal(user.id, "ban")}>Ban</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
						<p className="text-lg font-semibold mb-4">
							Are you Sure you want to do this?
						</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={confirmAction}
								className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
							>
								Confirm
							</button>
							<button
								onClick={closeModal}
								className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
            </div>
        </>
    );
};

export default UserModalAdmin;
