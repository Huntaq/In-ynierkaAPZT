import React from "react";


const EventsModalAdmin = ({
	trophyImage,
	setTrophyImage,
	currentStep,
	setCurrentStep,
	showEvent,
	setShowEvent,
	eventTitle,
	setEventTitle,
	eventDescription,
	setEventDescription,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	eventType,
	setEventType,
	eventDistance,
	setEventDistance,
	eventImage,
	setEventImage,
	handleEventSubmit,
	events,
	handleToggleEventStatus,
	handleDeleteEvent,
	eventsError
}) => {
	return (
		<>
			<div className="row AdminModal ">
				{showEvent && (
					<>
						<div className="modal-overlay" onClick={() => setShowEvent(false)}></div>

						<div className="modalAdmin">
							<div className="row modal-header">
								<h3 className="modal-title">Create Event</h3>
								<div className="tabs">
									<button
										className={`tab ${currentStep === 1 ? 'active' : 'inactive'}`}
										onClick={() => setCurrentStep(1)}
									>
										Event details
									</button>
									<button
										className={`tab ${currentStep === 2 ? 'active' : 'inactive'}`}
										onClick={() => setCurrentStep(2)}
									>
										Event design
									</button>
									<button
										className={`tab ${currentStep === 3 ? 'active' : 'inactive'}`}
										onClick={() => setCurrentStep(3)}
									>
										Finish
									</button>
								</div>
								<button onClick={() => setShowEvent(false)} className="close-button">
									X
								</button>
							</div>



							{currentStep === 1 && (
								<>
								<div className="row FormAdmin">
									<div className="event-form">
										<div className="input-box">
										<div>
											<p>Title</p>
										</div>
										<input
											type="text"
											value={eventTitle}
											onChange={(e) => setEventTitle(e.target.value)}
											placeholder="Enter event title"
											className="input"
										/>
										</div>
										<div className="input-box">
										<div>
											<p>Description</p>
										</div>
										<textarea
											value={eventDescription}
											onChange={(e) => setEventDescription(e.target.value)}
											placeholder="Enter event description"
											className="textarea"
										/>
										</div>
										<div className="input-box">
										<div>
											<p>Duration</p>
										</div>
										<div className="InputAdmin">
										<input
											type="date"
											value={startDate}
											onChange={(e) => setStartDate(e.target.value)}
											className="inputAdmin"
										/>
										
										<input
											type="date"
											value={endDate}
											onChange={(e) => setEndDate(e.target.value)}
											className="inputAdmin"
										/>
										</div>
										</div>
										<div className="input-box">
										<div>
											<p>Type of activity</p>
										</div>
										<select
											value={eventType}
											onChange={(e) => setEventType(e.target.value)}
											className="input"
										>
											<option value="bike">Bike</option>
											<option value="run">Running</option>
										</select>
										</div>
										<div className="input-box">
										<div>
											<p>Distance</p>
										</div>
										<input
											type="number"
											value={eventDistance}
											onChange={(e) => setEventDistance(e.target.value)}
											placeholder="Enter distance in km"
											className="input"
										/>
										</div>
									</div>
								</div>
								<div className="row ButtonRight">
								<button
									onClick={() => setCurrentStep(2)}
									className="button-next"
								>
									Next
								</button>
							</div>
							</>
							)}

							{currentStep === 2 && (
								<div className="row FormAdmin">
									<div className="event-form">
										<div className="row">
											<p>Select event image:</p>
										</div>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => setEventImage(e.target.files[0])}
											className="input"
										/>
										<div className="row">
											<p>Select trophy image:</p>
										</div>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => setTrophyImage(e.target.files[0])}
											className="input"
										/>
										<div className="row">
											<button
												onClick={() => setCurrentStep(1)}
												className="button"
											>
												Back
											</button>
											<button
												onClick={() => setCurrentStep(3)}
												className="button"
											>
												Next
											</button>
										</div>
									</div>
								</div>
							)}

							{currentStep === 3 && (
								<div className="row FormAdmin">
									<div className="row">
										<p>Event Preview</p>
										<p>Trophy Preview</p>
									</div>
									<div className="row">
									<div className="unique-event-item">
										<div
											className="unique-event-background"
											style={
												eventImage
													? {
														backgroundImage: `url(${URL.createObjectURL(eventImage)})`,
													}
													: {}
											}
										/>
										<div className="unique-event-header">
											<h3 className="unique-event-title">
												{eventTitle || "Event Title"}
											</h3>
										</div>
										<div className="unique-event-footer">
										<p className="unique-event-description">
												{eventDescription || "Event description goes here."}
											</p>
										</div>
										
									</div>
									<div className="trophy-preview">
									<div
											className="unique-event-background"
											style={
												trophyImage
													? {
														backgroundImage: `url(${URL.createObjectURL(trophyImage)})`,
													}
													: {}
											}
										/>
									</div>
									</div>
									<div className="row FormAdmin">
										<button
											onClick={() => setCurrentStep(2)}
											className="button"
										>
											Back
										</button>
										<button onClick={handleEventSubmit} className="button">
											Create
										</button>
									</div>
								</div>
							)}
						</div>
					</>
				)}
			</div>



			<div className="row EventsTable AdminModal">
				<div className="row">
					<h3>Events</h3>
				</div>
				<div className="admin-table-container inline adminEvent">
					<table className="admin-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Title</th>
								<th>Description</th>
								<th>Start Date</th>
								<th>End Date</th>
								<th>Type</th>
								<th>Distance (km)</th>
								<th>Image</th>
								<th>Trophy</th>
								<th>Status</th>
								<th>User IDs</th>
								<th>Change Status</th>
								<th>Delete</th>
							</tr>
						</thead>
						<tbody>
							{[...events].reverse().map((event) => (
								<tr key={event.id}>
									<td>{event.id}</td>
									<td>{event.title}</td>
									<td>{event.description}</td>
									<td>{new Date(event.startDate).toLocaleDateString()}</td>
									<td>{new Date(event.endDate).toLocaleDateString()}</td>
									<td>{event.type}</td>
									<td>{event.distance}</td>
									<td>
										{event.image && (
											<img
												src={event.image}
												alt={event.title}
												className="event-image"
											/>
										)}
									</td>
									<td>
										{event.TrophyImage && (
											<img
												src={event.TrophyImage}
												alt={event.TrophyImage}
												className="event-image"
											/>
										)}
									</td>
									<td>{event.status}</td>
									<td>{event.user_ids.join(", ")}</td>
									<td>
										<button
											onClick={() =>
												handleToggleEventStatus(event.id, event.status)
											}>
											{event.status === "active" ? "Deactivate" : "Activate"}
										</button>
									</td>
									<td>
										<button onClick={() => handleDeleteEvent(event.id)}>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					{eventsError && <p>{eventsError}</p>}
				</div>

			</div>
			<div className="row AdminModal">
				<button onClick={() => setShowEvent(true)} className="button ">
					Create Event
				</button>
			</div>
		</>
	);
};

export default EventsModalAdmin;
