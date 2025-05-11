import React from 'react'

const Dashboard = () => {
    const collectionStats = {
        totalCollections: 156,
        pendingCollections: 23,
        completedCollections: 133,
        inProgressCollections: 22,
        totalWasteCollected: '2,450 kg',
        recyclingRate: '68%'
    };
    const recentCollections = [
        { id: 1, location: '123 Main St', date: '2023-04-08', status: 'Completed', wasteType: 'Mixed', weight: '45 kg' },
        { id: 2, location: '456 Oak Ave', date: '2023-04-07', status: 'Completed', wasteType: 'Organic', weight: '32 kg' },
        { id: 3, location: '789 Pine Rd', date: '2023-04-07', status: 'Completed', wasteType: 'Recyclable', weight: '28 kg' },
        { id: 4, location: '321 Elm St', date: '2023-04-06', status: 'Pending', wasteType: 'Mixed', weight: 'N/A' },
        { id: 5, location: '654 Maple Dr', date: '2023-04-06', status: 'Pending', wasteType: 'Organic', weight: 'N/A' },
    ];

    const upcomingCollections = [
        { id: 6, location: '987 Cedar Ln', date: '2023-04-09', time: '09:00 AM', wasteType: 'Mixed' },
        { id: 7, location: '147 Birch St', date: '2023-04-09', time: '10:30 AM', wasteType: 'Recyclable' },
        { id: 8, location: '258 Willow Ave', date: '2023-04-10', time: '08:00 AM', wasteType: 'Organic' },
        { id: 9, location: '369 Spruce Rd', date: '2023-04-10', time: '11:00 AM', wasteType: 'Mixed' },
        { id: 10, location: '741 Fir Dr', date: '2023-04-11', time: '09:30 AM', wasteType: 'Recyclable' },
    ];

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
