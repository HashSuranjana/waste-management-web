import {useState} from 'react';
import 'react-calendar/dist/Calendar.css';
import './WasteCollectionHome.css';
import PostalResidents from './PostalResidents.jsx';
import Reports from './Reports.jsx';
import useAuth from "../hooks/use-auth.js";
import Complaint from "./waste-collection-home/complaint.jsx";
import Collections from "./waste-collection-home/collection.jsx";
import Schedule from "./waste-collection-home/schedule.jsx";
import Dashboard from "./waste-collection-home/dashboard.jsx";
import Vehicles from "./waste-collection-home/vehicles.jsx";
import Residents from "./waste-collection-home/residents.jsx";
import Shop from "./waste-collection-home/shop.jsx";
import LiveLocation from "./waste-collection-home/live-location.jsx";
import Settings from "./waste-collection-home/settings.jsx";

const WasteCollectionHome = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const [recyclingTab, setRecyclingTab] = useState('overview');
    const [recyclingFilter, setRecyclingFilter] = useState('all');
    const [bulkCollectionTab, setBulkCollectionTab] = useState('requests');
    
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [, setRecyclingProcess] = useState({
        currentStep: 0,
        steps: [
            { id: 1, name: 'Collection', status: 'pending', completedAt: null },
            { id: 2, name: 'Sorting', status: 'pending', completedAt: null },
            { id: 3, name: 'Cleaning', status: 'pending', completedAt: null },
            { id: 4, name: 'Processing', status: 'pending', completedAt: null },
            { id: 5, name: 'Quality Check', status: 'pending', completedAt: null },
            { id: 6, name: 'Packaging', status: 'pending', completedAt: null }
        ]
    });

    // Bulk Collection Data
    const [bulkCollectionRequests] = useState([
        {
            id: 1,
            residentName: 'John Smith',
            address: '123 Main St',
            contact: '555-123-4567',
            wasteType: 'Construction Debris',
            estimatedWeight: '500 kg',
            requestDate: '2024-03-15',
            preferredDate: '2024-03-20',
            status: 'Pending',
            notes: 'Large amount of construction materials from home renovation'
        },
        {
            id: 2,
            residentName: 'Jane Doe',
            address: '456 Oak Ave',
            contact: '555-234-5678',
            wasteType: 'Garden Waste',
            estimatedWeight: '300 kg',
            requestDate: '2024-03-16',
            preferredDate: '2024-03-21',
            status: 'Confirmed',
            assignedVehicle: 'Truck-001',
            assignedDriver: 'John Driver',
            collectionDate: '2024-03-21',
            notes: 'Tree branches and garden clippings'
        },
        {
            id: 3,
            residentName: 'Robert Johnson',
            address: '789 Pine Rd',
            contact: '555-345-6789',
            wasteType: 'Household Items',
            estimatedWeight: '200 kg',
            requestDate: '2024-03-17',
            preferredDate: '2024-03-22',
            status: 'Completed',
            assignedVehicle: 'Van-001',
            assignedDriver: 'Sarah Driver',
            collectionDate: '2024-03-22',
            actualWeight: '180 kg',
            notes: 'Old furniture and appliances'
        }
    ]);



    const [residents] = useState([
        { id: 1, name: 'John Smith', address: '123 Main St', postalCode: '10001', phone: '555-123-4567', email: 'john.smith@email.com' },
        { id: 2, name: 'Jane Doe', address: '456 Oak Ave', postalCode: '10002', phone: '555-234-5678', email: 'jane.doe@email.com' },
        { id: 3, name: 'Robert Johnson', address: '789 Pine Rd', postalCode: '10003', phone: '555-345-6789', email: 'robert.johnson@email.com' },
        { id: 4, name: 'Emily Davis', address: '321 Elm St', postalCode: '10004', phone: '555-456-7890', email: 'emily.davis@email.com' },
        { id: 5, name: 'Michael Wilson', address: '654 Maple Dr', postalCode: '10005', phone: '555-567-8901', email: 'michael.wilson@email.com' },
    ]);


    
    const handleMaterialClick = (material) => {
        setSelectedMaterial(material);
        // Reset process steps when selecting a new material
        setRecyclingProcess(prev => ({
            ...prev,
            currentStep: 0,
            steps: prev.steps.map(step => ({
                ...step,
                status: 'pending',
                completedAt: null
            }))
        }));
    };

    const handleProcessUpdate = (stepId, newStatus) => {
        const updatedMaterials = recyclingMaterials.map(material => {
            if (material.id === selectedMaterial?.id) {
                const updatedSteps = material.processingStatus.steps.map(step => {
                    if (step.id === stepId) {
                        const now = new Date().toISOString().slice(0, 16);
                        return {
                            ...step,
                            status: newStatus,
                            startTime: newStatus === 'in-progress' ? now : step.startTime,
                            endTime: newStatus === 'completed' ? now : step.endTime
                        };
                    }
                    return step;
                });

                return {
                    ...material,
                    processingStatus: {
                        ...material.processingStatus,
                        currentStep: newStatus === 'completed' ?
                            material.processingStatus.steps.find(s => s.id === stepId).id :
                            material.processingStatus.currentStep,
                        steps: updatedSteps
                    }
                };
            }
            return material;
        });

        setRecyclingMaterials(updatedMaterials);
    };

    // Add this after the other state declarations
    const [recyclingMaterials, setRecyclingMaterials] = useState([
        {
            id: 1,
            name: 'Plastic Bottles',
            category: 'Plastic',
            quantity: '500 kg',
            status: 'pending',
            description: 'Mixed plastic bottles from residential collection',
            lastUpdated: '2024-03-15 10:30',
            recyclingCenter: 'Central Recycling Facility',
            processingStatus: {
                currentStep: 'Collection',
                steps: [
                    { id: 'Collection', status: 'completed', startTime: '2024-03-15 09:00', endTime: '2024-03-15 10:30' },
                    { id: 'Sorting', status: 'in-progress', startTime: '2024-03-15 10:30', endTime: null },
                    { id: 'Cleaning', status: 'pending', startTime: null, endTime: null },
                    { id: 'Processing', status: 'pending', startTime: null, endTime: null },
                    { id: 'Quality Check', status: 'pending', startTime: null, endTime: null },
                    { id: 'Packaging', status: 'pending', startTime: null, endTime: null }
                ]
            }
        },
        // ... existing materials ...
    ]);

    const [showTruckLocation, setShowTruckLocation] = useState(false);

    const { handleLogout, loading } = useAuth();

    const onLogout = async () => {
        const result = await handleLogout();
        if (result.success) {
            alert('Successfully logged out!'); // Replace with toast notification
        } else {
            alert(result.error); // Replace with error toast
        }
    };

    /**
     * Component Render
     * 
     * The main UI structure with conditional rendering based on the active tab.
     */
    return (
        <div className="waste-collection-home">
            {/* Header Section */}
            <header className="header">
                <div className="logo">
                    <h1>Waste Management System</h1>
                </div>
                <div className="user-info">
                    <span className="user-name">Waste Collection Center</span>
                    <button
                        className="logout-btn"
                        onClick={onLogout}
                        disabled={loading}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </header>

            <div className="main-content">
                {/* Sidebar Navigation */}
                <nav className="sidebar">
                    <ul className="nav-menu">
                        <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                            <span className="icon">📊</span> Dashboard
                        </li>
                        <li className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>
                            <span className="icon">🗑️</span> Collections
                        </li>
                        <li className={activeTab === 'schedule' ? 'active' : ''} onClick={() => setActiveTab('schedule')}>
                            <span className="icon">📅</span> Schedule
                        </li>
                        <li className={activeTab === 'vehicles' ? 'active' : ''} onClick={() => setActiveTab('vehicles')}>
                            <span className="icon">🚛</span> Vehicles
                        </li>
                        <li className={activeTab === 'residents' ? 'active' : ''} onClick={() => setActiveTab('residents')}>
                            <span className="icon">👥</span> Residents Details
                        </li>
                        <li className={activeTab === 'reports' ? 'active' : ''} onClick={() => setActiveTab('reports')}>
                            <span className="icon">📈</span> Reports
                        </li>
                        <li className={activeTab === 'bulk-collection' ? 'active' : ''} onClick={() => setActiveTab('bulk-collection')}>
                            <span className="icon">🗑️</span> Bulk Collection
                        </li>
                        <li className={activeTab === 'recycling' ? 'active' : ''} onClick={() => setActiveTab('recycling')}>
                            <span className="icon">♻️</span> Recycling
                        </li>
                        <li className={activeTab === 'shop' ? 'active' : ''} onClick={() => setActiveTab('shop')}>
                            <span className="icon">🛒</span> Shop
                        </li>
                        <li className={activeTab === 'complaints' ? 'active' : ''} onClick={() => setActiveTab('complaints')}>
                            <span className="icon">📝</span> Complaints
                        </li>
                        <li className={activeTab === 'postal-residents' ? 'active' : ''} onClick={() => setActiveTab('postal-residents')}>
                            <span className="icon">📍</span> Postal Residents
                        </li>
                        <li className={activeTab === 'live-location' ? 'active' : ''} onClick={() => setActiveTab('live-location')}>
                            <span className="icon">🗺️</span> Live Location
                        </li>
                    </ul>
                </nav>

                {/* Main Content Area - Conditionally Rendered Based on Active Tab */}
                <main className="content">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <Dashboard/>
                    )}

                    {/* Collections Tab */}
                    {activeTab === 'collections' && (
                        <Collections/>
                    )}

                    {/* Schedule Tab */}
                    {activeTab === 'schedule' && (
                        <Schedule/>
                    )}

                    {/* Vehicles Tab */}
                    {activeTab === 'vehicles' && (
                        <Vehicles/>
                    )}

                    {/* Residents Tab */}
                    {activeTab === 'residents' && (
                        <Residents/>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="reports-section">
                            <Reports />
                        </div>
                    )}

                    {/* Bulk Collection Tab */}
                    {activeTab === 'bulk-collection' && (
                        <div className="bulk-collection">
                            <h2>Bulk Waste Collection Management</h2>

                            {/* Bulk Collection Tabs */}
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

                            {/* Bulk Collection Content */}
                            <div className="bulk-collection-content">
                                {/* Requests Tab */}
                                {bulkCollectionTab === 'requests' && (
                                    <div className="requests-section">
                                        <div className="action-bar">
                                            <div className="search-bar">
                                                <input type="text" placeholder="Search requests..." />
                                                <button className="search-btn">Search</button>
                                            </div>
                                        </div>

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
                                                {bulkCollectionRequests.map(request => (
                                                    <tr key={request.id}>
                                                        <td>{request.id}</td>
                                                        <td>{request.residentName}</td>
                                                        <td>{request.address}</td>
                                                        <td>{request.wasteType}</td>
                                                        <td>{request.requestDate}</td>
                                                        <td>{request.preferredDate}</td>
                                                        <td>
                                                            <span className={`status-badge ${request.status.toLowerCase()}`}>
                                                                {request.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <button className="action-btn view">View</button>
                                                            {request.status === 'Pending' && (
                                                                <>
                                                                    <button className="action-btn confirm">Confirm</button>
                                                                    <button className="action-btn reject">Reject</button>
                                                                </>
                                                            )}
                                                            {request.status === 'Confirmed' && (
                                                                <button className="action-btn complete">Complete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Schedule Tab */}
                                {bulkCollectionTab === 'schedule' && (
                                    <div className="schedule-section">
                                        <div className="schedule-controls">
                                            <div className="date-range">
                                                <input type="date" />
                                                <span>to</span>
                                                <input type="date" />
                                            </div>
                                            <button className="filter-btn">Filter</button>
                                        </div>

                                        <div className="schedule-grid">
                                            {bulkCollectionRequests
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
                                                            <p><strong>Collection Date:</strong> {request.collectionDate}</p>
                                                            <p><strong>Assigned Vehicle:</strong> {request.assignedVehicle}</p>
                                                            <p><strong>Assigned Driver:</strong> {request.assignedDriver}</p>
                                                        </div>
                                                        <div className="schedule-actions">
                                                            <button className="action-btn view">View Details</button>
                                                            <button className="action-btn edit">Edit Schedule</button>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* History Tab */}
                                {bulkCollectionTab === 'history' && (
                                    <div className="history-section">
                                        <div className="history-filters">
                                            <select>
                                                <option value="all">All Status</option>
                                                <option value="completed">Completed</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            <input type="date" placeholder="From Date" />
                                            <input type="date" placeholder="To Date" />
                                            <button className="filter-btn">Filter</button>
                                        </div>

                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Request ID</th>
                                                    <th>Resident</th>
                                                    <th>Address</th>
                                                    <th>Waste Type</th>
                                                    <th>Estimated Weight</th>
                                                    <th>Actual Weight</th>
                                                    <th>Collection Date</th>
                                                    <th>Status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {bulkCollectionRequests
                                                    .filter(request => request.status === 'Completed' || request.status === 'Rejected')
                                                    .map(request => (
                                                        <tr key={request.id}>
                                                            <td>{request.id}</td>
                                                            <td>{request.residentName}</td>
                                                            <td>{request.address}</td>
                                                            <td>{request.wasteType}</td>
                                                            <td>{request.estimatedWeight}</td>
                                                            <td>{request.actualWeight || '-'}</td>
                                                            <td>{request.collectionDate || '-'}</td>
                                                            <td>
                                                                <span className={`status-badge ${request.status.toLowerCase()}`}>
                                                                    {request.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button className="action-btn view">View Details</button>
                                                                <button className="action-btn print">Print Report</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Recycling Tab */}
                    {activeTab === 'recycling' && (
                        <div className="recycling-section">
                            <div className="recycling-controls">
                                <h2>Recycling Management</h2>
                                <div className="recycling-filters">
                                    <select
                                        value={recyclingFilter}
                                        onChange={(e) => setRecyclingFilter(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="all">All Materials</option>
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <select
                                        value={recyclingTab}
                                        onChange={(e) => setRecyclingTab(e.target.value)}
                                        className="view-select"
                                    >
                                        <option value="overview">Overview</option>
                                        <option value="process-updates">Process Updates</option>
                                        <option value="centers">Recycling Centers</option>
                                    </select>
                                </div>
                            </div>

                            {recyclingTab === 'overview' && (
                                <div className="materials-list">
                                    {recyclingMaterials
                                        .filter(material =>
                                            recyclingFilter === 'all' ||
                                            material.status.toLowerCase() === recyclingFilter
                                        )
                                        .map(material => (
                                            <div
                                                key={material.id}
                                                className={`material-card ${selectedMaterial?.id === material.id ? 'selected' : ''}`}
                                                onClick={() => handleMaterialClick(material)}
                                            >
                                                <div className="material-header">
                                                    <h3>{material.name}</h3>
                                                    <span className="material-category">{material.category}</span>
                                                </div>
                                                <div className="material-details">
                                                    <div>
                                                        <strong>Quantity:</strong> {material.quantity}
                                                    </div>
                                                    <div>
                                                        <strong>Status:</strong>
                                                        <span className={`status-badge ${material.status.toLowerCase()}`}>
                                                            {material.status}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <strong>Recycling Center:</strong> {material.recyclingCenter}
                                                    </div>
                                                    <div>
                                                        <strong>Current Step:</strong> {material.processingStatus.currentStep}
                                                    </div>
                                                    <div>
                                                        <strong>Last Updated:</strong> {material.lastUpdated}
                                                    </div>
                                                </div>
                                                <p className="material-description">{material.description}</p>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {recyclingTab === 'process-updates' && selectedMaterial && (
                                <div className="process-steps">
                                    {selectedMaterial.processingStatus.steps.map((step) => (
                                        <div key={step.id} className={`process-step ${step.status === 'in-progress' ? 'current' : ''}`}>
                                            <div className="step-header">
                                                <h3>{step.id}</h3>
                                                <span className={`status-badge ${step.status}`}>
                                                    {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="step-timing">
                                                {step.startTime && (
                                                    <div className="time-info">
                                                        <span className="time-label">Start:</span>
                                                        <span className="time-value">{new Date(step.startTime).toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {step.endTime && (
                                                    <div className="time-info">
                                                        <span className="time-label">End:</span>
                                                        <span className="time-value">{new Date(step.endTime).toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {step.startTime && step.endTime && (
                                                    <div className="time-info">
                                                        <span className="time-label">Duration:</span>
                                                        <span className="time-value">
                                                            {}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="step-description">
                                                {}
                                            </p>
                                            <div className="step-actions">
                                                {step.status === 'pending' && (
                                                    <button
                                                        className="btn-primary"
                                                        onClick={() => handleProcessUpdate(step.id, 'in-progress')}
                                                    >
                                                        Start Process
                                                    </button>
                                                )}
                                                {step.status === 'in-progress' && (
                                                    <button
                                                        className="btn-success"
                                                        onClick={() => handleProcessUpdate(step.id, 'completed')}
                                                    >
                                                        Complete Step
                                                    </button>
                                                )}
                                                {step.status === 'completed' && (
                                                    <button
                                                        className="btn-warning"
                                                        onClick={() => handleProcessUpdate(step.id, 'in-progress')}
                                                    >
                                                        Reopen Step
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {recyclingTab === 'centers' && (
                                <div className="recycling-centers">
                                    <div className="centers-grid">
                                        {Array.from(new Set(recyclingMaterials.map(m => m.recyclingCenter))).map(center => (
                                            <div key={center} className="center-card">
                                                <h3>{center}</h3>
                                                <div className="center-stats">
                                                    <div className="stat">
                                                        <span className="stat-label">Active Materials</span>
                                                        <span className="stat-value">
                                                            {recyclingMaterials.filter(m => m.recyclingCenter === center).length}
                                                        </span>
                                                    </div>
                                                    <div className="stat">
                                                        <span className="stat-label">Total Quantity</span>
                                                        <span className="stat-value">
                                                            {recyclingMaterials
                                                                .filter(m => m.recyclingCenter === center)
                                                                .reduce((sum, m) => sum + parseInt(m.quantity), 0)} kg
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="center-materials">
                                                    <h4>Current Materials</h4>
                                                    <ul>
                                                        {recyclingMaterials
                                                            .filter(m => m.recyclingCenter === center)
                                                            .map(material => (
                                                                <li key={material.id}>
                                                                    <span className="material-name">{material.name}</span>
                                                                    <span className={`status-badge ${material.status.toLowerCase()}`}>
                                                                        {material.status}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Shop Tab */}
                    {activeTab === 'shop' && (
                        <Shop/>
                    )}

                    {/* Complaints Tab */}
                    {activeTab === 'complaints' && (
                        <Complaint/>
                    )}

                    {/* Postal Residents Tab */}
                    {activeTab === 'postal-residents' && (
                        <div className="postal-residents-container">
                            <PostalResidents/>
                        </div>
                    )}
                    {activeTab === 'live-location' && (
                        <LiveLocation/>
                    )}
                </main>
            </div>

            {/* Truck Location Modal */}
            {showTruckLocation && (
                <div className="modal-overlay">
                    <div className="modal-content truck-location-modal">
                        <div className="modal-header">
                            <h3>Live Truck Location</h3>
                            <button
                                className="close-btn"
                                onClick={() => setShowTruckLocation(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="truck-location-content">
                            <div className="truck-info">
                                <h4>Vehicle:</h4>
                                <p>Current Status: Active</p>
                            </div>
                            <div className="map-container">
                                {/* This would be replaced with an actual map component */}
                                <div className="map-placeholder">
                                    <p>Map showing truck location would be displayed here</p>
                                    <p>Current Location: 123 Main St, City</p>
                                    <p>Last Updated: {new Date().toLocaleTimeString()}</p>
                                </div>
                            </div>
                            <div className="truck-actions">
                                <button className="btn-primary">Refresh Location</button>
                                <button className="btn-secondary">Contact Driver</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default WasteCollectionHome; 