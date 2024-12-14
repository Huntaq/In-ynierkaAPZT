import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import SidebarAdmin from './Components/SidebarAdmin';
import "../css/adminPanel.css";
import UserModalAdmin from "./Components/UserModalAdmin";
import EventsModalAdmin from "./Components/EventsModalAdmin";
import NotificationsModalAdmin from "./Components/NotificationsModalAdmin";
import OverviewModalAdmin from "./Components/OverviewModalAdmin";

const AdminPanel = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [users, setUsers] = useState([]);
	const [searchUsername, setSearchUsername] = useState("");
	const [searchId, setSearchId] = useState("");
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [notificationContent, setNotificationContent] = useState("");
	const [notificationHeader, setNotificationHeader] = useState("");
	const [notifications_popup, setNotifications_popup] = useState([]);
	const [eventTitle, setEventTitle] = useState("");
	const [eventDescription, setEventDescription] = useState("");
	const [eventType, setEventType] = useState("bike");
	const [eventDistance, setEventDistance] = useState("");
	const [events, setEvents] = useState([]);
	const [eventsError] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [eventImage, setEventImage] = useState(null);
	const [showEvent, setShowEvent] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeModal, setActiveModal] = useState('');
	const [currentStep, setCurrentStep] = useState(1);
	const [trophyImage, setTrophyImage] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [actionType, setActionType] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const token = localStorage.getItem("authToken");
			if (token) {
				try {
					const decodedToken = jwtDecode(token);
					const userId = decodedToken.id;
					const sessionKey = decodedToken.sessionKey;
					if (decodedToken.Admin !== 1) {
						localStorage.removeItem("authToken");
						localStorage.removeItem("cooldownTimestamp");
						navigate("/");
						return;
					}

					const usersData = await fetchAllUsers(token, sessionKey, userId);
					setUsers(usersData);
					setFilteredUsers(usersData);

					const notificationsData = await fetchNotifications(token, sessionKey);
					setNotifications_popup(notificationsData);

					const eventsData = await fetchEvents(token, sessionKey);
					setEvents(eventsData);

				} catch (err) {
					setError(err.message);
				}
			} else {
				setError("Brak tokena uwierzytelniającego");
			}
			setLoading(false);
		};
		fetchData();
	}, [navigate]);

	const fetchAllUsers = async (token, sessionKey, userId) => {
		try {
			const allUsersResponse = await fetch(`http://localhost:5000/api/users/${userId}/admin`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					sessionKey: sessionKey,
				},
			});

			if (allUsersResponse.ok) {
				const usersData = await allUsersResponse.json();
				return usersData;
			} else if (allUsersResponse.status === 403) {
				localStorage.removeItem('authToken');
				navigate('/');
			} else {
				throw new Error("Błąd podczas pobierania listy użytkowników");
			}
		} catch (err) {
			console.error(err);
			throw new Error("Wystąpił błąd podczas pobierania listy użytkowników");
		}
	};

	const fetchNotifications = async (token, sessionKey) => {
		try {
			const notificationsResponse = await fetch("http://localhost:5000/api/notifications/popup", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					sessionKey: sessionKey,
				},
			});

			if (notificationsResponse.ok) {
				const notificationsData = await notificationsResponse.json();
				return notificationsData;
			} else {
				throw new Error("Błąd podczas pobierania powiadomień");
			}
		} catch (err) {
			throw new Error("Wystąpił błąd podczas pobierania powiadomień");
		}
	};

	const fetchEvents = async (token, sessionKey) => {
		try {
			const eventsResponse = await fetch("http://localhost:5000/api/event", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					sessionKey: sessionKey,
				},
			});

			if (eventsResponse.ok) {
				const eventsData = await eventsResponse.json();
				return eventsData;
			} else {
				throw new Error("Błąd podczas pobierania wydarzeń");
			}
		} catch (err) {
			throw new Error("Wystąpił błąd podczas pobierania wydarzeń");
		}
	};
	useEffect(() => {
		const filtered = users.filter(
			(user) =>
				(searchUsername
					? user.username.toLowerCase().includes(searchUsername.toLowerCase())
					: true) && (searchId ? user.id.toString().includes(searchId) : true)
		);
		setFilteredUsers(filtered);
	}, [searchUsername, searchId, users]);

	const handleNotificationSubmit = async () => {
		const token = localStorage.getItem("authToken");

		if (!notificationHeader.trim() || !notificationContent.trim()) {
			alert("Both header and content are required.");
			return;
		}

		if (token) {
			try {
				const response = await fetch(
					"http://localhost:5000/api/notifications",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							content: notificationContent,
							header: notificationHeader,
						}),
					}
				);


				if (response.ok) {
					const notificationsData = await fetchNotifications(token);
					setNotifications_popup(notificationsData);
					setNotificationContent("");
					setNotificationHeader("");
				} else {
					alert("Error sending notification");
				}
			} catch (error) {
				console.error("Error sending notification:", error);
				alert("Error sending notification");
			}
		}
	};
	const handleDeleteNotification = async (id) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			try {
				const response = await fetch(
					`http://localhost:5000/api/notifications/popup/${id}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (response.ok) {
					setNotifications_popup(
						notifications_popup.filter((notification) => notification.id !== id)
					);
				} else {
					alert("Error deleting notification");
				}
			} catch (error) {
				console.error("Error deleting notification:", error);
				alert("Error deleting notification");
			}
		}
	};

	const handleEventSubmit = async () => {
		const token = localStorage.getItem("authToken");

		if (
			!eventTitle.trim() ||
			!eventDescription.trim() ||
			!startDate ||
			!endDate ||
			!eventDistance ||
			!eventImage ||
			!trophyImage
		) {
			alert("All fields are required.");
			return;
		}

		const formData = new FormData();
		formData.append("title", eventTitle);
		formData.append("description", eventDescription);
		formData.append("startDate", startDate);
		formData.append("endDate", endDate);
		formData.append("type", eventType);
		formData.append("distance", eventDistance);
		formData.append("image", eventImage);
		formData.append("trophyImage", trophyImage);

		if (token) {
			try {
				const response = await fetch("http://localhost:5000/api/event", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});

				if (response.ok) {
					alert("Event created successfully");
					setEventTitle("");
					setEventDescription("");
					setStartDate("");
					setEndDate("");
					setEventDistance("");
					setEventImage(null);
					setTrophyImage(null);
					const updatedEvents = await fetchEvents(token);
					setEvents(updatedEvents);
				} else {
					console.error("Failed to create event");
					alert("Failed to create event");
				}
			} catch (error) {
				console.error("Error creating event:", error);
				alert("Error creating event");
			}
		}
	};

	const handleToggleEventStatus = async (eventId, currentStatus) => {
		const token = localStorage.getItem("authToken");
		const newStatus = currentStatus === "active" ? "inactive" : "active";

		if (token) {
			try {
				const response = await fetch(
					`http://localhost:5000/api/event/${eventId}/status`,
					{
						method: "PATCH",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ status: newStatus }),
					}
				);

				if (response.ok) {
					setEvents(
						events.map((event) =>
							event.id === eventId ? { ...event, status: newStatus } : event
						)
					);
				} else {
					alert("Error updating event status");
				}
			} catch (error) {
				console.error("Error updating event status:", error);
				alert("Error updating event status");
			}
		}
	};

	const handleDeleteEvent = async (eventId) => {
		const token = localStorage.getItem("authToken");
		if (token) {
			try {
				const response = await fetch(
					`http://localhost:5000/api/event/${eventId}`,
					{
						method: "DELETE",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (response.ok) {
					setEvents(events.filter((event) => event.id !== eventId));
				} else {
					alert("Error deleting event");
				}
			} catch (error) {
				console.error("Error deleting event:", error);
				alert("Error deleting event");
			}
		}
	};

	const openModal = (userId, action) => {
		setSelectedUserId(userId);
		setActionType(action);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setSelectedUserId(null);
		setActionType(null);
		setIsModalOpen(false);
	};

	const confirmAction = async () => {
		if (actionType === "ban") {
			await banUser(selectedUserId);
		} else if (actionType === "unban") {
			await unbanUser(selectedUserId);
		}
		closeModal();
	};

	const banUser = async (userId) => {
		const token = localStorage.getItem("authToken");

		if (token) {
			try {
				const response = await fetch(
					`http://localhost:5000/api/ban/ban/${userId}`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (response.ok) {
					const decodedToken = jwtDecode(token);
					const userId = decodedToken.id;
					const sessionKey = decodedToken.sessionKey;
					const updatedBans = await fetchAllUsers(token, sessionKey, userId);
					setUsers(updatedBans);
				} else {
					alert("Error Banning user");
				}
			} catch (error) {
				console.error("Error Banning user:", error);
				alert("Error Banning user");
			}
		}
	};

	const unbanUser = async (userId) => {
		const token = localStorage.getItem("authToken");

		if (token) {
			try {
				const response = await fetch(
					`http://localhost:5000/api/ban/unban/${userId}`,
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					}
				);

				if (response.ok) {
					const decodedToken = jwtDecode(token);
					const sessionKey = decodedToken.sessionKey;
					const updatedBans = await fetchAllUsers(
						token,
						sessionKey,
						decodedToken.id
					);
					setUsers(updatedBans);
				} else {
					alert("Error Unbanning user");
				}
			} catch (error) {
				console.error("Error Unbanning user:", error);
				alert("Error Unbanning user");
			}
		}
	};

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};
	const toggleModal = (modal) => {
		setActiveModal(modal);
	};
	if (loading) return <p>Ładowanie...</p>;
	if (error) return <p>{error}</p>;

	return (
		<div className='flex justify-start h-screen min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
			<SidebarAdmin isOpen={sidebarOpen} toggleSidebar={toggleSidebar} toggleModal={toggleModal} />
			<div className="row">
				<button className="button btncos" onClick={toggleSidebar}>☰</button>
				<button onClick={() => navigate("/UserAcc")} className="button">
					Back to User Account
				</button>

			</div>
			{activeModal === 'events' && (
				<EventsModalAdmin
					actionType={actionType}
					trophyImage={trophyImage}
					setTrophyImage={setTrophyImage}
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
					searchUsername={searchUsername}
					setSearchUsername={setSearchUsername}
					searchId={searchId}
					setSearchId={setSearchId}
					filteredUsers={filteredUsers}
					banUser={banUser}
					unbanUser={unbanUser}
					showEvent={showEvent}
					setShowEvent={setShowEvent}
					eventTitle={eventTitle}
					setEventTitle={setEventTitle}
					eventDescription={eventDescription}
					setEventDescription={setEventDescription}
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
					eventType={eventType}
					setEventType={setEventType}
					eventDistance={eventDistance}
					setEventDistance={setEventDistance}
					eventImage={eventImage}
					setEventImage={setEventImage}
					handleEventSubmit={handleEventSubmit}
					events={events}
					handleToggleEventStatus={handleToggleEventStatus}
					handleDeleteEvent={handleDeleteEvent}
					eventsError={eventsError}
				/>
			)}
			{activeModal === 'users' && (
				<UserModalAdmin
					confirmAction={confirmAction}
					isModalOpen={isModalOpen}
					closeModal={closeModal}
					searchUsername={searchUsername}
					setSearchUsername={setSearchUsername}
					searchId={searchId}
					setSearchId={setSearchId}
					filteredUsers={filteredUsers}
					banUser={banUser}
					unbanUser={unbanUser}
					openModal={openModal}
				/>
			)}
			{activeModal === 'overview' && (
				<OverviewModalAdmin />
			)}
			{activeModal === 'notifications' && (
				<NotificationsModalAdmin
					notifications_popup={notifications_popup}
					notificationHeader={notificationHeader}
					setNotificationHeader={setNotificationHeader}
					notificationContent={notificationContent}
					setNotificationContent={setNotificationContent}
					handleNotificationSubmit={handleNotificationSubmit}
					handleDeleteNotification={handleDeleteNotification}
				/>
			)}
		</div>
	);
};

export default AdminPanel;
