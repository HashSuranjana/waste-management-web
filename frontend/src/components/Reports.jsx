/**
 * Reports Component
 * 
 * This component displays various charts and reports related to waste collection data.
 * It provides visualizations for collection volumes, waste types, completion rates,
 * and area performance.
 */

import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import { processCollectionsData } from '../utils/reports.js';
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

    // State for chart data
    const [chartData, setChartData] = useState({
        dailyCollection: {
            labels: [],
            datasets: [{
                label: 'Waste Collected (kg)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            }]
        },
        wasteTypeDistribution: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: []
            }]
        },
        completionRate: {
            labels: [],
            datasets: [{
                label: 'Completion Rate (%)',
                data: [],
                borderColor: 'rgb(153, 102, 255)',
                tension: 0.1,
            }]
        },
        pendingVsCompleted: {
            labels: [],
            datasets: []
        },
        areaPerformance: {
            labels: [],
            datasets: []
        },
        topWasteAreas: {
            labels: [],
            datasets: []
        },
        dailyCollectionByType: {
            labels: [],
            datasets: []
        },
        dailyCompletionRate: {
            labels: [],
            datasets: []
        },
        monthlyCollection: {
            labels: [],
            datasets: []
        }
    });

    // Load data when date range or time period changes
    useEffect(() => {
        const loadReportData = async () => {
            try {
                const data = await processCollectionsData(
                    dateRange.startDate,
                    dateRange.endDate,
                    timePeriod
                );
                setChartData(data);
            } catch (error) {
                console.error('Error loading report data:', error);
            }
        };

        loadReportData();
    }, [dateRange.startDate, dateRange.endDate, timePeriod]);

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