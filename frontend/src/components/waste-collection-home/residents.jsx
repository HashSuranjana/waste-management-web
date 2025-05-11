import React, {useState} from 'react'

const Residents = () => {
    const [residents, setResidents] = useState([
        { id: 1, name: 'John Smith', address: '123 Main St', postalCode: '10001', phone: '555-123-4567', email: 'john.smith@email.com' },
        { id: 2, name: 'Jane Doe', address: '456 Oak Ave', postalCode: '10002', phone: '555-234-5678', email: 'jane.doe@email.com' },
        { id: 3, name: 'Robert Johnson', address: '789 Pine Rd', postalCode: '10003', phone: '555-345-6789', email: 'robert.johnson@email.com' },
        { id: 4, name: 'Emily Davis', address: '321 Elm St', postalCode: '10004', phone: '555-456-7890', email: 'emily.davis@email.com' },
        { id: 5, name: 'Michael Wilson', address: '654 Maple Dr', postalCode: '10005', phone: '555-567-8901', email: 'michael.wilson@email.com' },
    ]);
    const [editingResident, setEditingResident] = useState(null);
    const [editResidentForm, setEditResidentForm] = useState({
        name: '',
        address: '',
        postalCode: '',
        phone: '',
        email: ''
    });

    // Handle edit resident button click
    const handleEditResidentClick = (resident) => {
        setEditingResident(resident);
        setEditResidentForm({
            name: resident.name,
            address: resident.address,
            postalCode: resident.postalCode,
            phone: resident.phone,
            email: resident.email
        });
    };

    // Handle resident form changes
    const handleEditResidentChange = (e) => {
        const { name, value } = e.target;
        setEditResidentForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handle edit form submission
    const handleEditResidentSubmit = (residentId) => {
        setResidents(residents.map(resident =>
            resident.id === residentId
                ? { ...resident, ...editResidentForm }
                : resident
        ));
        setEditingResident(null);
        setEditResidentForm({
            name: '',
            address: '',
            postalCode: '',
            phone: '',
            email: ''
        });
    };

    // Handle delete resident
    const handleDeleteResident = (residentId) => {
        if (window.confirm('Are you sure you want to delete this resident?')) {
            setResidents(residents.filter(resident => resident.id !== residentId));
        }
    };

    // Add state for new resident form
    const [showNewResidentForm, setShowNewResidentForm] = useState(false);
    const [newResidentData, setNewResidentData] = useState({
        name: '',
        address: '',
        postalCode: '',
        phone: '',
        email: ''
    });

    // Handle new resident form changes
    const handleNewResidentChange = (e) => {
        const { name, value } = e.target;
        setNewResidentData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle new resident form submission
    const handleNewResidentSubmit = () => {
        const newResident = {
            ...newResidentData,
            id: residents.length + 1
        };
        setResidents([...residents, newResident]);
        setShowNewResidentForm(false);
        setNewResidentData({
            name: '',
            address: '',
            postalCode: '',
            phone: '',
            email: ''
        });
    };
    return (
        <div className="residents">
            <h2>Residents Details</h2>
            <div className="action-bar">
                <button
                    className="add-btn"
                    onClick={() => setShowNewResidentForm(true)}
                >
                    Add New Resident
                </button>
                <div className="search-bar">
                    <input type="text" placeholder="Search residents..." />
                    <button className="search-btn">Search</button>
                </div>
            </div>

            {/* New Resident Form */}
            {showNewResidentForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Add New Resident</h3>
                        <div className="form-group">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={newResidentData.name}
                                onChange={handleNewResidentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                type="text"
                                name="address"
                                value={newResidentData.address}
                                onChange={handleNewResidentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Postal Code:</label>
                            <input
                                type="text"
                                name="postalCode"
                                value={newResidentData.postalCode}
                                onChange={handleNewResidentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone:</label>
                            <input
                                type="tel"
                                name="phone"
                                value={newResidentData.phone}
                                onChange={handleNewResidentChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={newResidentData.email}
                                onChange={handleNewResidentChange}
                                required
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                className="submit-btn"
                                onClick={handleNewResidentSubmit}
                            >
                                Add Resident
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => setShowNewResidentForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <table className="data-table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Postal Code</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {residents.map(resident => (
                    <tr key={resident.id}>
                        {editingResident?.id === resident.id ? (
                            <>
                                <td>
                                    <input
                                        type="text"
                                        className="edit-input"
                                        name="name"
                                        value={editResidentForm.name}
                                        onChange={handleEditResidentChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="edit-input"
                                        name="address"
                                        value={editResidentForm.address}
                                        onChange={handleEditResidentChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="edit-input"
                                        name="postalCode"
                                        value={editResidentForm.postalCode}
                                        onChange={handleEditResidentChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="edit-input"
                                        name="phone"
                                        value={editResidentForm.phone}
                                        onChange={handleEditResidentChange}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="email"
                                        className="edit-input"
                                        name="email"
                                        value={editResidentForm.email}
                                        onChange={handleEditResidentChange}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="action-btn save"
                                        onClick={() => handleEditResidentSubmit(resident.id)}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="action-btn cancel"
                                        onClick={() => setEditingResident(null)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </>
                        ) : (
                            <>
                                <td>{resident.name}</td>
                                <td>{resident.address}</td>
                                <td>{resident.postalCode}</td>
                                <td>{resident.phone}</td>
                                <td>{resident.email}</td>
                                <td>
                                    <button
                                        className="action-btn edit"
                                        onClick={() => handleEditResidentClick(resident)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={() => handleDeleteResident(resident.id)}
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
    )
}
export default Residents
