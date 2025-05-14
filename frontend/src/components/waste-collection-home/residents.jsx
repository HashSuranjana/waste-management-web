import React, {useEffect, useState, useMemo} from 'react';
import {addResident, deleteResident, fetchResidents, updateResident} from "../../utils/residents.js";

const Residents = () => {
    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadResidents = async () => {
        setLoading(true);
        const data = await fetchResidents();
        setResidents(data);
        setLoading(false);
    };

    useEffect(() => {
        loadResidents();
    }, []);

    const [editingResident, setEditingResident] = useState(null);
    const [editResidentForm, setEditResidentForm] = useState({
        name: '',
        address: '',
        postalCode: '',
        phone: '',
        email: '',
    });

    const handleEditResidentClick = (resident) => {
        setEditingResident(resident);
        setEditResidentForm({
            name: resident.name,
            address: resident.address,
            postalCode: resident.postalCode,
            phone: resident.phone,
            email: resident.email,
        });
    };

    const handleNewResidentSubmit = async () => {
        setLoading(true)
        await addResident(newResidentData);
        setNewResidentData({ name: '', address: '', postalCode: '', phone: '', email: '' });
        setShowNewResidentForm(false);
        setLoading(false)
        loadResidents();
    };

    const handleEditResidentSubmit = async (id) => {
        setLoading(true)
        await updateResident(id, editResidentForm);
        setEditingResident(null);
        setEditResidentForm({ name: '', address: '', postalCode: '', phone: '', email: '' });
        setLoading(false)
        loadResidents();
    };

    const handleDeleteResident = async (id) => {
        setLoading(true)
        await deleteResident(id);
        loadResidents();
        setLoading(false)

    }

    const [showNewResidentForm, setShowNewResidentForm] = useState(false);
    const [newResidentData, setNewResidentData] = useState({
        name: '',
        address: '',
        postalCode: '',
        phone: '',
        email: '',
    });

    const handleNewResidentChange = (e) => {
        const { name, value } = e.target;
        setNewResidentData((prev) => ({ ...prev, [name]: value }));
    };

    const filteredResidents = useMemo(() => {
        return residents.filter(resident =>
            resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.postalCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resident.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [residents, searchQuery]);

    return (
        <div className="residents">
            <h2>Residents Details</h2>
            <div className="action-bar">
                <button className="add-btn" onClick={() => setShowNewResidentForm(true)}>
                    Add New Resident
                </button>
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search residents..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {showNewResidentForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <h3>Add New Resident</h3>
                        {['name', 'address', 'postalCode', 'phone', 'email'].map((field) => (
                            <div className="form-group" key={field}>
                                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                <input
                                    type="text"
                                    name={field}
                                    value={newResidentData[field]}
                                    onChange={handleNewResidentChange}
                                    required
                                />
                            </div>
                        ))}
                        <div className="form-actions">
                            <button className="submit-btn" onClick={handleNewResidentSubmit}>
                                {loading ? 'Adding' :'Add Resident'}
                            </button>
                            <button className="cancel-btn" onClick={() => setShowNewResidentForm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
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
                    {filteredResidents.map((resident) => (
                        <tr key={resident.id}>
                            {editingResident?.id === resident.id ? (
                                <>
                                    {['name', 'address', 'postalCode', 'phone', 'email'].map((field) => (
                                        <td key={field}>
                                            <input
                                                type={field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                className="edit-input"
                                                value={editResidentForm[field]}
                                                onChange={(e) => setEditResidentForm((prev) => ({ ...prev, [field]: e.target.value }))}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <button className="action-btn save" onClick={() => handleEditResidentSubmit(resident.id)}>
                                            {loading ? 'Updating' : 'Update'}
                                        </button>
                                        <button className="action-btn cancel" onClick={() => setEditingResident(null)}>
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
                                        <button className="action-btn edit" onClick={() => handleEditResidentClick(resident)}>
                                            Edit
                                        </button>
                                        <button className="action-btn delete" onClick={() => handleDeleteResident(resident.id)}>
                                            {loading ? 'Deleting' : 'Delete'}
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Residents;
