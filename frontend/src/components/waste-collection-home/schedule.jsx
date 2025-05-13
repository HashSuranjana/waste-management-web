import React, {useState} from 'react'
import Calendar from "react-calendar";

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
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

    return (
        <div className="schedule-section">
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
        </div>
    )
}
export default Schedule
