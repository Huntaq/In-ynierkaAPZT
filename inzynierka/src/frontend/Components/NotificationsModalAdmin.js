import React from "react";



const NotificationsModalAdmin = ({
    notifications_popup,
    notificationHeader,
    setNotificationHeader,
    notificationContent,
    setNotificationContent,
    handleNotificationSubmit,
    handleDeleteNotification
}) => {
    return (
        <>
        <div className="row AdminModal">
				<div className="row"></div>
				<div className="admin-table-container inline" id="create-notifications">
					<table className="admin-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Header</th>
								<th>Content</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{notifications_popup.map((notification) => (
								<tr key={notification.id}>
									<td>{notification.id}</td>
									<td>{notification.header}</td>
									<td>
										{notification.content.length > 50
											? `${notification.content.slice(0, 150)}...`
											: notification.content}
									</td>
									<td>
										<button
											onClick={() => handleDeleteNotification(notification.id)}>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="row AdminModal">
				<div className="notification-form">
					<input
						type="text"
						value={notificationHeader}
						onChange={(e) => setNotificationHeader(e.target.value)}
						placeholder="Enter notification header"
					/>
					<textarea
						value={notificationContent}
						onChange={(e) => setNotificationContent(e.target.value)}
						placeholder="Enter notification content"
					/>
					<button onClick={handleNotificationSubmit} className="button">
						Send
					</button>
				</div>
			</div>
        </>
    );
};

export default NotificationsModalAdmin;
