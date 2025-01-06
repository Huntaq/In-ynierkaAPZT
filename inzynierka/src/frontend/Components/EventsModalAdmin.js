import React, { useState } from "react";
import ModalInfo from "./ModalInfo";


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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const handleDateChange = (type, value) => {
		if (type === "start") {
			if (endDate && new Date(value) > new Date(endDate)) {
				alert("Start date cannot be later than end date.");
				return;
			}
			setStartDate(value);
		} else if (type === "end") {
			if (startDate && new Date(value) < new Date(startDate)) {
				alert("End date cannot be earlier than start date.");
				return;
			}
			setEndDate(value);
		}
	};

	const handleOpenModal = (event) => {
		setSelectedEvent(event);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedEvent(null);
	};

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
														onChange={(e) => handleDateChange("start", e.target.value)}
														className="inputAdmin"
													/>
													<input
														type="date"
														value={endDate}
														onChange={(e) => handleDateChange("end", e.target.value)}
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
													<option value="bike">Cycling</option>
													<option value="run">Running</option>
													<option value="walking">Walking</option>
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
									<div className="row ButtonRight1">
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
								<>
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
										</div>

									</div>
									<div className="row ButtonRight">
										<button
											onClick={() => setCurrentStep(1)}
											className="button-next"
										>
											Previous
										</button>
										<button
											onClick={() => setCurrentStep(3)}
											className="button-next"
										>
											Next
										</button>
									</div>
								</>
							)}

							{currentStep === 3 && (
								<>
									<div className="row FormAdmin">
										<div className="row">
											<p>Event Preview</p>
											<p>Trophy Preview</p>
										</div>
										<div className="row">
											<div className="unique-event-item">
												<img
													className="unique-event-background w-[400px] h-auto max-h-[200px]"
													src={
														eventImage
															?
															URL.createObjectURL(eventImage)

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
											<div className="relative w-[150px] h-[150px] rounded-[50%] ">
												<img
													className="unique-event-background w-[150px] h-[150px] rounded-[50%]"
													src={
														trophyImage
															?
															URL.createObjectURL(trophyImage)

															: {}
													}
												/>
											</div>
										</div>

									</div>
									<div className="row ButtonRight">
										<button
											onClick={() => setCurrentStep(2)}
											className="button-next"
										>
											Previous
										</button>
										<button
											onClick={handleEventSubmit}
											className="button-next"
										>
											Create
										</button>
									</div>
								</>
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
								<th>Details</th>
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
									<td ><button className="w-[100px] h-[40px] bg-[#84D49D] text-white rounded-[20px] hover:scale-105" onClick={() => handleOpenModal(event)}>Details</button></td>
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


			{isModalOpen && selectedEvent && (
				<ModalInfo height={"auto"}>
					<h2 className="text-xl font-semibold mb-4">{selectedEvent.title}</h2>
					<div className="flex">
						<p><strong>Image:</strong></p>
						{selectedEvent.image && (
							<img
								src={`http://localhost:3000/uploads/${selectedEvent.image.split('/').pop()}`}
								alt={selectedEvent.title}
								className="event-image mb-4"
							/>
						)}
					</div>
					<div className="flex">
						<p><strong>Trophy:</strong></p>
						{selectedEvent.TrophyImage && (
							<img
								src={`http://localhost:3000/uploads/${selectedEvent.TrophyImage.split('/').pop()}`}
								alt={selectedEvent.TrophyImage}
								className="h-[160px] w-[160px] rounded-[4px] mb-4"
							/>
						)}
					</div>
					<p><strong>Status:</strong> {selectedEvent.status}</p>
					<p><strong>Event Id:</strong> {selectedEvent.id}</p>
					<p><strong>User IDs:</strong> {selectedEvent.user_ids.join(", ")}</p>
					<div className="flex justify-end mt-4">
						<button
							onClick={handleCloseModal}
							className="bg-[#84D49D] text-white font-medium px-4 py-2 rounded hover:bg-[#6E9B7B]"
						>
							Close
						</button>
					</div>
					<div>
					<button
						onClick={(e) => {
							e.preventDefault()
							handleDeleteEvent(selectedEvent.id)
							handleCloseModal()
						}}
					>Delete</button>	
					</div>	
					<div>
					<button
						onClick={(e) => {
							e.preventDefault()
							handleToggleEventStatus(selectedEvent.id , selectedEvent.status)
						}}
					>Activate</button>		
					</div>
					</ModalInfo>
			)}
		</>
	);
};

export default EventsModalAdmin;
