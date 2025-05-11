import React, {useState} from 'react'

const Collections = () => {
    /**
     * Collections Data
     *
     * Detailed mock data for all collections, including those in progress.
     * Contains comprehensive information about each collection operation.
     */
    const [collections, setCollections] = useState([
        {
            id: 1,
            location: '123 Main Street',
            date: '2024-03-15',
            time: '09:00 AM',
            status: 'Completed',
            wasteType: 'Mixed',
            weight: '250 kg',
            assignedVehicle: 'Truck-001',
            assignedDriver: 'John Driver',
            notes: 'Regular collection completed'
        },
        {
            id: 2,
            location: '456 Oak Avenue',
            date: '2024-03-15',
            time: '10:30 AM',
            status: 'Pending',
            wasteType: 'Recyclable',
            weight: 'N/A',
            assignedVehicle: 'Van-001',
            assignedDriver: 'Sarah Driver',
            notes: 'Scheduled collection'
        },
        {
            id: 3,
            location: '789 Pine Road',
            date: '2024-03-15',
            time: '02:00 PM',
            status: 'In Progress',
            wasteType: 'Organic',
            weight: '180 kg',
            assignedVehicle: 'Truck-002',
            assignedDriver: 'Mike Driver',
            notes: 'Collection in progress'
        },
        {
            id: 4,
            location: '321 Elm Street',
            date: '2024-03-16',
            time: '08:00 AM',
            status: 'Scheduled',
            wasteType: 'Mixed',
            weight: 'N/A',
            assignedVehicle: 'Truck-001',
            assignedDriver: 'John Driver',
            notes: 'Upcoming collection'
        },
        {
            id: 5,
            location: '654 Maple Drive',
            date: '2024-03-16',
            time: '11:00 AM',
            status: 'Scheduled',
            wasteType: 'Recyclable',
            weight: 'N/A',
            assignedVehicle: 'Van-002',
            assignedDriver: 'Lisa Driver',
            notes: 'Upcoming collection'
        }
    ]);

    const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const [newCollectionData, setNewCollectionData] = useState({
        location: '',
        date: '',
        time: '',
        status: 'Scheduled',
        wasteType: 'Mixed',
        assignedVehicle: ''
    });

    const collectionStats = {
        totalCollections: 156,
        pendingCollections: 23,
        completedCollections: 133,
        inProgressCollections: 22,
        totalWasteCollected: '2,450 kg',
        recyclingRate: '68%'
    };

    const handleNewCollectionChange = (e) => {
        const { name, value } = e.target;
        setNewCollectionData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle new collection form submission
    const handleNewCollectionSubmit = () => {
        if (!newCollectionData.location || !newCollectionData.date || !newCollectionData.time || !newCollectionData.assignedVehicle) {
            alert('Please fill in all required fields');
            return;
        }
    }

    const [editFormData, setEditFormData] = useState({
        location: '',
        date: '',
        time: '',
        status: '',
        wasteType: '',
        weight: '',
        assignedVehicle: '',
        assignedDriver: '',
        notes: ''
    });

    const handleEditClick = (collection) => {
        setEditingCollection(collection.id);
        setEditFormData({
            location: collection.location,
            date: collection.date,
            time: collection.time,
            status: collection.status,
            wasteType: collection.wasteType,
            weight: collection.weight,
            assignedVehicle: collection.assignedVehicle,
            assignedDriver: collection.assignedDriver,
            notes: collection.notes
        });
    };

    // Handle form input changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    // Handle form submission
    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        setCollections(collections.map(collection =>
            collection.id === editingCollection
                ? { ...collection, ...editFormData }
                : collection
        ));
        setEditingCollection(null);
    };

    // Handle delete button click
    const handleDeleteClick = (collectionId) => {
        setCollections(collections.filter(collection => collection.id !== collectionId));
    };

    return (
        <div className="collections">
            <h2>Collections Management</h2>

            {/* Collection Statistics */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">🗑️</div>
                    <div className="stat-info">
                        <h3>Total Collections</h3>
                        <p className="stat-value">{collectionStats.totalCollections}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Completed</h3>
                        <p className="stat-value">{collectionStats.completedCollections}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>Pending</h3>
                        <p className="stat-value">{collectionStats.pendingCollections}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                        <h3>In Progress</h3>
                        <p className="stat-value">{collectionStats.inProgressCollections}</p>
                    </div>
                </div>
            </div>

            {/* Action Bar - Search and Add New Collection */}
            <div className="action-bar">
                <button className="add-btn" onClick={() => setShowNewCollectionForm(true)}>Schedule New Collection</button>
                <div className="search-bar">
                    <input type="text" placeholder="Search collections..." />
                    <button className="search-btn">Search</button>
                </div>
            </div>

            {/* New Collection Form */}
            {showNewCollectionForm && (
                <div className="new-collection-form">
                    <h3>Schedule New Collection</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={newCollectionData.location}
                                onChange={handleNewCollectionChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date:</label>
                            <input
                                type="date"
                                name="date"
                                value={newCollectionData.date}
                                onChange={handleNewCollectionChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Time:</label>
                            <input
                                type="time"
                                name="time"
                                value={newCollectionData.time}
                                onChange={handleNewCollectionChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Waste Type:</label>
                            <select
                                name="wasteType"
                                value={newCollectionData.wasteType}
                                onChange={handleNewCollectionChange}
                                className="form-input"
                            >
                                <option value="Mixed">Mixed</option>
                                <option value="Organic">Organic</option>
                                <option value="Recyclable">Recyclable</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Assigned Vehicle:</label>
                            <select
                                name="assignedVehicle"
                                value={newCollectionData.assignedVehicle}
                                onChange={handleNewCollectionChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select Vehicle</option>
                                <option value="Truck-001">Truck-001</option>
                                <option value="Van-001">Van-001</option>
                                <option value="Truck-002">Truck-002</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="action-btn save" onClick={handleNewCollectionSubmit}>Save</button>
                        <button className="action-btn cancel" onClick={() => setShowNewCollectionForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Collection Schedule Table */}
            <div className="dashboard-card">
                <h3>Collection Schedule</h3>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Area</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Waste Type</th>
                        <th>Vehicle No.</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {collections.map(collection => (
                        <tr key={collection.id}>
                            {editingCollection === collection.id ? (
                                <>
                                    <td className="edit-cell">
                                        <input
                                            type="text"
                                            name="location"
                                            value={editFormData.location}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td className="edit-cell">
                                        <input
                                            type="date"
                                            name="date"
                                            value={editFormData.date}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td className="edit-cell">
                                        <input
                                            type="time"
                                            name="time"
                                            value={editFormData.time}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td className="edit-cell">
                                        <select
                                            name="status"
                                            value={editFormData.status}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        >
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="edit-cell">
                                        <select
                                            name="wasteType"
                                            value={editFormData.wasteType}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        >
                                            <option value="Mixed">Mixed</option>
                                            <option value="Organic">Organic</option>
                                            <option value="Recyclable">Recyclable</option>
                                        </select>
                                    </td>
                                    <td className="edit-cell">
                                        <select
                                            name="vehicle"
                                            value={editFormData.vehicle}
                                            onChange={handleEditFormChange}
                                            className="edit-input"
                                        >
                                            <option value="Truck-001">Truck-001</option>
                                            <option value="Truck-002">Truck-002</option>
                                            <option value="Van-001">Van-001</option>
                                            <option value="Van-002">Van-002</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="action-btn save"
                                            onClick={() => handleEditFormSubmit(collection.id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="action-btn cancel"
                                            onClick={() => setEditingCollection(null)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{collection.location}</td>
                                    <td>{collection.date}</td>
                                    <td>{collection.time}</td>
                                    <td>
                                                            <span className={`status-badge ${collection.status.toLowerCase().replace(' ', '-')}`}>
                                                                {collection.status}
                                                            </span>
                                    </td>
                                    <td>{collection.wasteType}</td>
                                    <td>{collection.vehicle}</td>
                                    <td>
                                        <button
                                            className="action-btn edit"
                                            onClick={() => handleEditClick(collection)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteClick(collection.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Collections;
