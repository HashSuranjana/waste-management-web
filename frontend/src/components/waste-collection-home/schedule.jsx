import React, {useState} from 'react'
import Calendar from "react-calendar";

const Schedule = () => {
    const [scheduleView, setScheduleView] = useState('calendar');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showTruckLocation, setShowTruckLocation] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);
    const [schedules, setSchedules] = useState([
        {
            id: 1,
            date: '2024-03-20',
            time: '09:00',
            location: 'Main Street Area',
            type: 'Regular Collection',
            status: 'Scheduled',
            vehicle: 'Truck-001',
            notes: 'Regular household waste collection'
        },
        {
            id: 2,
            date: '2024-03-21',
            time: '10:30',
            location: 'Downtown Area',
            type: 'Bulk Collection',
            status: 'Scheduled',
            vehicle: 'Truck-002',
            notes: 'Large item collection'
        }
    ]);

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        date: '',
        time: '',
        location: '',
        type: 'Regular Collection',
        vehicle: '',
        notes: ''
    });

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        const schedule = {
            id: schedules.length + 1,
            ...newSchedule,
            status: 'Scheduled'
        };
        setSchedules([...schedules, schedule]);
        setShowScheduleModal(false);
        setNewSchedule({
            date: '',
            time: '',
            location: '',
            type: 'Regular Collection',
            vehicle: '',
            notes: ''
        });
    };

    const handleTruckLocationClick = (vehicle) => {
        setSelectedTruck(vehicle);
        setShowTruckLocation(true);
    };

    return (
        <div className="schedule-section">
            <div className="section-header">
                <h2>Collection Schedule</h2>
                <div className="schedule-controls">
                    <div className="view-toggle">
                        <button
                            className={`toggle-btn ${scheduleView === 'calendar' ? 'active' : ''}`}
                            onClick={() => setScheduleView('calendar')}
                        >
                            Calendar View
                        </button>
                        <button
                            className={`toggle-btn ${scheduleView === 'list' ? 'active' : ''}`}
                            onClick={() => setScheduleView('list')}
                        >
                            List View
                        </button>
                    </div>
                    <button className="add-schedule-btn" onClick={() => setShowScheduleModal(true)}>
                        Add New Schedule
                    </button>
                </div>
            </div>

            {scheduleView === 'calendar' ? (
                <div className="calendar-view">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className="waste-calendar"
                    />
                    <div className="selected-date-schedules">
                        <h3>Schedules for {selectedDate.toLocaleDateString()}</h3>
                        <div className="schedule-list">
                            {schedules
                                .filter(schedule => schedule.date === selectedDate.toISOString().split('T')[0])
                                .map(schedule => (
                                    <div key={schedule.id} className="schedule-card">
                                        <div className="schedule-time">{schedule.time}</div>
                                        <div className="schedule-details">
                                            <h4>{schedule.type}</h4>
                                            <p><strong>Location:</strong> {schedule.location}</p>
                                            <p><strong>Vehicle:</strong> {schedule.vehicle}</p>
                                            <p><strong>Status:</strong> {schedule.status}</p>
                                            {schedule.notes && <p><strong>Notes:</strong> {schedule.notes}</p>}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="list-view">
                    <div className="schedule-filters">
                        <select
                            className="filter-select"
                            onChange={(e) => {
                                const filtered = e.target.value === 'all'
                                    ? schedules
                                    : schedules.filter(s => s.type === e.target.value);
                                setSchedules(filtered);
                            }}
                        >
                            <option value="all">All Types</option>
                            <option value="Regular Collection">Regular Collection</option>
                            <option value="Bulk Collection">Bulk Collection</option>
                            <option value="Special Collection">Special Collection</option>
                        </select>
                        <select
                            className="filter-select"
                            onChange={(e) => {
                                const filtered = e.target.value === 'all'
                                    ? schedules
                                    : schedules.filter(s => s.status === e.target.value);
                                setSchedules(filtered);
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="schedule-list">
                        {schedules.map(schedule => (
                            <div key={schedule.id} className="schedule-card">
                                <div className="schedule-header">
                                    <div className="schedule-date-time">
                                        <span className="date">{schedule.date}</span>
                                        <span className="time">{schedule.time}</span>
                                    </div>
                                    <span className={`status-badge ${schedule.status.toLowerCase()}`}>
                                                        {schedule.status}
                                                    </span>
                                </div>
                                <div className="schedule-details">
                                    <h4>{schedule.type}</h4>
                                    <p><strong>Location:</strong> {schedule.location}</p>
                                    <p><strong>Vehicle:</strong> {schedule.vehicle}</p>
                                    {schedule.notes && <p><strong>Notes:</strong> {schedule.notes}</p>}
                                </div>
                                <div className="schedule-actions">
                                    <button className="action-btn edit">Edit</button>
                                    <button className="action-btn delete">Cancel</button>
                                    <button
                                        className="action-btn location"
                                        onClick={() => handleTruckLocationClick(schedule.vehicle)}
                                    >
                                        Truck Live Location
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Schedule Modal */}
            {showScheduleModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Schedule</h3>
                        <form onSubmit={handleScheduleSubmit}>
                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={newSchedule.date}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="time">Time</label>
                                <input
                                    type="time"
                                    id="time"
                                    value={newSchedule.time}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="location">Location</label>
                                <input
                                    type="text"
                                    id="location"
                                    value={newSchedule.location}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, location: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="type">Collection Type</label>
                                <select
                                    id="type"
                                    value={newSchedule.type}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, type: e.target.value })}
                                    required
                                >
                                    <option value="Regular Collection">Regular Collection</option>
                                    <option value="Bulk Collection">Bulk Collection</option>
                                    <option value="Special Collection">Special Collection</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="vehicle">Vehicle</label>
                                <input
                                    type="text"
                                    id="vehicle"
                                    value={newSchedule.vehicle}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, vehicle: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    value={newSchedule.notes}
                                    onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Add Schedule</button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowScheduleModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Schedule
