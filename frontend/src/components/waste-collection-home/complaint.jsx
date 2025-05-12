import React, {useEffect, useState} from 'react'
import {fetchComplaints, updateComplaint} from "../../utils/complaints.js";
import {format} from 'date-fns';

const Complaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [editingComplaint, setEditingComplaint] = useState(null);
    const [editComplaintData, setEditComplaintData] = useState({
        status: 0,
        reply: '',
        updated_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchComplaints();
            setComplaints(data);
        }
        loadData()
        console.log(complaints)
    }, []);

    const [complaintFilters, setComplaintFilters] = useState({
        category: 'all',
        status: 'all',
        date: ''
    });
    const getFilteredComplaints = () => {
        return complaints.filter(complaint => {
            const matchesCategory = complaintFilters.category === 'all' || complaint.category === complaintFilters.category;
            const matchesStatus = complaintFilters.status === 'all' || complaint.status === complaintFilters.status;
            const matchesDate = !complaintFilters.date || complaint.date === complaintFilters.date;

            return matchesCategory && matchesStatus && matchesDate;
        });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setComplaintFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleComplaintUpdate = async (id) => {
        try {
            await updateComplaint(id, {
                status: editComplaintData.status,
                reply: editComplaintData.reply
            });

            setComplaints(prevComplaints =>
                prevComplaints.map(c =>
                    c.id === id
                        ? { ...c, status: editComplaintData.status, reply: editComplaintData.reply }
                        : c
                )
            );

            setEditingComplaint(null);
            setEditComplaintData({ status: 0, reply: '',updated_date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            console.error("Failed to update complaint:", error);
        }
    };

    return (
        <div className="complaints">
            <h2>Complaints Management</h2>

            <div className="complaints-filters">
                <select
                    className="filter-select"
                    name="category"
                    value={complaintFilters.category}
                    onChange={handleFilterChange}
                >
                    <option value="all">All Categories</option>
                    <option value="Collection Service">Collection Service</option>
                    <option value="Vehicle Issue">Vehicle Issue</option>
                    <option value="Staff Behavior">Staff Behavior</option>
                    <option value="Other">Other</option>
                </select>
                <select
                    className="filter-select"
                    name="status"
                    value={complaintFilters.status}
                    onChange={handleFilterChange}
                >
                    <option value="all">All Status</option>
                    <option value={0}>Pending</option>
                    <option value={1}>In Progress</option>
                    <option value={2}>Resolved</option>
                </select>
                <input
                    type="date"
                    className="date-filter"
                    name="date"
                    value={complaintFilters.date}
                    onChange={handleFilterChange}
                />
                <button
                    className="filter-btn"
                >
                    Filter
                </button>
            </div>

            {/* Complaints Table */}
            <div className="complaints-table">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Resident</th>
                        <th>Category</th>
                        <th>Title</th>
                        <th>Postal Code</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getFilteredComplaints().map(complaint => (
                        <tr key={complaint.id}>
                            <td>{complaint.id}</td>
                            <td>{complaint.residentName}</td>
                            <td>{complaint.category}</td>
                            <td>{complaint.title}</td>
                            <td>{complaint.postal_code}</td>
                            <td>{complaint.created_date}</td>
                            <td>{complaint.status}</td>
                            <td>
                                <button
                                    className="action-btn view"
                                    onClick={() => {
                                        setEditingComplaint(complaint.id);
                                        setEditComplaintData({
                                            status: complaint.status,
                                            reply: complaint.reply
                                        });
                                    }}
                                >
                                    View/Update
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Complaint Details Modal */}
            {editingComplaint && (
                <div className="complaint-modal">
                    <div className="modal-content">
                        <h3>Complaint Details</h3>
                        <div className="complaint-details">
                            <div className="detail-row">
                                <span className="detail-label">Resident:</span>
                                <span className="detail-value">
                                                    {complaints.find(c => c.id === editingComplaint)?.residentName}
                                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Category:</span>
                                <span className="detail-value">
                                                    {complaints.find(c => c.id === editingComplaint)?.category}
                                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Title:</span>
                                <span className="detail-value">
                                                    {complaints.find(c => c.id === editingComplaint)?.title}
                                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Description:</span>
                                <p className="detail-value">
                                    {complaints.find(c => c.id === editingComplaint)?.description}
                                </p>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Postal Code:</span>
                                <span className="detail-value">
                                                    {complaints.find(c => c.id === editingComplaint)?.postal_code}
                                                </span>
                            </div>
                        </div>

                        <div className="complaint-update">
                            <div className="form-group">
                                <label>Status:</label>
                                <select
                                    value={editComplaintData.status}
                                    onChange={(e) => setEditComplaintData({
                                        ...editComplaintData,
                                        status: e.target.value
                                    })}
                                    className="form-input"
                                >
                                    <option value={0}>Pending</option>
                                    <option value={1}>In Progress</option>
                                    <option value={2}>Resolved</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Reply:</label>
                                <textarea
                                    value={editComplaintData.reply}
                                    onChange={(e) => setEditComplaintData({
                                        ...editComplaintData,
                                        reply: e.target.value
                                    })}
                                    className="form-input"
                                    rows="4"
                                    placeholder="Enter your reply to the resident..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="action-btn save"
                                onClick={() => handleComplaintUpdate(editingComplaint)}
                            >
                                Update
                            </button>
                            <button
                                className="action-btn cancel"
                                onClick={() => {
                                    setEditingComplaint(null);
                                    setEditComplaintData({ status: 0, reply: '' });
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Complaint
