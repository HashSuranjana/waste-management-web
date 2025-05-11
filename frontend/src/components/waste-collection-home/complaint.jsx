import React, {useState} from 'react'

const Complaint = () => {
    const [complaints, setComplaints] = useState([
        {
            id: 1,
            residentName: 'John Smith',
            category: 'Collection Service',
            title: 'Missed Collection',
            description: 'The waste collection was not done on the scheduled date. This is the second time this month.',
            location: '123 Main St',
            status: 'Pending',
            date: '2024-03-15',
            reply: '',
            updatedAt: '2024-03-15'
        },
        {
            id: 2,
            residentName: 'Jane Doe',
            category: 'Vehicle Issue',
            title: 'Noisy Collection Vehicle',
            description: 'The collection vehicle is making excessive noise during early morning collections.',
            location: '456 Oak Ave',
            status: 'In Progress',
            date: '2024-03-14',
            reply: 'We have noted your complaint and will inspect the vehicle for noise issues.',
            updatedAt: '2024-03-14'
        },
        {
            id: 3,
            residentName: 'Robert Johnson',
            category: 'Staff Behavior',
            title: 'Rude Collection Staff',
            description: 'The collection staff was rude and unprofessional during the collection.',
            location: '789 Pine Rd',
            status: 'Resolved',
            date: '2024-03-13',
            reply: 'We apologize for the behavior. The staff member has been counseled and appropriate action has been taken.',
            updatedAt: '2024-03-13'
        }
    ]);

    const [editingComplaint, setEditingComplaint] = useState(null);
    const [editComplaintData, setEditComplaintData] = useState({
        status: '',
        reply: ''
    });

    // Handle complaint status and reply update
    const handleComplaintUpdate = (complaintId) => {
        setComplaints(prevComplaints =>
            prevComplaints.map(complaint =>
                complaint.id === complaintId
                    ? {
                        ...complaint,
                        status: editComplaintData.status,
                        reply: editComplaintData.reply,
                        updatedAt: new Date().toISOString().split('T')[0]
                    }
                    : complaint
            )
        );
        setEditingComplaint(null);
        setEditComplaintData({ status: '', reply: '' });
    };
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

    // Add this function to handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setComplaintFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Add this function to handle filter button click
    const handleFilterButtonClick = () => {
        // The filtered complaints will be automatically updated through the getFilteredComplaints function
        // This function is here in case you want to add any additional logic when applying filters
        console.log('Filters applied:', complaintFilters);
    };
    return (
        <div className="complaints">
            <h2>Complaints Management</h2>

            {/* Complaints Filters */}
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
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
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
                    onClick={handleFilterButtonClick}
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
                            <td>{complaint.location}</td>
                            <td>{complaint.date}</td>
                            <td>
                                                    <span className={`status-badge ${complaint.status.toLowerCase().replace(' ', '-')}`}>
                                                        {complaint.status}
                                                    </span>
                            </td>
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
                                <span className="detail-label">Location:</span>
                                <span className="detail-value">
                                                    {complaints.find(c => c.id === editingComplaint)?.location}
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
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
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
                                    setEditComplaintData({ status: '', reply: '' });
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
