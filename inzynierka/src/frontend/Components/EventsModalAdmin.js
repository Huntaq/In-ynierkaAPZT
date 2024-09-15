import React from "react";



const EventsModalAdmin = ({
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
        <div className="row AdminModal">

				{showEvent && (
					<>
						<div
							className="modal-overlay"
							onClick={() => setShowEvent(false)}></div>{" "}

						<div className="modalAdmin">
							<div className="row" id="Modal">
								<h3>Create Event</h3>
							</div>
							<button
								onClick={() => setShowEvent(false)}
								className="close-button">
								Close
							</button>{" "}

							<div className="row">
								<div className="event-form">
									<input
										type="text"
										value={eventTitle}
										onChange={(e) => setEventTitle(e.target.value)}
										placeholder="Enter event title"
										className="input"
									/>
									<textarea
										value={eventDescription}
										onChange={(e) => setEventDescription(e.target.value)}
										placeholder="Enter event description"
										className="textarea"
									/>
									<div className="row">
										<p>Start Date</p>
									</div>
									<input
										type="date"
										value={startDate}
										onChange={(e) => setStartDate(e.target.value)}
										className="input"
									/>
									<div className="row">
										<p>End Date</p>
									</div>
									<input
										type="date"
										value={endDate}
										onChange={(e) => setEndDate(e.target.value)}
										className="input"
									/>
									<select
										value={eventType}
										onChange={(e) => setEventType(e.target.value)}
										className="input">
										<option value="bike">Bike</option>
										<option value="run">Running</option>
									</select>
									<input
										type="number"
										value={eventDistance}
										onChange={(e) => setEventDistance(e.target.value)}
										placeholder="Enter distance in km"
										className="input"
									/>

									<input
										type="file"
										accept="image/*"
										onChange={(e) => setEventImage(e.target.files[0])}
										className="input"
									/>
									<div className="row">
										<button onClick={handleEventSubmit} className="button">
											Create
										</button>
									</div>
								</div>
								<div className="row">Event Preview</div>
								<div className="event-preview unique-event-item">
									<div
										className="unique-event-background"
										style={
											eventImage
												? {
													backgroundImage: `url(${URL.createObjectURL(
														eventImage
													)})`,
												}
												: {}
										}
									/>
									<div className="unique-event-header">
										<h3 className="unique-event-title">
											{eventTitle || "Event Title"}
										</h3>
										<div className="progress-bar-container-wrapper">
											<p className="progress-label">Preview Progress</p>
											<div className="progress-bar-container">
												<div
													className="progress-bar1"
													style={{ width: "0%" }}
												/>
											</div>
										</div>
									</div>
									<div className="unique-event-content">
										<p className="unique-event-description">
											{eventDescription || "Event description goes here."}
										</p>
									</div>
									<div className="unique-event-footer">
										<p className="unique-event-date">
											<strong>Start Date:</strong> {startDate || "Not set"}
										</p>
										<p className="unique-event-date">
											<strong>End Date:</strong> {endDate || "Not set"}
										</p>
									</div>
								</div>
							</div>
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
