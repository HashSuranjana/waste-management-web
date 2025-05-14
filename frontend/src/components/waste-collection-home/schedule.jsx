import React, { useState, useEffect } from 'react';
import Calendar from "react-calendar";
import { fetchSchedules, updateSchedule } from '../../utils/collections.js';
import { format } from 'date-fns';
import './schedule.css';

const Schedule = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const [editFormData, setEditFormData] = useState({
        location: '',
        date: '',
        time: '',
        status: '',
        wasteType: '',
        vehicleNumber: '',
        notes: ''
    });

    useEffect(() => {
        const loadSchedules = async () => {
            try {
                setLoading(true);
                const data = await fetchSchedules();
                setSchedules(data);
            } catch (error) {
                console.error('Error loading schedules:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSchedules();
    }, []);

    // Function to get schedules for a specific date
    const getSchedulesForDate = (date) => {
        return schedules.filter(schedule => {
            const scheduleDate = format(new Date(schedule.date), 'yyyy-MM-dd');
            const targetDate = format(date, 'yyyy-MM-dd');
            return scheduleDate === targetDate;
        });
    };

    // Function to get the status badge class
    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'completed';
            case 'in progress':
                return 'in-progress';
            case 'scheduled':
                return 'scheduled';
            default:
                return 'pending';
        }
    };

    // Handle edit button click
    const handleEditClick = (schedule) => {
        setEditingSchedule(schedule.id);
        setEditFormData({
            location: schedule.location || '',
            date: schedule.date || '',
            time: schedule.time || '',
            status: schedule.status || 'Scheduled',
            wasteType: schedule.wasteType || 'Mixed',
            vehicleNumber: schedule.vehicleNumber || '',
            notes: schedule.notes || ''
        });
    };

    // Handle edit form submission
    const handleEditSubmit = async (id) => {
        try {
            await updateSchedule(id, editFormData);
            // Update local state
            setSchedules(prev =>
                prev.map(schedule =>
                    schedule.id === id ? { ...schedule, ...editFormData } : schedule
                )
            );
            setEditingSchedule(null);
        } catch (error) {
            console.error('Error updating schedule:', error);
            alert('Failed to update schedule. Please try again.');
        }
    };

    // Handle edit form cancel
    const handleEditCancel = () => {
        setEditingSchedule(null);
        setEditFormData({
            location: '',
            date: '',
            time: '',
            status: '',
            wasteType: '',
            vehicleNumber: '',
            notes: ''
        });
    };

    return (
        <div className="schedule-section">
            <h2>Collection Schedule</h2>
            
            <div className="schedule-content">
                <div className="calendar-section">
                    <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        className="waste-calendar"
                        tileContent={({ date }) => {
                            const daySchedules = getSchedulesForDate(date);
                            return daySchedules.length > 0 ? (
                                <div className="calendar-tile-content">
                                    <div className="schedule-indicator">{daySchedules.length}</div>
                                </div>
                            ) : null;
                        }}
                    />
                </div>

                <div className="schedule-details">
                    <h3>Schedules for {format(selectedDate, 'MMMM d, yyyy')}</h3>
                    
                    {loading ? (
                        <div className="loading-message">Loading schedules...</div>
                    ) : (
                        <div className="schedule-list">
                            {getSchedulesForDate(selectedDate).length === 0 ? (
                                <div className="no-schedules-message">
                                    No collections scheduled for this date.
                                </div>
                            ) : (
                                getSchedulesForDate(selectedDate).map(schedule => (
                                    <div key={schedule.id} className="schedule-card">
                                        {editingSchedule === schedule.id ? (
                                            <div className="edit-form">
                                                <div className="form-group">
                                                    <label>Location:</label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.location}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            location: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Time:</label>
                                                    <input
                                                        type="time"
                                                        value={editFormData.time}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            time: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Status:</label>
                                                    <select
                                                        value={editFormData.status}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            status: e.target.value
                                                        })}
                                                    >
                                                        <option value="Scheduled">Scheduled</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Waste Type:</label>
                                                    <select
                                                        value={editFormData.wasteType}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            wasteType: e.target.value
                                                        })}
                                                    >
                                                        <option value="Mixed">Mixed</option>
                                                        <option value="Organic">Organic</option>
                                                        <option value="Recyclable">Recyclable</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Vehicle Number:</label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.vehicleNumber}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            vehicleNumber: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Notes:</label>
                                                    <textarea
                                                        value={editFormData.notes}
                                                        onChange={(e) => setEditFormData({
                                                            ...editFormData,
                                                            notes: e.target.value
                                                        })}
                                                    />
                                                </div>
                                                <div className="edit-actions">
                                                    <button 
                                                        className="action-btn save"
                                                        onClick={() => handleEditSubmit(schedule.id)}
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button 
                                                        className="action-btn cancel"
                                                        onClick={handleEditCancel}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="schedule-header">
                                                    <div className="schedule-time">{schedule.time}</div>
                                                    <span className={`status-badge ${getStatusBadgeClass(schedule.status)}`}>
                                                        {schedule.status}
                                                    </span>
                                                </div>
                                                <div className="schedule-details">
                                                    <h4>{schedule.wasteType || 'Regular Collection'}</h4>
                                                    <p><strong>Location:</strong> {schedule.location}</p>
                                                    <p><strong>Vehicle:</strong> {schedule.vehicleNumber || 'Not assigned'}</p>
                                                    {schedule.notes && <p><strong>Notes:</strong> {schedule.notes}</p>}
                                                </div>
                                                <div className="schedule-actions">
                                                    <button 
                                                        className="action-btn edit"
                                                        onClick={() => handleEditClick(schedule)}
                                                    >
                                                        Edit Schedule
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Schedule;
