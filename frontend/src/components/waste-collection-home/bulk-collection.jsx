import React, { useState, useEffect, useMemo } from 'react';
import {
    addBulkRequest,
    fetchBulkRequests,
    updateBulkRequest,
    fetchBulkRequestsByStatus,
    fetchBulkRequestsByDateRange
} from '../../utils/bulk-collections.js';
import { format } from 'date-fns';
import './bulk-collection.css';

const BulkCollection = () => {
    const [bulkCollectionTab, setBulkCollectionTab] = useState('requests');
    const [bulkRequests, setBulkRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [showNewRequestForm, setShowNewRequestForm] = useState(false);
    const [newRequest, setNewRequest] = useState({
        residentName: '',
        address: '',
        contact: '',
        wasteType: 'Construction Debris',
        estimatedWeight: '',
        preferredDate: '',
        notes: ''
    });

    useEffect(() => {
        loadBulkRequests();
    }, []);

    const loadBulkRequests = async () => {
        try {
            setLoading(true);
            const data = await fetchBulkRequests();
            setBulkRequests(data);
        } catch (error) {
            console.error('Error loading bulk requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewRequestSubmit = async (e) => {
        e.preventDefault();
        try {
            await addBulkRequest(newRequest);
            await loadBulkRequests();
            setShowNewRequestForm(false);
            setNewRequest({
                residentName: '',
                address: '',
                contact: '',
                wasteType: 'Construction Debris',
                estimatedWeight: '',
                preferredDate: '',
                notes: ''
            });
        } catch (error) {
            console.error('Error adding new request:', error);
            alert('Failed to add new request. Please try again.');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateBulkRequest(id, { status: newStatus });
            await loadBulkRequests();
        } catch (error) {
            console.error('Error updating request status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const handleDateRangeFilter = async () => {
        if (dateRange.start && dateRange.end) {
            try {
                setLoading(true);
                const data = await fetchBulkRequestsByDateRange(dateRange.start, dateRange.end);
                setBulkRequests(data);
            } catch (error) {
                console.error('Error filtering by date range:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleStatusFilter = async (status) => {
        try {
            setLoading(true);
            const data = status === 'all' 
                ? await fetchBulkRequests()
                : await fetchBulkRequestsByStatus(status);
            setBulkRequests(data);
            setStatusFilter(status);
        } catch (error) {
            console.error('Error filtering by status:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return bulkRequests.filter(request =>
            request.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (request.notes && request.notes.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [bulkRequests, searchQuery]);

    return (
        <div className="bulk-collection">
            <h2>Bulk Waste Collection Management</h2>

            <div className="bulk-collection-tabs">
                <button
                    className={`bulk-collection-tab ${bulkCollectionTab === 'requests' ? 'active' : ''}`}
                    onClick={() => setBulkCollectionTab('requests')}
                >
                    Requests
                </button>
                <button
                    className={`bulk-collection-tab ${bulkCollectionTab === 'schedule' ? 'active' : ''}`}
                    onClick={() => setBulkCollectionTab('schedule')}
                >
                    Schedule
                </button>
                <button
                    className={`bulk-collection-tab ${bulkCollectionTab === 'history' ? 'active' : ''}`}
                    onClick={() => setBulkCollectionTab('history')}
                >
                    History
                </button>
            </div>

            <div className="bulk-collection-content">
                {bulkCollectionTab === 'requests' && (
                    <div className="requests-section">
                        <div className="action-bar">
                            <div className="search-bar">
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button 
                                className="add-request-btn"
                                onClick={() => setShowNewRequestForm(true)}
                            >
                                Add New Request
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading">Loading requests...</div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Request ID</th>
                                        <th>Resident</th>
                                        <th>Address</th>
                                        <th>Waste Type</th>
                                        <th>Request Date</th>
                                        <th>Preferred Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map(request => (
                                        <tr key={request.id}>
                                            <td>{request.id}</td>
                                            <td>{request.residentName}</td>
                                            <td>{request.address}</td>
                                            <td>{request.wasteType}</td>
                                            <td>{format(new Date(request.requestDate), 'yyyy-MM-dd')}</td>
                                            <td>{format(new Date(request.preferredDate), 'yyyy-MM-dd')}</td>
                                            <td>
                                                <span className={`status-badge ${request.status.toLowerCase()}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={request.status}
                                                    onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {showNewRequestForm && (
                            <div className="modal">
                                <div className="modal-content">
                                    <h3>New Bulk Collection Request</h3>
                                    <form onSubmit={handleNewRequestSubmit}>
                                        <div className="form-group">
                                            <label>Resident Name:</label>
                                            <input
                                                type="text"
                                                value={newRequest.residentName}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    residentName: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Address:</label>
                                            <input
                                                type="text"
                                                value={newRequest.address}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    address: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Contact:</label>
                                            <input
                                                type="text"
                                                value={newRequest.contact}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    contact: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Waste Type:</label>
                                            <select
                                                value={newRequest.wasteType}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    wasteType: e.target.value
                                                })}
                                            >
                                                <option value="Construction Debris">Construction Debris</option>
                                                <option value="Garden Waste">Garden Waste</option>
                                                <option value="Household Items">Household Items</option>
                                                <option value="Electronic Waste">Electronic Waste</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Estimated Weight (kg):</label>
                                            <input
                                                type="number"
                                                value={newRequest.estimatedWeight}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    estimatedWeight: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Preferred Collection Date:</label>
                                            <input
                                                type="date"
                                                value={newRequest.preferredDate}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    preferredDate: e.target.value
                                                })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Notes:</label>
                                            <textarea
                                                value={newRequest.notes}
                                                onChange={(e) => setNewRequest({
                                                    ...newRequest,
                                                    notes: e.target.value
                                                })}
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary">Submit Request</button>
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => setShowNewRequestForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {bulkCollectionTab === 'schedule' && (
                    <div className="schedule-section">
                        <div className="schedule-controls">
                            <div className="date-range">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                                <button className="filter-btn" onClick={handleDateRangeFilter}>Filter</button>
                            </div>
                        </div>

                        <div className="schedule-grid">
                            {filteredRequests
                                .filter(request => request.status === 'Confirmed')
                                .map(request => (
                                    <div key={request.id} className="schedule-card">
                                        <div className="schedule-header">
                                            <h3>Request #{request.id}</h3>
                                            <span className={`status-badge ${request.status.toLowerCase()}`}>
                                                {request.status}
                                            </span>
                                        </div>
                                        <div className="schedule-details">
                                            <p><strong>Resident:</strong> {request.residentName}</p>
                                            <p><strong>Address:</strong> {request.address}</p>
                                            <p><strong>Collection Date:</strong> {format(new Date(request.preferredDate), 'yyyy-MM-dd')}</p>
                                            <p><strong>Waste Type:</strong> {request.wasteType}</p>
                                            <p><strong>Estimated Weight:</strong> {request.estimatedWeight} kg</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {bulkCollectionTab === 'history' && (
                    <div className="history-section">
                        <div className="history-filters">
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <div className="date-range">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                                <button className="filter-btn" onClick={handleDateRangeFilter}>Filter</button>
                            </div>
                        </div>

                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Request ID</th>
                                    <th>Resident</th>
                                    <th>Waste Type</th>
                                    <th>Collection Date</th>
                                    <th>Status</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests
                                    .filter(request => ['Completed', 'Cancelled'].includes(request.status))
                                    .map(request => (
                                        <tr key={request.id}>
                                            <td>{request.id}</td>
                                            <td>{request.residentName}</td>
                                            <td>{request.wasteType}</td>
                                            <td>{format(new Date(request.preferredDate), 'yyyy-MM-dd')}</td>
                                            <td>
                                                <span className={`status-badge ${request.status.toLowerCase()}`}>
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td>{request.estimatedWeight} kg</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BulkCollection; 