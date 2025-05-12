import React, {useCallback, useEffect, useState} from 'react'
import {addVehicle, deleteVehicle, getVehicles, updateVehicle} from "../../utils/vehicles.js";

const Vehicles = () => {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const fetchVehicles = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getVehicles();
            setVehicles(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);


    const vehicleStats = {
        totalVehicles: 5,
        activeVehicles: 3,
        maintenanceVehicles: 1,
        inactiveVehicles: 1
    };

    const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
    const [newVehicleData, setNewVehicleData] = useState({
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

    const handleNewVehicleAdd = async (vehicle) => {
        try {
            setLoading(true);
            const newVehicle = await addVehicle(vehicle);
            setVehicles(prev => [...prev, newVehicle]);
            setShowNewVehicleForm(false);
            setNewVehicleData({ /* reset fields */ vehicleNumber: '', type: '', capacity: '', fuelLevel: '', status: 'Active', lastMaintenance: '', nextMaintenance: '', assignedDriver: '', notes: '' });
        } finally {
            setLoading(false);
        }
    };

    const handleMaintenanceClick = (vehicleId) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === vehicleId
                ? { ...vehicle, status: vehicle.status === 'maintenance' ? 'active' : 'maintenance' }
                : vehicle
        ));
    };

    const handleEditVehicleSubmit = async (id, updatedData) => {
        try {
            setLoading(true)
            setActionLoadingId(id);
            await updateVehicle(id, updatedData);
            await fetchVehicles();
            setEditingVehicle(null);
        } finally {
            setLoading(false)
            setActionLoadingId(null);
        }
    };

    const handleDeleteVehicle = async (id) => {
        try {
            setLoading(true)
            setActionLoadingId(id);
            await deleteVehicle(id);
            setVehicles(prev => prev.filter(v => v.id !== id));
        } finally {
            setLoading(false)
            setActionLoadingId(null);
        }
    };


    // Add state for editing vehicles
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [editVehicleForm, setEditVehicleForm] = useState({
        type: '',
        capacity: '',
        vehicleNumber: '',
        status: '',
        assignedDriver: '',
    });

    const handleEditVehicleClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setEditVehicleForm({
            vehicleNumber: vehicle.vehicleNumber,
            type: vehicle.type,
            capacity: vehicle.capacity,
            status: vehicle.status,
            assignedDriver: vehicle.assignedDriver
        });
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
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, vehicleNumber: e.target.value })}
                                className="form-input"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <select
                                name="type"
                                value={newVehicleData.type}
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, type: e.target.value })}
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
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, capacity: e.target.value })}
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
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, fuelLevel: e.target.value })}
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
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, status: e.target.value })}
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
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, lastMaintenance: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Next Maintenance:</label>
                            <input
                                type="date"
                                name="nextMaintenance"
                                value={newVehicleData.nextMaintenance}
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, nextMaintenance: e.target.value })}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label>Assigned Driver:</label>
                            <select
                                name="assignedDriver"
                                value={newVehicleData.assignedDriver}
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, assignedDriver: e.target.value })}
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
                                onChange={(e) => setNewVehicleData({ ...newVehicleData, notes: e.target.value })}
                                className="form-input"
                            ></textarea>
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="action-btn save" onClick={()=>handleNewVehicleAdd(newVehicleData)}>{loading ? 'Adding...' : 'Add Vehicle'}</button>
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
                            <th>Vehicle Number</th>
                            <th>Type</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Driver</th>
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
                                                name="licensePlate"
                                                value={editVehicleForm.vehicleNumber}
                                                onChange={(e) =>setEditVehicleForm({...editVehicleForm, vehicleNumber: e.target.value})}
                                            />
                                        </td>

                                        <td>
                                            <select
                                                name="type"
                                                value={editVehicleForm.type}
                                                onChange={(e) =>setEditVehicleForm({...editVehicleForm, type: e.target.value})}
                                                className="edit-input"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Truck">Truck</option>
                                                <option value="Van">Van</option>
                                                <option value="Compact">Compact</option>
                                            </select>

                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                name="capacity"
                                                value={editVehicleForm.capacity}
                                                onChange={(e) =>setEditVehicleForm({...editVehicleForm, capacity: e.target.value})}
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="edit-input"
                                                name="status"
                                                value={editVehicleForm.status}
                                                onChange={(e) =>setEditVehicleForm({...editVehicleForm, status: e.target.value})}
                                            >
                                                <option value="active">Active</option>
                                                <option value="maintenance">Maintenance</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                name="assignedDriver"
                                                value={editVehicleForm.assignedDriver}
                                                onChange={(e) =>setEditVehicleForm({...editVehicleForm, assignedDriver: e.target.value})}
                                                className="form-input"
                                            >
                                                <option value="">Select Driver</option>
                                                <option value="John Driver">John Driver</option>
                                                <option value="Sarah Driver">Sarah Driver</option>
                                                <option value="Mike Driver">Mike Driver</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                className="action-btn save"
                                                onClick={() => handleEditVehicleSubmit(vehicle.id,editVehicleForm)}
                                            >
                                                {loading ? 'Updating' : 'Update'}
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
                                        <td>{vehicle.vehicleNumber}</td>
                                        <td>{vehicle.type}</td>
                                        <td>{vehicle.capacity}</td>
                                        <td>
                                            <span className={`status-badge ${vehicle.status}`}>
                                                {vehicle.status}
                                            </span>
                                        </td>
                                        <td>{vehicle.assignedDriver}</td>
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
                                                {loading ? 'Deleting' : 'Delete'}
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
