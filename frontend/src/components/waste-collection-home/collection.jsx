import React, {useEffect, useState} from 'react'
import {addSchedule, deleteSchedule, fetchSchedules, updateSchedule} from "../../utils/collections.js";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../config/firebase-config.js";

const Collections = () => {
    const vehiclesCollectionRef = collection(db, 'vehicles');

    const [collections, setCollections] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
    const [newCollectionData, setNewCollectionData] = useState({
        location: '',
        date: '',
        time: '',
        status: 'Scheduled',
        wasteType: 'Mixed',
        assignedVehicle: '',
    });
    const [editingCollection, setEditingCollection] = useState(null);
    const [editFormData, setEditFormData] = useState({
        location: '',
        date: '',
        time: '',
        status: '',
        wasteType: '',
        assignedVehicle: '',
    });
    const [searchQuery] = useState('')
    useEffect(() => {
        const loadData = async () => {
            const data = await fetchSchedules();
            setCollections(data);
        };
        loadData();
    }, []);

    const handleNewCollectionSubmit = async () => {
        if (!newCollectionData.location || !newCollectionData.date || !newCollectionData.time || !newCollectionData.assignedVehicle) {
            alert('Please fill in all required fields');
            return;
        }

        const newItem = await addSchedule(newCollectionData);
        setCollections(prev => [...prev, newItem]);
        setShowNewCollectionForm(false);
        setNewCollectionData({ location: '', date: '', time: '', status: 'Scheduled', wasteType: 'Mixed', assignedVehicle: '' });
    };
    const handleEditClick = (collection) => {
        setEditingCollection(collection.id);
        setEditFormData({ ...collection });
    };

    const handleEditFormSubmit = async (id) => {
        await updateSchedule(id, editFormData);
        setCollections(prev =>
            prev.map(c => (c.id === id ? { ...c, ...editFormData } : c))
        );
        setEditingCollection(null);
    };

    const handleDeleteClick = async (id) => {
        await deleteSchedule(id);
        setCollections(prev => prev.filter(c => c.id !== id));
    };

    const filteredCollections = collections.filter(c =>
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.assignedVehicle.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const fetchActiveVehicles = async () => {
        try {
            const q = query(vehiclesCollectionRef, where('status', '==', 'active'));
            const querySnapshot = await getDocs(q);
            const vehicles = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAvailableVehicles(vehicles);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        }
    };

    useEffect(() => {
        if (showNewCollectionForm) {
            fetchActiveVehicles();
        }
    }, [fetchActiveVehicles, showNewCollectionForm]);

    return (
        <div className="collections">
            <h2>Collections Management</h2>

            {/* Collection Statistics */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">🗑️</div>
                    <div className="stat-info">
                        <h3>Total Collections</h3>
                        <p className="stat-value">{collections.length}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Completed</h3>
                        <p className="stat-value">{collections.filter(c => c.status === 'Completed').length}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>Pending</h3>
                        <p className="stat-value">{collections.filter(c => c.status === 'Scheduled').length}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔄</div>
                    <div className="stat-info">
                        <h3>In Progress</h3>
                        <p className="stat-value">{collections.filter(c => c.status === 'In Progress').length}</p>
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
                                onChange={e => setNewCollectionData({ ...newCollectionData, location: e.target.value })}
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
                                onChange={e => setNewCollectionData({ ...newCollectionData, date: e.target.value })}
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
                                onChange={e => setNewCollectionData({ ...newCollectionData, time: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Waste Type:</label>
                            <select
                                name="wasteType"
                                value={newCollectionData.wasteType}
                                onChange={e => setNewCollectionData({ ...newCollectionData, wasteType: e.target.value })}
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
                                onChange={e => setNewCollectionData({ ...newCollectionData, assignedVehicle: e.target.value })}
                                className="form-input"
                                required
                            >
                                <option value="">Select Vehicle</option>
                                {availableVehicles.map(vehicle => (
                                    <option key={vehicle.id} value={vehicle.vehicleNumber}>
                                        {vehicle.vehicleNumber}
                                    </option>
                                ))}
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
                    {filteredCollections.map(collection => (
                        <tr key={collection.id}>
                            {editingCollection === collection.id ? (
                                <>
                                    <td className="edit-cell">
                                        <input
                                            type="text"
                                            name="location"
                                            value={editFormData.location}
                                            onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td className="edit-cell">
                                        <input
                                            type="date"
                                            name="date"
                                            value={editFormData.date}
                                            onChange={e => setEditFormData({ ...editFormData, date: e.target.value })}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td className="edit-cell">
                                        <input
                                            type="time"
                                            name="time"
                                            value={editFormData.time}
                                            onChange={e => setEditFormData({ ...editFormData, time: e.target.value })}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td className="edit-cell">
                                        <select
                                            name="status"
                                            value={editFormData.status}
                                            onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}
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
                                            onChange={e => setEditFormData({ ...editFormData, wasteType: e.target.value })}
                                            className="edit-input"
                                        >
                                            <option value="Mixed">Mixed</option>
                                            <option value="Organic">Organic</option>
                                            <option value="Recyclable">Recyclable</option>
                                        </select>
                                    </td>
                                    <td className="edit-cell">
                                        <select
                                            name="assignedVehicle"
                                            value={editFormData.vehicleNumber}
                                            onChange={e => setEditFormData({ ...editFormData, assignedVehicle: e.target.value })}
                                            className="edit-input"
                                        >
                                            <option value="">Select Vehicle</option>
                                            {availableVehicles.map(vehicle => (
                                                <option key={vehicle.id} value={vehicle.vehicleNumber}>
                                                    {vehicle.vehicleNumber}
                                                </option>
                                            ))}
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
                                    <td>{collection.vehicleNumber}</td>
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
