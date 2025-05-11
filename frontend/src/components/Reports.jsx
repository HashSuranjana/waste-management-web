/**
 * Reports Component
 * 
 * This component displays various charts and reports related to waste collection data.
 * It provides visualizations for collection volumes, waste types, completion rates,
 * and area performance.
 */

import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './Reports.css';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    // State for date range selection
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        endDate: new Date(),
    });

    // State for time period selection
    const [timePeriod, setTimePeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly'

    // Mock data for charts
    const [chartData, setChartData] = useState({
        monthlyCollection: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Waste Collected (kg)',
                    data: [1200, 1350, 1100, 1500, 1300, 1400],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                },
            ],
        },
        wasteTypeDistribution: {
            labels: ['Mixed', 'Organic', 'Recyclable', 'Hazardous'],
            datasets: [
                {
                    data: [40, 30, 20, 10],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(201, 203, 207)',
                    ],
                },
            ],
        },
        completionRate: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Completion Rate (%)',
                    data: [95, 92, 88, 94, 90, 93],
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1,
                },
            ],
        },
        pendingVsCompleted: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Completed',
                    data: [120, 130, 110, 140, 125, 135],
                    backgroundColor: 'rgb(75, 192, 192)',
                },
                {
                    label: 'Pending',
                    data: [5, 8, 12, 6, 10, 7],
                    backgroundColor: 'rgb(255, 99, 132)',
                },
            ],
        },
        areaPerformance: {
            labels: ['Area A', 'Area B', 'Area C', 'Area D', 'Area E'],
            datasets: [
                {
                    label: 'Collections',
                    data: [250, 180, 220, 150, 200],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                },
                {
                    label: 'Completion Rate (%)',
                    data: [95, 88, 92, 85, 90],
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                },
            ],
        },
        topWasteAreas: {
            labels: ['Area A', 'Area B', 'Area C', 'Area D', 'Area E'],
            datasets: [
                {
                    label: 'Waste Generated (kg)',
                    data: [1200, 950, 850, 750, 650],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
            ],
        },
        // Add daily collection data
        dailyCollection: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Waste Collected (kg)',
                    data: [250, 300, 280, 320, 290, 180, 150],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: true,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                },
            ],
        },

        // Add daily collection by type
        dailyCollectionByType: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Mixed Waste',
                    data: [100, 120, 110, 130, 115, 70, 60],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
                {
                    label: 'Organic Waste',
                    data: [80, 90, 85, 95, 88, 50, 40],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                    label: 'Recyclable',
                    data: [50, 60, 55, 65, 57, 40, 30],
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                },
                {
                    label: 'Hazardous',
                    data: [20, 30, 30, 30, 30, 20, 20],
                    backgroundColor: 'rgba(201, 203, 207, 0.5)',
                },
            ],
        },

        // Add daily completion rate
        dailyCompletionRate: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Completion Rate (%)',
                    data: [98, 95, 97, 96, 94, 90, 85],
                    borderColor: 'rgb(153, 102, 255)',
                    tension: 0.1,
                },
            ],
        },
    });

    // Handle date range change
    const handleDateRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: new Date(value)
        }));
    };

    // Handle time period change
    const handleTimePeriodChange = (e) => {
        setTimePeriod(e.target.value);
    };

    return (
        <div className="reports-container">
            <div className="reports-header">
                <h2>Waste Collection Reports</h2>
                <div className="reports-controls">
                    <div className="time-period-selector">
                        <label htmlFor="timePeriod">Time Period:</label>
                        <select
                            id="timePeriod"
                            value={timePeriod}
                            onChange={handleTimePeriodChange}
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
                    </div>
                    <div className="date-range-selector">
                        <div className="date-input">
                            <label htmlFor="startDate">Start Date:</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={dateRange.startDate.toISOString().split('T')[0]}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                        <div className="date-input">
                            <label htmlFor="endDate">End Date:</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={dateRange.endDate.toISOString().split('T')[0]}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Daily Collection Volume */}
                <div className="chart-card">
                    <h3>Daily Collection Volume</h3>
                    <Line
                        data={chartData.dailyCollection}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Daily Waste Collection Volume',
                                },
                            },
                        }}
                    />
                </div>

                {/* Daily Collection by Type */}
                <div className="chart-card">
                    <h3>Daily Collection by Waste Type</h3>
                    <Bar
                        data={chartData.dailyCollectionByType}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Daily Collection by Waste Type',
                                },
                            },
                        }}
                    />
                </div>

                {/* Daily Completion Rate */}
                <div className="chart-card">
                    <h3>Daily Completion Rate</h3>
                    <Line
                        data={chartData.dailyCompletionRate}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Daily Collection Completion Rate',
                                },
                            },
                        }}
                    />
                </div>

                {/* Monthly Collection Volume */}
                <div className="chart-card">
                    <h3>Monthly Collection Volume</h3>
                    <Line
                        data={chartData.monthlyCollection}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Monthly Waste Collection Volume',
                                },
                            },
                        }}
                    />
                </div>

                {/* Waste Type Distribution */}
                <div className="chart-card">
                    <h3>Waste Type Distribution</h3>
                    <Pie
                        data={chartData.wasteTypeDistribution}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Distribution of Waste Types',
                                },
                            },
                        }}
                    />
                </div>

                {/* Collection Completion Rate */}
                <div className="chart-card">
                    <h3>Collection Completion Rate</h3>
                    <Line
                        data={chartData.completionRate}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Collection Completion Rate Over Time',
                                },
                            },
                        }}
                    />
                </div>

                {/* Pending vs Completed Collections */}
                <div className="chart-card">
                    <h3>Pending vs Completed Collections</h3>
                    <Bar
                        data={chartData.pendingVsCompleted}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Collection Status Comparison',
                                },
                            },
                        }}
                    />
                </div>

                {/* Area Performance */}
                <div className="chart-card">
                    <h3>Area Performance</h3>
                    <Bar
                        data={chartData.areaPerformance}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Performance by Area',
                                },
                            },
                        }}
                    />
                </div>

                {/* Top Waste Generating Areas */}
                <div className="chart-card">
                    <h3>Top Waste Generating Areas</h3>
                    <Bar
                        data={chartData.topWasteAreas}
                        options={{
                            indexAxis: 'y',
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Areas with Highest Waste Generation',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Reports; 