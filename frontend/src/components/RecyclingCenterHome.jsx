/**
 * RecyclingCenterHome Component
 * 
 * This component serves as the main dashboard for the recycling center.
 * It provides a comprehensive interface for managing recycling operations,
 * tracking recycled materials, and monitoring recycling statistics.
 */

import {useState} from 'react';
import './RecyclingCenterHome.css';
import useAuth from "../hooks/use-auth.js";

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

    /**
     * Recycling Process Data
     * 
     * Mock data for the recycling process steps and current status.
     * Each process has multiple stages with tracking information.
     */
    const recyclingProcesses = [
        {
            id: 1,
            material: 'Plastic',
            batchId: 'PL-2024-001',
            startDate: '2024-03-10',
            currentStage: 'Sorting',
            stages: [
                { name: 'Collection', status: 'Completed', date: '2024-03-10', notes: 'Collected from 5 locations' },
                { name: 'Sorting', status: 'In Progress', date: '2024-03-11', notes: 'Separating by type and color' },
                { name: 'Cleaning', status: 'Pending', date: null, notes: null },
                { name: 'Shredding', status: 'Pending', date: null, notes: null },
                { name: 'Pelletization', status: 'Pending', date: null, notes: null },
                { name: 'Quality Check', status: 'Pending', date: null, notes: null },
                { name: 'Packaging', status: 'Pending', date: null, notes: null }
            ],
            estimatedCompletion: '2024-03-18',
            assignedStaff: 'John Smith, Maria Garcia',
            equipment: 'Sorting Line A, Conveyor Belt 2'
        },
        {
            id: 2,
            material: 'Paper',
            batchId: 'PP-2024-003',
            startDate: '2024-03-12',
            currentStage: 'Pulping',
            stages: [
                { name: 'Collection', status: 'Completed', date: '2024-03-12', notes: 'Collected from 3 locations' },
                { name: 'Sorting', status: 'Completed', date: '2024-03-13', notes: 'Separated by grade' },
                { name: 'Pulping', status: 'In Progress', date: '2024-03-14', notes: 'Using chemical pulping method' },
                { name: 'Screening', status: 'Pending', date: null, notes: null },
                { name: 'Deinking', status: 'Pending', date: null, notes: null },
                { name: 'Refining', status: 'Pending', date: null, notes: null },
                { name: 'Paper Making', status: 'Pending', date: null, notes: null },
                { name: 'Drying', status: 'Pending', date: null, notes: null },
                { name: 'Rolling', status: 'Pending', date: null, notes: null }
            ],
            estimatedCompletion: '2024-03-20',
            assignedStaff: 'David Chen, Sarah Johnson',
            equipment: 'Pulper 1, Paper Machine B'
        },
        {
            id: 3,
            material: 'Glass',
            batchId: 'GL-2024-002',
            startDate: '2024-03-11',
            currentStage: 'Cleaning',
            stages: [
                { name: 'Collection', status: 'Completed', date: '2024-03-11', notes: 'Collected from 4 locations' },
                { name: 'Sorting', status: 'Completed', date: '2024-03-12', notes: 'Separated by color' },
                { name: 'Cleaning', status: 'In Progress', date: '2024-03-13', notes: 'Removing labels and contaminants' },
                { name: 'Crushing', status: 'Pending', date: null, notes: null },
                { name: 'Melting', status: 'Pending', date: null, notes: null },
                { name: 'Molding', status: 'Pending', date: null, notes: null },
                { name: 'Annealing', status: 'Pending', date: null, notes: null },
                { name: 'Quality Inspection', status: 'Pending', date: null, notes: null }
            ],
            estimatedCompletion: '2024-03-19',
            assignedStaff: 'Michael Brown, Lisa Wong',
            equipment: 'Glass Crusher, Furnace 3'
        },
        {
            id: 4,
            material: 'Metal',
            batchId: 'MT-2024-004',
            startDate: '2024-03-13',
            currentStage: 'Collection',
            stages: [
                { name: 'Collection', status: 'In Progress', date: '2024-03-13', notes: 'Collecting from 6 locations' },
                { name: 'Sorting', status: 'Pending', date: null, notes: null },
                { name: 'Shredding', status: 'Pending', date: null, notes: null },
                { name: 'Magnetic Separation', status: 'Pending', date: null, notes: null },
                { name: 'Melting', status: 'Pending', date: null, notes: null },
                { name: 'Purification', status: 'Pending', date: null, notes: null },
                { name: 'Solidification', status: 'Pending', date: null, notes: null },
                { name: 'Quality Testing', status: 'Pending', date: null, notes: null }
            ],
            estimatedCompletion: '2024-03-22',
            assignedStaff: 'Robert Wilson, Emily Davis',
            equipment: 'Metal Shredder, Furnace 1'
        }
    ];

    /**
     * Schedule Data
     * 
     * Mock data for the recycling center's schedule.
     * Includes collection schedules, processing schedules, and staff assignments.
     */
    const scheduleData = {
        // Collection schedules
        collections: [
            { id: 1, type: 'Collection', title: 'Plastic Collection - Route A', date: '2024-03-16', startTime: '08:00 AM', endTime: '12:00 PM', location: 'Downtown Area', assignedTo: 'John Smith, Maria Garcia', vehicle: 'Truck A-123', status: 'Scheduled' },
            { id: 2, type: 'Collection', title: 'Paper Collection - Route B', date: '2024-03-16', startTime: '09:00 AM', endTime: '01:00 PM', location: 'Suburban Area', assignedTo: 'David Chen, Sarah Johnson', vehicle: 'Truck B-456', status: 'Scheduled' },
            { id: 3, type: 'Collection', title: 'Glass Collection - Route C', date: '2024-03-17', startTime: '08:30 AM', endTime: '11:30 AM', location: 'Industrial Area', assignedTo: 'Michael Brown, Lisa Wong', vehicle: 'Truck C-789', status: 'Scheduled' },
            { id: 4, type: 'Collection', title: 'Metal Collection - Route D', date: '2024-03-17', startTime: '10:00 AM', endTime: '02:00 PM', location: 'Commercial Area', assignedTo: 'Robert Wilson, Emily Davis', vehicle: 'Truck D-012', status: 'Scheduled' },
            { id: 5, type: 'Collection', title: 'Mixed Recycling - Route E', date: '2024-03-18', startTime: '09:30 AM', endTime: '01:30 PM', location: 'Residential Area', assignedTo: 'John Smith, Maria Garcia', vehicle: 'Truck E-345', status: 'Scheduled' },
        ],

        // Processing schedules
        processing: [
            { id: 6, type: 'Processing', title: 'Plastic Sorting - Batch PL-2024-001', date: '2024-03-16', startTime: '01:00 PM', endTime: '05:00 PM', location: 'Sorting Facility', assignedTo: 'John Smith, Maria Garcia', equipment: 'Sorting Line A', status: 'Scheduled' },
            { id: 7, type: 'Processing', title: 'Paper Pulping - Batch PP-2024-003', date: '2024-03-16', startTime: '02:00 PM', endTime: '06:00 PM', location: 'Processing Plant', assignedTo: 'David Chen, Sarah Johnson', equipment: 'Pulper 1', status: 'Scheduled' },
            { id: 8, type: 'Processing', title: 'Glass Cleaning - Batch GL-2024-002', date: '2024-03-17', startTime: '01:30 PM', endTime: '04:30 PM', location: 'Cleaning Station', assignedTo: 'Michael Brown, Lisa Wong', equipment: 'Cleaning Unit 2', status: 'Scheduled' },
            { id: 9, type: 'Processing', title: 'Metal Shredding - Batch MT-2024-004', date: '2024-03-18', startTime: '09:00 AM', endTime: '12:00 PM', location: 'Shredding Facility', assignedTo: 'Robert Wilson, Emily Davis', equipment: 'Metal Shredder', status: 'Scheduled' },
            { id: 10, type: 'Processing', title: 'Quality Inspection - All Materials', date: '2024-03-19', startTime: '10:00 AM', endTime: '03:00 PM', location: 'Quality Lab', assignedTo: 'Quality Team', equipment: 'Testing Equipment', status: 'Scheduled' },
        ],

        // Staff schedules
        staff: [
            { id: 11, type: 'Staff', title: 'John Smith', date: '2024-03-16', startTime: '08:00 AM', endTime: '05:00 PM', role: 'Collection Driver', location: 'Various Locations', status: 'Scheduled' },
            { id: 12, type: 'Staff', title: 'Maria Garcia', date: '2024-03-16', startTime: '08:00 AM', endTime: '05:00 PM', role: 'Collection Assistant', location: 'Various Locations', status: 'Scheduled' },
            { id: 13, type: 'Staff', title: 'David Chen', date: '2024-03-16', startTime: '09:00 AM', endTime: '06:00 PM', role: 'Processing Operator', location: 'Processing Plant', status: 'Scheduled' },
            { id: 14, type: 'Staff', title: 'Sarah Johnson', date: '2024-03-16', startTime: '09:00 AM', endTime: '06:00 PM', role: 'Processing Assistant', location: 'Processing Plant', status: 'Scheduled' },
            { id: 15, type: 'Staff', title: 'Michael Brown', date: '2024-03-17', startTime: '08:30 AM', endTime: '04:30 PM', role: 'Glass Processing Specialist', location: 'Glass Processing Area', status: 'Scheduled' },
            { id: 16, type: 'Staff', title: 'Lisa Wong', date: '2024-03-17', startTime: '08:30 AM', endTime: '04:30 PM', role: 'Glass Processing Assistant', location: 'Glass Processing Area', status: 'Scheduled' },
            { id: 17, type: 'Staff', title: 'Robert Wilson', date: '2024-03-18', startTime: '09:00 AM', endTime: '05:00 PM', role: 'Metal Processing Specialist', location: 'Metal Processing Area', status: 'Scheduled' },
            { id: 18, type: 'Staff', title: 'Emily Davis', date: '2024-03-18', startTime: '09:00 AM', endTime: '05:00 PM', role: 'Metal Processing Assistant', location: 'Metal Processing Area', status: 'Scheduled' },
            { id: 19, type: 'Staff', title: 'Quality Team', date: '2024-03-19', startTime: '10:00 AM', endTime: '03:00 PM', role: 'Quality Inspectors', location: 'Quality Lab', status: 'Scheduled' },
        ],

        // Equipment schedules
        equipment: [
            { id: 20, type: 'Equipment', title: 'Truck A-123', date: '2024-03-16', startTime: '08:00 AM', endTime: '12:00 PM', purpose: 'Plastic Collection', assignedTo: 'John Smith, Maria Garcia', status: 'Scheduled' },
            { id: 21, type: 'Equipment', title: 'Truck B-456', date: '2024-03-16', startTime: '09:00 AM', endTime: '01:00 PM', purpose: 'Paper Collection', assignedTo: 'David Chen, Sarah Johnson', status: 'Scheduled' },
            { id: 22, type: 'Equipment', title: 'Truck C-789', date: '2024-03-17', startTime: '08:30 AM', endTime: '11:30 AM', purpose: 'Glass Collection', assignedTo: 'Michael Brown, Lisa Wong', status: 'Scheduled' },
            { id: 23, type: 'Equipment', title: 'Truck D-012', date: '2024-03-17', startTime: '10:00 AM', endTime: '02:00 PM', purpose: 'Metal Collection', assignedTo: 'Robert Wilson, Emily Davis', status: 'Scheduled' },
            { id: 24, type: 'Equipment', title: 'Truck E-345', date: '2024-03-18', startTime: '09:30 AM', endTime: '01:30 PM', purpose: 'Mixed Recycling Collection', assignedTo: 'John Smith, Maria Garcia', status: 'Scheduled' },
            { id: 25, type: 'Equipment', title: 'Sorting Line A', date: '2024-03-16', startTime: '01:00 PM', endTime: '05:00 PM', purpose: 'Plastic Sorting', assignedTo: 'John Smith, Maria Garcia', status: 'Scheduled' },
            { id: 26, type: 'Equipment', title: 'Pulper 1', date: '2024-03-16', startTime: '02:00 PM', endTime: '06:00 PM', purpose: 'Paper Pulping', assignedTo: 'David Chen, Sarah Johnson', status: 'Scheduled' },
            { id: 27, type: 'Equipment', title: 'Cleaning Unit 2', date: '2024-03-17', startTime: '01:30 PM', endTime: '04:30 PM', purpose: 'Glass Cleaning', assignedTo: 'Michael Brown, Lisa Wong', status: 'Scheduled' },
            { id: 28, type: 'Equipment', title: 'Metal Shredder', date: '2024-03-18', startTime: '09:00 AM', endTime: '12:00 PM', purpose: 'Metal Shredding', assignedTo: 'Robert Wilson, Emily Davis', status: 'Scheduled' },
            { id: 29, type: 'Equipment', title: 'Testing Equipment', date: '2024-03-19', startTime: '10:00 AM', endTime: '03:00 PM', purpose: 'Quality Inspection', assignedTo: 'Quality Team', status: 'Scheduled' },
        ]
    };

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

    const handleNewBulkSubmit = (e) => {
        e.preventDefault();

        // Create a new bulk entry
        const newBulk = {
            id: recyclingMaterials.length + 1,
            name: newBulkData.name,
            type: newBulkData.type,
            quantity: `${newBulkData.quantity} kg`,
            status: 'Pending',
            lastUpdated: new Date().toISOString().split('T')[0],
            description: newBulkData.description,
            processingStatus: {
                currentStep: 'Collection',
                steps: [
                    { id: 'Collection', status: 'pending', startTime: null, endTime: null },
                    { id: 'Sorting', status: 'pending', startTime: null, endTime: null },
                    { id: 'Cleaning', status: 'pending', startTime: null, endTime: null },
                    { id: 'Processing', status: 'pending', startTime: null, endTime: null },
                    { id: 'Quality Check', status: 'pending', startTime: null, endTime: null },
                    { id: 'Packaging', status: 'pending', startTime: null, endTime: null }
                ]
            }
        };

        // Add the new bulk to the materials list
        setRecyclingMaterials(prev => [...prev, newBulk]);

        // Reset the form
        setNewBulkData({
            name: '',
            type: '',
            quantity: '',
            description: ''
        });

        // Close the modal
        setShowNewBulkModal(false);

        // Show success message (you can implement a toast or notification system)
        alert('New recycling bulk added successfully!');
    };

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
                                        <form onSubmit={handleNewBulkSubmit}>
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
                                                <button type="submit" className="btn-primary">Add Bulk</button>
                                                <button
                                                    type="button"
                                                    className="btn-secondary"
                                                    onClick={() => setShowNewBulkModal(false)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
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