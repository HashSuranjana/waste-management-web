import React, {useState} from 'react'

const Vehicles = () => {

    const [vehicles, setVehicles] = useState([
        {
            id: 'Truck-001',
            name: 'Truck-001',
            type: 'Garbage Truck',
            capacity: '5 tons',
            licensePlate: 'ABC123',
            status: 'active',
            assignedDriver: 'John Driver',
            wasteType: 'Mixed'
        },
        {
            id: 2,
            name: 'Van-001',
            type: 'Recycling Van',
            capacity: '2 tons',
            licensePlate: 'DEF456',
            status: 'Active',
            lastMaintenance: '2023-03-10',
            nextMaintenance: '2023-06-10',
            fuelLevel: '60%',
            assignedDriver: 'Sarah Driver',
            wasteType: 'Recyclable'
        },
        {
            id: 3,
            name: 'Truck-002',
            type: 'Organic Waste Truck',
            capacity: '4 tons',
            licensePlate: 'GHI789',
            status: 'Maintenance',
            lastMaintenance: '2023-04-01',
            nextMaintenance: '2023-07-01',
            fuelLevel: '30%',
            assignedDriver: 'Mike Driver',
            wasteType: 'Organic'
        },
        {
            id: 4,
            name: 'Van-002',
            type: 'Recycling Van',
            capacity: '2 tons',
            licensePlate: 'JKL012',
            status: 'Active',
            lastMaintenance: '2023-03-20',
            nextMaintenance: '2023-06-20',
            fuelLevel: '85%',
            assignedDriver: 'Lisa Driver',
            wasteType: 'Recyclable'
        },
        {
            id: 5,
            name: 'Truck-003',
            type: 'Garbage Truck',
            capacity: '5 tons',
            licensePlate: 'MNO345',
            status: 'Inactive',
            lastMaintenance: '2023-02-15',
            nextMaintenance: '2023-05-15',
            fuelLevel: '10%',
            assignedDriver: 'Tom Driver',
            wasteType: 'Mixed'
        },
    ]);

    /**
     * Vehicle Statistics
     *
     * Summary statistics for the vehicle fleet.
     * Provides a quick overview of vehicle operational status.
     */
    const vehicleStats = {
        totalVehicles: 5,
        activeVehicles: 3,
        maintenanceVehicles: 1,
        inactiveVehicles: 1
    };

    const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
    const [newVehicleData, setNewVehicleData] = useState({
        id: '',
        vehicleNumber: '',
        type: '',
        capacity: '',
        fuelLevel: '',
        status: 'Active',
        lastMaintenance: '',
        nextMaintenance: '',
        assignedDriver: '',
        notes: ''
    });

    const handleMaintenanceClick = (vehicleId) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === vehicleId
                ? { ...vehicle, status: vehicle.status === 'maintenance' ? 'active' : 'maintenance' }
                : vehicle
        ));
    };


    // Handle new vehicle form input changes
    const handleNewVehicleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicleData({
            ...newVehicleData,
            [name]: value
        });
    };

    // Handle new vehicle form submission
    const handleNewVehicleSubmit = () => {
        const newVehicle = {
            ...newVehicleData,
            id: vehicles.length + 1
        };
        setVehicles([...vehicles, newVehicle]);
        setShowNewVehicleForm(false);
        setNewVehicleData({
            id: '',
            vehicleNumber: '',
            type: '',
            capacity: '',
            fuelLevel: '',
            status: 'Active',
            lastMaintenance: '',
            nextMaintenance: '',
            assignedDriver: '',
            notes: ''
        });
    };

    // Add state for editing vehicles
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [editVehicleForm, setEditVehicleForm] = useState({
        name: '',
        type: '',
        capacity: '',
        licensePlate: '',
        status: '',
        assignedDriver: '',
        wasteType: ''
    });

    // Handle edit vehicle button click
    const handleEditVehicleClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setEditVehicleForm({
            name: vehicle.name,
            type: vehicle.type,
            capacity: vehicle.capacity,
            licensePlate: vehicle.licensePlate,
            status: vehicle.status,
            assignedDriver: vehicle.assignedDriver,
            wasteType: vehicle.wasteType
        });
    };

    // Handle form changes in edit mode
    const handleEditVehicleChange = (e) => {
        const { name, value } = e.target;
        setEditVehicleForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handle edit form submission
    const handleEditVehicleSubmit = (vehicleId) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === vehicleId
                ? { ...vehicle, ...editVehicleForm }
                : vehicle
        ));
        setEditingVehicle(null);
        setEditVehicleForm({
            name: '',
            type: '',
            capacity: '',
            licensePlate: '',
            status: '',
            assignedDriver: '',
            wasteType: ''
        });
    };

    // Handle delete vehicle
    const handleDeleteVehicle = (vehicleId) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
        }
    };
    return (
        <div className="vehicles">
            <h2>Vehicle Management</h2>

            {/* Vehicle Statistics */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">🚛</div>
                    <div className="stat-info">
                        <h3>Total Vehicles</h3>
                        <p className="stat-value">{vehicleStats.totalVehicles}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Active Vehicles</h3>
                        <p className="stat-value">{vehicleStats.activeVehicles}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔧</div>
                    <div className="stat-info">
                        <h3>In Maintenance</h3>
                        <p className="stat-value">{vehicleStats.maintenanceVehicles}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⛔</div>
                    <div className="stat-info">
                        <h3>Inactive Vehicles</h3>
                        <p className="stat-value">{vehicleStats.inactiveVehicles}</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="action-bar">
                <button className="add-btn" onClick={() => setShowNewVehicleForm(true)}>Add New Vehicle</button>
                <div className="search-bar">
                    <input type="text" placeholder="Search vehicles..." />
                    <button className="search-btn">Search</button>
                </div>
            </div>

            {/* New Vehicle Form */}
            {showNewVehicleForm && (
                <div className="new-collection-form">
                    <h3>Add New Vehicle</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Vehicle Number:</label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={newVehicleData.vehicleNumber}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <select
                                name="type"
                                value={newVehicleData.type}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Compact">Compact</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Capacity (kg):</label>
                            <input
                                type="number"
                                name="capacity"
                                value={newVehicleData.capacity}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Fuel Level (%):</label>
                            <input
                                type="number"
                                name="fuelLevel"
                                value={newVehicleData.fuelLevel}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                                min="0"
                                max="100"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Status:</label>
                            <select
                                name="status"
                                value={newVehicleData.status}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Last Maintenance:</label>
                            <input
                                type="date"
                                name="lastMaintenance"
                                value={newVehicleData.lastMaintenance}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Next Maintenance:</label>
                            <input
                                type="date"
                                name="nextMaintenance"
                                value={newVehicleData.nextMaintenance}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Assigned Driver:</label>
                            <select
                                name="assignedDriver"
                                value={newVehicleData.assignedDriver}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                            >
                                <option value="">Select Driver</option>
                                <option value="John Driver">John Driver</option>
                                <option value="Sarah Driver">Sarah Driver</option>
                                <option value="Mike Driver">Mike Driver</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Notes:</label>
                            <textarea
                                name="notes"
                                value={newVehicleData.notes}
                                onChange={handleNewVehicleChange}
                                className="form-input"
                            ></textarea>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="action-btn save" onClick={handleNewVehicleSubmit}>Save</button>
                        <button className="action-btn cancel" onClick={() => setShowNewVehicleForm(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Vehicles Table */}
            <div className="dashboard-card">
                <h3>Vehicle List</h3>
                <div className="table-responsive">
                    <table className="vehicle-table">
                        <thead>
                        <tr>
                            <th>Vehicle ID</th>
                            <th>Type</th>
                            <th>Capacity</th>
                            <th>License</th>
                            <th>Status</th>
                            <th>Driver</th>
                            <th>Waste Type</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vehicles.map(vehicle => (
                            <tr key={vehicle.id}>
                                {editingVehicle && editingVehicle.id === vehicle.id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                name="name"
                                                value={editVehicleForm.name}
                                                onChange={handleEditVehicleChange}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="edit-input"
                                                name="type"
                                                value={editVehicleForm.type}
                                                onChange={handleEditVehicleChange}
                                            >
                                                <option value="Garbage Truck">Garbage Truck</option>
                                                <option value="Recycling Van">Recycling Van</option>
                                                <option value="Compactor">Compactor</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                name="capacity"
                                                value={editVehicleForm.capacity}
                                                onChange={handleEditVehicleChange}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                name="licensePlate"
                                                value={editVehicleForm.licensePlate}
                                                onChange={handleEditVehicleChange}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="edit-input"
                                                name="status"
                                                value={editVehicleForm.status}
                                                onChange={handleEditVehicleChange}
                                            >
                                                <option value="active">Active</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                name="assignedDriver"
                                                value={editVehicleForm.assignedDriver}
                                                onChange={handleEditVehicleChange}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="edit-input"
                                                name="wasteType"
                                                value={editVehicleForm.wasteType}
                                                onChange={handleEditVehicleChange}
                                            >
                                                <option value="Mixed">Mixed</option>
                                                <option value="Recyclable">Recyclable</option>
                                                <option value="Organic">Organic</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn save"
                                                onClick={() => handleEditVehicleSubmit(vehicle.id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="action-btn cancel"
                                                onClick={() => setEditingVehicle(null)}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{vehicle.name}</td>
                                        <td>{vehicle.type}</td>
                                        <td>{vehicle.capacity}</td>
                                        <td>{vehicle.licensePlate}</td>
                                        <td>
                                                                <span className={`status-badge ${vehicle.status}`}>
                                                                    {vehicle.status}
                                                                </span>
                                        </td>
                                        <td>{vehicle.assignedDriver}</td>
                                        <td>{vehicle.wasteType}</td>
                                        <td>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleEditVehicleClick(vehicle)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className={`action-btn maintenance ${vehicle.status === 'maintenance' ? 'active' : ''}`}
                                                onClick={() => handleMaintenanceClick(vehicle.id)}
                                            >
                                                Maintenance
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
        </div>
    )
}
export default Vehicles
