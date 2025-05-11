/**
 * ShopTransactionHistory Component
 * 
 * This component displays the transaction history for the shop section,
 * including statistics, filters, and a detailed transaction table.
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ShopTransactionHistory.css';

const ShopTransactionHistory = () => {
    // Mock data for shop transactions
    const [transactions] = useState([
        {
            id: 1,
            date: '2024-03-15',
            time: '10:30 AM',
            customer: 'John Smith',
            items: [
                { name: 'Large Recycling Bin', quantity: 1, price: 89.99 },
                { name: 'Safety Gloves', quantity: 2, price: 24.99 }
            ],
            total: 139.97,
            paymentMethod: 'Credit Card',
            status: 'Completed',
            reference: 'SHOP-2024-001'
        },
        {
            id: 2,
            date: '2024-03-15',
            time: '02:15 PM',
            customer: 'Jane Doe',
            items: [
                { name: 'Plastic Recycling Bundle', quantity: 1, price: 149.99 },
                { name: 'Recycling Education Kit', quantity: 1, price: 149.99 }
            ],
            total: 299.98,
            paymentMethod: 'Credit Card',
            status: 'Completed',
            reference: 'SHOP-2024-002'
        },
        {
            id: 3,
            date: '2024-03-15',
            time: '04:45 PM',
            customer: 'Robert Johnson',
            items: [
                { name: 'Premium Organic Compost', quantity: 3, price: 29.99 },
                { name: 'Home Composting Kit', quantity: 1, price: 79.99 }
            ],
            total: 169.96,
            paymentMethod: 'Cash',
            status: 'Completed',
            reference: 'SHOP-2024-003'
        },
        {
            id: 4,
            date: '2024-03-15',
            time: '05:30 PM',
            customer: 'Emily Davis',
            items: [
                { name: 'Herb Garden Starter Kit', quantity: 2, price: 49.99 },
                { name: 'Organic Fertilizer Mix', quantity: 1, price: 39.99 }
            ],
            total: 139.97,
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            reference: 'SHOP-2024-004'
        }
    ]);

    // Transaction statistics
    const transactionStats = {
        totalTransactions: transactions.length,
        totalRevenue: transactions.reduce((sum, t) => sum + t.total, 0),
        completedTransactions: transactions.filter(t => t.status === 'Completed').length,
        pendingTransactions: transactions.filter(t => t.status === 'Pending').length,
        averageTransactionValue: transactions.reduce((sum, t) => sum + t.total, 0) / transactions.length
    };

    // State for filters
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');

    // Filter transactions based on selected filters
    const filteredTransactions = transactions.filter(transaction => {
        const matchesDate = !dateFilter || transaction.date === dateFilter;
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        const matchesPayment = paymentFilter === 'all' || transaction.paymentMethod === paymentFilter;
        return matchesDate && matchesStatus && matchesPayment;
    });

    return (
        <div className="shop-transaction-history">
            <div className="page-header">
                <h1>Shop Transaction History</h1>
                <Link to="/waste-collection" className="back-btn">
                    Back to Dashboard
                </Link>
            </div>

            {/* Transaction Statistics */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="stat-value">${transactionStats.totalRevenue.toFixed(2)}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                        <h3>Total Transactions</h3>
                        <p className="stat-value">{transactionStats.totalTransactions}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>Completed</h3>
                        <p className="stat-value">{transactionStats.completedTransactions}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>Pending</h3>
                        <p className="stat-value">{transactionStats.pendingTransactions}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters">
                <div className="filter-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Payment Method:</label>
                    <select
                        value={paymentFilter}
                        onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                        <option value="all">All Methods</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>

                <button
                    className="reset-filters-btn"
                    onClick={() => {
                        setDateFilter('');
                        setStatusFilter('all');
                        setPaymentFilter('all');
                    }}
                >
                    Reset Filters
                </button>
            </div>

            {/* Transaction Table */}
            <div className="transaction-table-container">
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Reference</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.date} {transaction.time}</td>
                                <td>{transaction.customer}</td>
                                <td>
                                    <ul className="transaction-items">
                                        {transaction.items.map((item, index) => (
                                            <li key={index}>
                                                {item.quantity}x {item.name} (${item.price.toFixed(2)})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>${transaction.total.toFixed(2)}</td>
                                <td>{transaction.paymentMethod}</td>
                                <td>
                                    <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td>{transaction.reference}</td>
                                <td>
                                    <button className="action-btn view">View Details</button>
                                    <button className="action-btn print">Print Receipt</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Export Options */}
            <div className="export-options">
                <button className="export-btn">Export to Excel</button>
                <button className="export-btn">Export to PDF</button>
                <button className="export-btn">Print Report</button>
            </div>
        </div>
    );
};

export default ShopTransactionHistory; 