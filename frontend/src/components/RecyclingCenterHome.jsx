import {useEffect, useState} from 'react';
import './RecyclingCenterHome.css';
import useAuth from "../hooks/use-auth.js";
import Material from "./waste-collection-home/recycle-center-home/material.jsx";
import { fetchRecyclingStats } from '../utils/recycling.js';

const RecyclingCenterHome = () => {
    // State to track the active tab in the sidebar navigation
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [stepNote, setStepNote] = useState('');
    const [recentRecycling, setRecentRecycling] = useState([]);
    const [upcomingCollections, setUpcomingCollections] = useState([]);

    const [recyclingStats, setRecyclingStats] = useState({
        totalMaterials: 0,
        totalWeight: '0 kg',
        recyclingRate: '0%',
        averageProcessingTime: '0 hours',
        materialDistribution: []
    });

    useEffect(() => {
        const loadRecyclingData = async () => {
            try {
                const stats = await fetchRecyclingStats();
                setRecyclingStats(stats);
                setRecentRecycling(stats.recentRecycling);
                setUpcomingCollections(stats.upcomingCollections);
            } catch (error) {
                console.error('Error loading recycling data:', error);
            }
        };

        loadRecyclingData();
    }, []);

    const { handleLogout, loading } = useAuth();

    const onLogout = async () => {
        await handleLogout();
    }

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
                                        <h3>Total Materials</h3>
                                        <p className="stat-value">{recyclingStats.totalMaterials}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">⚖️</div>
                                    <div className="stat-info">
                                        <h3>Total Weight</h3>
                                        <p className="stat-value">{recyclingStats.totalWeight}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">📈</div>
                                    <div className="stat-info">
                                        <h3>Recycling Rate</h3>
                                        <p className="stat-value">{recyclingStats.recyclingRate}</p>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-icon">⏱️</div>
                                    <div className="stat-info">
                                        <h3>Avg. Processing Time</h3>
                                        <p className="stat-value">{recyclingStats.averageProcessingTime}</p>
                                    </div>
                                </div>

                                {recyclingStats.materialDistribution.map((material, index) => (
                                    <div className="stat-card" key={index}>
                                        <div className="stat-icon">📦</div>
                                        <div className="stat-info">
                                            <h3>{material.type}</h3>
                                            <p className="stat-value">{material.count} ({material.percentage}%)</p>
                                        </div>
                                    </div>
                                ))}
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
                                            {recentRecycling.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.material}</td>
                                                    <td>{item.date}</td>
                                                    <td>{item.weight}</td>
                                                    <td>
                                                        <span className={`status-badge ${(item.status || '').toLowerCase()}`}>
                                                            {item.status || 'Pending'}
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
                                            {upcomingCollections.map((collection, index) => (
                                                <tr key={index}>
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
                        <Material/>
                    )}
                </main>
            </div>

            {/* Note Modal */}
            {showNoteModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Note to Step</h3>
                        <form onSubmit={(e) => {
                            console.log(e)}}>
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