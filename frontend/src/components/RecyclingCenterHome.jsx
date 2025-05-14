import {useEffect, useState} from 'react';
import './RecyclingCenterHome.css';
import useAuth from "../hooks/use-auth.js";
import {fetchBulkMaterials} from "../utils/bulk-collection.js";
import Material from "./waste-collection-home/recycle-center-home/material.jsx";

const RecyclingCenterHome = () => {
    // State to track the active tab in the sidebar navigation
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [stepNote, setStepNote] = useState('');
    const [recentRecycling, setRecentRecycling] = useState([]);

    const [recyclingStats, setRecyclingStats] = useState({
        totalRecycled: '0 kg',
        plasticRecycled: '0 kg',
        paperRecycled: '0 kg',
        metalRecycled: '0 kg',
        glassRecycled: '0 kg',
        recyclingRate: '0%',
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const bulks = await fetchBulkMaterials();

                // Filter completed bulks only
                const completedBulks = bulks.filter(bulk => bulk.status === 2);

                const stats = {
                    Plastic: 0,
                    Paper: 0,
                    Metal: 0,
                    Glass: 0,
                };

                let total = 0;

                completedBulks.forEach(bulk => {
                    const type = bulk.type;
                    const amount = Number(bulk.quantity) || 0;
                    if (Object.prototype.hasOwnProperty.call(stats, type)) {
                        stats[type] += amount;
                        total += amount;
                    }
                });

                const recyclingRate = total > 0 ? '100%' : '0%';

                setRecyclingStats({
                    totalRecycled: `${total} kg`,
                    plasticRecycled: `${stats.Plastic} kg`,
                    paperRecycled: `${stats.Paper} kg`,
                    metalRecycled: `${stats.Metal} kg`,
                    glassRecycled: `${stats.Glass} kg`,
                    recyclingRate,
                });

            } catch (error) {
                console.error('Failed to fetch recycling stats:', error);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const fetchRecent = async () => {
            const bulks = await fetchBulkMaterials();
            if (!bulks) return;

            const fiveDaysAgo = new Date();
            fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

            const recent = bulks
                .filter(bulk =>
                    bulk.status === 2 &&
                    new Date(bulk.lastUpdated?.toDate?.() || bulk.updatedAt) >= fiveDaysAgo
                )
                .map(bulk => ({
                    id: bulk.id,
                    material: bulk.type,
                    date: new Date(bulk.lastUpdated?.toDate?.() || bulk.lastUpdated).toISOString().split('T')[0],
                    weight: `${bulk.amount} kg`,
                    status: 'Processed'
                }))
                .sort((a, b) => new Date(b.date) - new Date(a.date)); // optional: newest first

            setRecentRecycling(recent);
            console.log(recentRecycling)
        };

        fetchRecent();
    }, []);



    // const recentRecycling = [
    //     { id: 1, material: 'Plastic', date: '2024-03-15', weight: '45 kg', status: 'Processed' },
    //     { id: 2, material: 'Paper', date: '2024-03-15', weight: '32 kg', status: 'Processed' },
    //     { id: 3, material: 'Metal', date: '2024-03-14', weight: '28 kg', status: 'Processed' },
    //     { id: 4, material: 'Glass', date: '2024-03-14', weight: '15 kg', status: 'Processing' },
    //     { id: 5, material: 'Plastic', date: '2024-03-14', weight: '38 kg', status: 'Processing' },
    // ];

    const upcomingCollections = [
        { id: 6, location: '987 Cedar Ln', date: '2024-03-16', time: '09:00 AM', material: 'Mixed' },
        { id: 7, location: '147 Birch St', date: '2024-03-16', time: '10:30 AM', material: 'Plastic' },
        { id: 8, location: '258 Willow Ave', date: '2024-03-17', time: '08:00 AM', material: 'Paper' },
        { id: 9, location: '369 Spruce Rd', date: '2024-03-17', time: '11:00 AM', material: 'Metal' },
        { id: 10, location: '741 Fir Dr', date: '2024-03-18', time: '09:30 AM', material: 'Glass' },
    ];

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