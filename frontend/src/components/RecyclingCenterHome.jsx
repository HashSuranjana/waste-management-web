/**
 * RecyclingCenterHome Component
 * 
 * This component serves as the main dashboard for the recycling center.
 * It provides a comprehensive interface for managing recycling operations,
 * tracking recycled materials, and monitoring recycling statistics.
 */

import {useEffect, useState} from 'react';
import './RecyclingCenterHome.css';
import useAuth from "../hooks/use-auth.js";
import {db} from "../config/firebase-config.js";
import {collection} from "firebase/firestore";
import {addBulkMaterial, fetchBulkMaterials} from "../utils/bulk-collection.js";

/**
 * RecyclingCenterHome Component
 * 
 * @returns {JSX.Element} The rendered recycling center dashboard
 */
const RecyclingCenterHome = () => {
    // State to track the active tab in the sidebar navigation
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [showNewBulkModal, setShowNewBulkModal] = useState(false);
    const [recyclingTab, setRecyclingTab] = useState('overview');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [currentStepId, setCurrentStepId] = useState(null);
    const [stepNote, setStepNote] = useState('');
    const [newBulkData, setNewBulkData] = useState({
        name: '',
        type: '',
        quantity: '',
        description: ''
    });
    const [recyclingProcess, setRecyclingProcess] = useState({
        currentStep: 1,
        steps: [
            {
                id: 1,
                name: 'Collection',
                status: 'completed',
                description: 'Waste materials are collected from various sources',
                completedAt: '2024-03-15 09:00',
                notes: 'Collected from 5 different locations'
            },
            {
                id: 2,
                name: 'Sorting',
                status: 'in-progress',
                description: 'Materials are sorted by type and quality',
                completedAt: null,
                notes: ''
            },
            {
                id: 3,
                name: 'Cleaning',
                status: 'pending',
                description: 'Materials are cleaned and prepared for processing',
                completedAt: null,
                notes: ''
            },
            {
                id: 4,
                name: 'Processing',
                status: 'pending',
                description: 'Materials are processed into raw materials',
                completedAt: null,
                notes: ''
            },
            {
                id: 5,
                name: 'Quality Check',
                status: 'pending',
                description: 'Processed materials undergo quality inspection',
                completedAt: null,
                notes: ''
            },
            {
                id: 6,
                name: 'Packaging',
                status: 'pending',
                description: 'Materials are packaged for distribution',
                completedAt: null,
                notes: ''
            }
        ]
    });

    /**
     * Recycling Statistics
     * 
     * Mock data representing key metrics for recycling operations.
     * In a production environment, this would be fetched from an API.
     */
    const recyclingStats = {
        totalRecycled: '1,250 kg',
        plasticRecycled: '450 kg',
        paperRecycled: '350 kg',
        metalRecycled: '250 kg',
        glassRecycled: '200 kg',
        recyclingRate: '75%'
    };

    /**
     * Recent Recycling Data
     * 
     * Mock data for recently processed recycling materials.
     * Each record contains essential information about the recycling operation.
     */
    const recentRecycling = [
        { id: 1, material: 'Plastic', date: '2024-03-15', weight: '45 kg', status: 'Processed' },
        { id: 2, material: 'Paper', date: '2024-03-15', weight: '32 kg', status: 'Processed' },
        { id: 3, material: 'Metal', date: '2024-03-14', weight: '28 kg', status: 'Processed' },
        { id: 4, material: 'Glass', date: '2024-03-14', weight: '15 kg', status: 'Processing' },
        { id: 5, material: 'Plastic', date: '2024-03-14', weight: '38 kg', status: 'Processing' },
    ];

    /**
     * Upcoming Collections Data
     * 
     * Mock data for scheduled recycling material collections.
     * Contains information about planned collection routes and times.
     */
    const upcomingCollections = [
        { id: 6, location: '987 Cedar Ln', date: '2024-03-16', time: '09:00 AM', material: 'Mixed' },
        { id: 7, location: '147 Birch St', date: '2024-03-16', time: '10:30 AM', material: 'Plastic' },
        { id: 8, location: '258 Willow Ave', date: '2024-03-17', time: '08:00 AM', material: 'Paper' },
        { id: 9, location: '369 Spruce Rd', date: '2024-03-17', time: '11:00 AM', material: 'Metal' },
        { id: 10, location: '741 Fir Dr', date: '2024-03-18', time: '09:30 AM', material: 'Glass' },
    ];

    // Mock data for recycling materials
    const recyclingMaterials = [
        {
            id: 1,
            name: 'Plastic',
            type: 'PET',
            quantity: '500 kg',
            status: 'In Progress',
            lastUpdated: '2024-03-15',
            description: 'Clear PET bottles and containers'
        },
        {
            id: 2,
            name: 'Paper',
            type: 'Mixed',
            quantity: '300 kg',
            status: 'Pending',
            lastUpdated: '2024-03-14',
            description: 'Mixed paper and cardboard'
        },
        {
            id: 3,
            name: 'Glass',
            type: 'Clear',
            quantity: '200 kg',
            status: 'Completed',
            lastUpdated: '2024-03-13',
            description: 'Clear glass bottles and jars'
        },
        {
            id: 4,
            name: 'Metal',
            type: 'Aluminum',
            quantity: '150 kg',
            status: 'In Progress',
            lastUpdated: '2024-03-15',
            description: 'Aluminum cans and containers'
        },
        {
            id: 5,
            name: 'Electronics',
            type: 'Mixed',
            quantity: '100 kg',
            status: 'Pending',
            lastUpdated: '2024-03-14',
            description: 'Mixed electronic waste'
        }
    ];

    const handleMaterialClick = (material) => {
        setSelectedMaterial(material);
        // Reset process steps when selecting a new material
        setRecyclingProcess(prev => ({
            ...prev,
            currentStep: 1,
            steps: prev.steps.map(step => ({
                ...step,
                status: step.id === 1 ? 'in-progress' : 'pending',
                completedAt: null
            }))
        }));
        // Set the recycling tab to process-updates when a material is selected
        setRecyclingTab('process-updates');
    };

    const handleProcessUpdate = (stepId, newStatus) => {
        setRecyclingProcess(prev => {
            const updatedSteps = prev.steps.map(step => {
                if (step.id === stepId) {
                    return {
                        ...step,
                        status: newStatus,
                        completedAt: newStatus === 'completed' ? new Date().toLocaleString() : null
                    };
                }
                return step;
            });

            // Update current step
            let newCurrentStep = prev.currentStep;
            if (newStatus === 'completed' && stepId === prev.currentStep) {
                newCurrentStep = Math.min(prev.currentStep + 1, prev.steps.length);

                // If we're completing the current step, set the next step to in-progress
                if (newCurrentStep <= prev.steps.length) {
                    updatedSteps[newCurrentStep - 1].status = 'in-progress';
                }
            }

            return {
                ...prev,
                currentStep: newCurrentStep,
                steps: updatedSteps
            };
        });
    };

    const handleAddNote = (stepId) => {
        setCurrentStepId(stepId);
        setStepNote('');
        setShowNoteModal(true);
    };

    const handleNoteSubmit = (e) => {
        e.preventDefault();

        setRecyclingProcess(prev => {
            const updatedSteps = prev.steps.map(step => {
                if (step.id === currentStepId) {
                    return {
                        ...step,
                        notes: stepNote
                    };
                }
                return step;
            });

            return {
                ...prev,
                steps: updatedSteps
            };
        });

        setShowNoteModal(false);
    };

    const handleNewBulkChange = (e) => {
        const { name, value } = e.target;
        setNewBulkData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewBulkSubmit = async () => {
        try {
            await addBulkMaterial(newBulkData);
            setShowNewBulkModal(false)
            alert('New recycling bulk added successfully!');
        }catch (error) {
            console.error('Error adding bulk material:', error);
        }

    };

    useEffect(() => {
        const loadBulks = async () => {
            fetchBulkMaterials();
            set
        }
        loadBulks()
    }, []);

    const { handleLogout, loading } = useAuth();

    const onLogout = async () => {
        await handleLogout();
    }

    /**
     * Component Render
     * 
     * The main UI structure with conditional rendering based on the active tab.
     */
    return (
        <div className="recycling-center-home">
            {/* Header Section */}
            <header className="header">
                <div className="logo">
                    <h1>Waste Management System</h1>
                </div>
                <div className="user-info">
                    <span className="user-name">Recycling Center</span>
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
                        <li className={activeTab === 'materials' ? 'active' : ''} onClick={() => setActiveTab('materials')}>
                            <span className="icon">♻️</span> Materials
                        </li>
                    </ul>
                </nav>

                {/* Main Content Area - Conditionally Rendered Based on Active Tab */}
                <main className="content">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="dashboard">
                            <h2>Dashboard</h2>

                            {/* Statistics Cards */}
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <div className="stat-icon">♻️</div>
                                    <div className="stat-info">
                                        <h3>Total Recycled</h3>
                                        <p className="stat-value">{recyclingStats.totalRecycled}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">🥤</div>
                                    <div className="stat-info">
                                        <h3>Plastic Recycled</h3>
                                        <p className="stat-value">{recyclingStats.plasticRecycled}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">📄</div>
                                    <div className="stat-info">
                                        <h3>Paper Recycled</h3>
                                        <p className="stat-value">{recyclingStats.paperRecycled}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">🔧</div>
                                    <div className="stat-info">
                                        <h3>Metal Recycled</h3>
                                        <p className="stat-value">{recyclingStats.metalRecycled}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">🥂</div>
                                    <div className="stat-info">
                                        <h3>Glass Recycled</h3>
                                        <p className="stat-value">{recyclingStats.glassRecycled}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">📈</div>
                                    <div className="stat-info">
                                        <h3>Recycling Rate</h3>
                                        <p className="stat-value">{recyclingStats.recyclingRate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Grid - Recent and Upcoming Collections */}
                            <div className="dashboard-grid">
                                <div className="dashboard-card">
                                    <h3>Recent Recycling</h3>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Material</th>
                                                <th>Date</th>
                                                <th>Weight</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentRecycling.map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.material}</td>
                                                    <td>{item.date}</td>
                                                    <td>{item.weight}</td>
                                                    <td>
                                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button className="view-all-btn">View All Recycling</button>
                                </div>

                                <div className="dashboard-card">
                                    <h3>Upcoming Collections</h3>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Location</th>
                                                <th>Date</th>
                                                <th>Time</th>
                                                <th>Material</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingCollections.map(collection => (
                                                <tr key={collection.id}>
                                                    <td>{collection.location}</td>
                                                    <td>{collection.date}</td>
                                                    <td>{collection.time}</td>
                                                    <td>{collection.material}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <button className="view-all-btn">View Full Schedule</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Materials Tab */}
                    {activeTab === 'materials' && (
                        <div className="materials-section">
                            <div className="section-header">
                                <h2>Recycling Materials</h2>
                                <div className="recycling-filters">
                                    <select
                                        value={recyclingTab}
                                        onChange={(e) => setRecyclingTab(e.target.value)}
                                        className="view-select"
                                    >
                                        <option value="overview">Overview</option>
                                        <option value="process-updates">Process Updates</option>
                                    </select>
                                    <button
                                        className="add-bulk-btn"
                                        onClick={() => setShowNewBulkModal(true)}
                                    >
                                        Add New Recycling Bulk
                                    </button>
                                </div>
                            </div>

                            {/* Add New Bulk Modal */}
                            {showNewBulkModal && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h3>Add New Recycling Bulk</h3>
                                        <div>
                                            <div className="form-group">
                                                <label htmlFor="name">Material Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={newBulkData.name}
                                                    onChange={handleNewBulkChange}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="type">Material Type</label>
                                                <select
                                                    id="type"
                                                    name="type"
                                                    value={newBulkData.type}
                                                    onChange={handleNewBulkChange}
                                                    required
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Plastic">Plastic</option>
                                                    <option value="Paper">Paper</option>
                                                    <option value="Glass">Glass</option>
                                                    <option value="Metal">Metal</option>
                                                    <option value="Electronics">Electronics</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="quantity">Quantity (kg)</label>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    name="quantity"
                                                    value={newBulkData.quantity}
                                                    onChange={handleNewBulkChange}
                                                    required
                                                    min="1"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={newBulkData.description}
                                                    onChange={handleNewBulkChange}
                                                    required
                                                />
                                            </div>
                                            <div className="modal-actions">
                                                <button className="btn-primary" onClick={() =>handleNewBulkSubmit(newBulkData)}>Add Bulk</button>
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => setShowNewBulkModal(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Materials List */}
                            {recyclingTab === 'overview' && (
                                <div className="materials-list">
                                    {recyclingMaterials.map(material => (
                                        <div
                                            key={material.id}
                                            className={`material-card ${selectedMaterial?.id === material.id ? 'selected' : ''}`}
                                            onClick={() => handleMaterialClick(material)}
                                        >
                                            <div className="material-header">
                                                <h3>{material.name}</h3>
                                                <span className={`status-badge ${material.status.toLowerCase().replace(' ', '-')}`}>
                                                    {material.status}
                                                </span>
                                            </div>
                                            <div className="material-details">
                                                <div className="detail-item">
                                                    <span className="detail-label">Type:</span>
                                                    <span className="detail-value">{material.type}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Quantity:</span>
                                                    <span className="detail-value">{material.quantity}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Last Updated:</span>
                                                    <span className="detail-value">{material.lastUpdated}</span>
                                                </div>
                                            </div>
                                            <p className="material-description">{material.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Recycling Process Section */}
                            {recyclingTab === 'process-updates' && selectedMaterial && (
                                <div className="recycling-process-section">
                                    <div className="section-header">
                                        <div>
                                            <h2>Recycling Process - {selectedMaterial.name}</h2>
                                            <p className="material-subtitle">{selectedMaterial.type} • {selectedMaterial.quantity}</p>
                                        </div>
                                        <div className="process-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Current Step</span>
                                                <span className="stat-value">{recyclingProcess.steps.find(step => step.status === 'in-progress')?.name || 'Not Started'}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Last Updated</span>
                                                <span className="stat-value">{new Date().toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="process-overview">
                                        <div className="process-progress">
                                            <div
                                                className="progress-bar"
                                                style={{
                                                    width: `${(recyclingProcess.currentStep / recyclingProcess.steps.length) * 100}%`
                                                }}
                                            />
                                            <span className="progress-text">
                                                Step {recyclingProcess.currentStep} of {recyclingProcess.steps.length}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="process-steps">
                                        {recyclingProcess.steps.map((step, index) => (
                                            <div
                                                key={step.id}
                                                className={`process-step ${step.status} ${step.id === recyclingProcess.currentStep ? 'current' : ''}`}
                                            >
                                                <div className="step-header">
                                                    <div className="step-title">
                                                        <span className="step-number">{index + 1}</span>
                                                        <h3>{step.name}</h3>
                                                    </div>
                                                    <div className="step-actions">
                                                        <span className={`status-badge ${step.status}`}>
                                                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                                        </span>
                                                        {step.id === recyclingProcess.currentStep && (
                                                            <div className="step-controls">
                                                                <button
                                                                    className="btn-action"
                                                                    onClick={() => handleProcessUpdate(step.id, 'completed')}
                                                                    disabled={step.status === 'completed'}
                                                                >
                                                                    Complete Step
                                                                </button>
                                                                <button
                                                                    className="btn-action"
                                                                    onClick={() => handleAddNote(step.id)}
                                                                >
                                                                    Add Note
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="step-description">
                                                    {step.description}
                                                </p>

                                                {step.notes && (
                                                    <div className="step-notes">
                                                        <p className="notes-label">Notes:</p>
                                                        <p className="notes-content">{step.notes}</p>
                                                    </div>
                                                )}

                                                {step.completedAt && (
                                                    <div className="step-timing">
                                                        <div className="timing-item">
                                                            <span className="timing-label">Completed:</span>
                                                            <span className="timing-value">{step.completedAt}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {step.status === 'completed' && (
                                                    <p className="step-completed">
                                                        Completed successfully
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Note to Step</h3>
                        <form onSubmit={handleNoteSubmit}>
                            <div className="form-group">
                                <label htmlFor="stepNote">Note</label>
                                <textarea
                                    id="stepNote"
                                    value={stepNote}
                                    onChange={(e) => setStepNote(e.target.value)}
                                    placeholder="Enter notes about this step..."
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">Save Note</button>
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => setShowNoteModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecyclingCenterHome; 