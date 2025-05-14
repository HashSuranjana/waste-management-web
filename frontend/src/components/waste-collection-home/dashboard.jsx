import React, { useState, useEffect } from 'react'
import { fetchSchedules } from '../../utils/collections.js';

const Dashboard = () => {
    const [collectionStats, setCollectionStats] = useState({
        totalCollections: 0,
        pendingCollections: 0,
        completedCollections: 0,
        inProgressCollections: 0,
        totalWasteCollected: '0 kg',
        recyclingRate: '0%'
    });
    const [upcomingCollections, setUpcomingCollections] = useState([]);
    const [recentCollections, setRecentCollections] = useState([]);

    useEffect(() => {
        const loadCollectionData = async () => {
            try {
                const collections = await fetchSchedules();
                
                // Calculate statistics
                const completed = collections.filter(c => c.status === 'Completed');
                const pending = collections.filter(c => c.status === 'Scheduled');
                const inProgress = collections.filter(c => c.status === 'In Progress');
                
                // Calculate total waste collected (assuming weight is stored in format "XX kg")
                const totalWaste = completed.reduce((total, curr) => {
                    const weight = curr.weight ? parseInt(curr.weight.split(' ')[0]) : 0;
                    return total + weight;
                }, 0);
                
                // Calculate recycling rate (assuming wasteType can be 'Recyclable')
                const recyclableWaste = completed.filter(c => c.wasteType === 'Recyclable').length;
                const recyclingRate = completed.length > 0 
                    ? Math.round((recyclableWaste / completed.length) * 100)
                    : 0;

                setCollectionStats({
                    totalCollections: collections.length,
                    pendingCollections: pending.length,
                    completedCollections: completed.length,
                    inProgressCollections: inProgress.length,
                    totalWasteCollected: `${totalWaste} kg`,
                    recyclingRate: `${recyclingRate}%`
                });

                // Set recent collections (last 5 completed or pending)
                const sortedRecent = [...collections]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 5);
                setRecentCollections(sortedRecent);

                // Set upcoming collections (next 5 scheduled)
                const today = new Date();
                const upcoming = collections
                    .filter(c => c.status === 'Scheduled' && new Date(c.date) >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5);
                setUpcomingCollections(upcoming);
            } catch (error) {
                console.error('Error loading collection data:', error);
            }
        };

        loadCollectionData();
    }, []);

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>

            {/* Dashboard Content */}
            <div className="dashboard-content">
                {/* Statistics Cards */}
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">🗑️</div>
                        <div className="stat-info">
                            <h3>Total Collections</h3>
                            <p className="stat-value">{collectionStats.totalCollections}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>Pending Collections</h3>
                            <p className="stat-value">{collectionStats.pendingCollections}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Completed Collections</h3>
                            <p className="stat-value">{collectionStats.completedCollections}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">♻️</div>
                        <div className="stat-info">
                            <h3>Recycling Rate</h3>
                            <p className="stat-value">{collectionStats.recyclingRate}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid - Recent and Upcoming Collections */}
                <div className="dashboard-grid">
                    <div className="dashboard-card">
                        <h3>Recent Collections</h3>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Waste Type</th>
                                <th>Weight</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentCollections.map(collection => (
                                <tr key={collection.id}>
                                    <td>{collection.location}</td>
                                    <td>{collection.date}</td>
                                    <td>
                                                            <span className={`status-badge ${collection.status.toLowerCase()}`}>
                                                                {collection.status}
                                                            </span>
                                    </td>
                                    <td>{collection.wasteType}</td>
                                    <td>{collection.weight}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button className="view-all-btn">View All Collections</button>
                    </div>

                    <div className="dashboard-card">
                        <h3>Upcoming Collections</h3>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Waste Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {upcomingCollections.map(collection => (
                                <tr key={collection.id}>
                                    <td>{collection.location}</td>
                                    <td>{collection.date}</td>
                                    <td>{collection.time}</td>
                                    <td>{collection.wasteType}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <button className="view-all-btn">View Full Schedule</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Dashboard
