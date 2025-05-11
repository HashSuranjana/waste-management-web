/**
 * WasteCollectionHome Component
 * 
 * This component serves as the main dashboard for the waste collection center.
 * It provides a comprehensive interface for managing waste collections, vehicles,
 * residents, and other operational aspects of the waste management system.
 */

import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Calendar from 'react-calendar';
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

const WasteCollectionHome = () => {
    const navigate = useNavigate();
    // State to track the active tab in the sidebar navigation
    const [activeTab, setActiveTab] = useState('dashboard');
    const [scheduleView, setScheduleView] = useState('calendar');
    const [reportType, setReportType] = useState('collections');
    const [recyclingTab, setRecyclingTab] = useState('overview');
    const [recyclingFilter, setRecyclingFilter] = useState('all');
    const [bulkCollectionTab, setBulkCollectionTab] = useState('requests');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [recyclingProcess, setRecyclingProcess] = useState({
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

    /**
     * Settings Data
     * 
     * Mock data for user settings and preferences.
     * In a production environment, this would be fetched from an API.
     */
    const [settingsData, setSettingsData] = useState({
        userProfile: {
            name: 'John Smith',
            email: 'john.smith@wastemanagement.com',
            role: 'Waste Collection Manager',
            phone: '+1 (555) 123-4567',
            profilePicture: 'https://via.placeholder.com/150',
            department: 'Operations',
            joinDate: '2022-01-15'
        },
        systemPreferences: {
            language: 'English',
            timezone: 'UTC-5 (Eastern Time)',
            dateFormat: 'MM/DD/YYYY',
            theme: 'Light',
            dashboardLayout: 'Default',
            tableRowsPerPage: 10
        },
        notificationSettings: {
            emailNotifications: true,
            pushNotifications: true,
            collectionAlerts: true,
            vehicleAlerts: true,
            staffAlerts: true,
            reportAlerts: true,
            alertFrequency: 'Daily'
        },
        securitySettings: {
            twoFactorAuth: false,
            passwordLastChanged: '2023-03-15',
            loginHistory: [
                { date: '2023-04-10', time: '09:15 AM', device: 'Desktop - Chrome', location: 'New York, USA' },
                { date: '2023-04-09', time: '02:30 PM', device: 'Mobile - Safari', location: 'New York, USA' },
                { date: '2023-04-08', time: '11:45 AM', device: 'Desktop - Firefox', location: 'New York, USA' }
            ]
        },
        integrationSettings: {
            gpsTracking: true,
            weatherApi: true,
            trafficApi: true,
            smsGateway: true,
            emailService: true
        }
    });

    // Bulk Collection Data
    const [bulkCollectionRequests, setBulkCollectionRequests] = useState([
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

    // Function to handle settings changes
    const handleSettingsChange = (category, field, value) => {
        setSettingsData(prevData => ({
            ...prevData,
            [category]: {
                ...prevData[category],
                [field]: value
            }
        }));
    };

    // Function to handle bulk collection request status changes
    const handleBulkCollectionStatusChange = (requestId, newStatus) => {
        setBulkCollectionRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === requestId
                    ? { ...request, status: newStatus }
                    : request
            )
        );
    };

    // Function to assign vehicle and driver to bulk collection
    const assignBulkCollection = (requestId, vehicle, driver, collectionDate) => {
        setBulkCollectionRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === requestId
                    ? {
                        ...request,
                        status: 'Confirmed',
                        assignedVehicle: vehicle,
                        assignedDriver: driver,
                        collectionDate: collectionDate
                    }
                    : request
            )
        );
    };

    // Function to mark bulk collection as completed
    const completeBulkCollection = (requestId, actualWeight) => {
        setBulkCollectionRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === requestId
                    ? {
                        ...request,
                        status: 'Completed',
                        actualWeight: actualWeight
                    }
                    : request
            )
        );
    };

    /**
     * Collection Statistics
     * 
     * Mock data representing key metrics for waste collection operations.
     * In a production environment, this would be fetched from an API.
     */
    const collectionStats = {
        totalCollections: 156,
        pendingCollections: 23,
        completedCollections: 133,
        inProgressCollections: 22,
        totalWasteCollected: '2,450 kg',
        recyclingRate: '68%'
    };

    /**
     * Recent Collections Data
     * 
     * Mock data for recently completed or pending collections.
     * Each collection record contains essential information about the collection.
     */
    const recentCollections = [
        { id: 1, location: '123 Main St', date: '2023-04-08', status: 'Completed', wasteType: 'Mixed', weight: '45 kg' },
        { id: 2, location: '456 Oak Ave', date: '2023-04-07', status: 'Completed', wasteType: 'Organic', weight: '32 kg' },
        { id: 3, location: '789 Pine Rd', date: '2023-04-07', status: 'Completed', wasteType: 'Recyclable', weight: '28 kg' },
        { id: 4, location: '321 Elm St', date: '2023-04-06', status: 'Pending', wasteType: 'Mixed', weight: 'N/A' },
        { id: 5, location: '654 Maple Dr', date: '2023-04-06', status: 'Pending', wasteType: 'Organic', weight: 'N/A' },
    ];

    /**
     * Upcoming Collections Data
     * 
     * Mock data for scheduled future collections.
     * Contains information about planned collection routes and times.
     */
    const upcomingCollections = [
        { id: 6, location: '987 Cedar Ln', date: '2023-04-09', time: '09:00 AM', wasteType: 'Mixed' },
        { id: 7, location: '147 Birch St', date: '2023-04-09', time: '10:30 AM', wasteType: 'Recyclable' },
        { id: 8, location: '258 Willow Ave', date: '2023-04-10', time: '08:00 AM', wasteType: 'Organic' },
        { id: 9, location: '369 Spruce Rd', date: '2023-04-10', time: '11:00 AM', wasteType: 'Mixed' },
        { id: 10, location: '741 Fir Dr', date: '2023-04-11', time: '09:30 AM', wasteType: 'Recyclable' },
    ];

    /**
     * Residents Data
     * 
     * Mock data for registered residents in the waste collection service.
     * Contains contact information and collection preferences.
     */
    const [residents, setResidents] = useState([
        { id: 1, name: 'John Smith', address: '123 Main St', postalCode: '10001', phone: '555-123-4567', email: 'john.smith@email.com' },
        { id: 2, name: 'Jane Doe', address: '456 Oak Ave', postalCode: '10002', phone: '555-234-5678', email: 'jane.doe@email.com' },
        { id: 3, name: 'Robert Johnson', address: '789 Pine Rd', postalCode: '10003', phone: '555-345-6789', email: 'robert.johnson@email.com' },
        { id: 4, name: 'Emily Davis', address: '321 Elm St', postalCode: '10004', phone: '555-456-7890', email: 'emily.davis@email.com' },
        { id: 5, name: 'Michael Wilson', address: '654 Maple Dr', postalCode: '10005', phone: '555-567-8901', email: 'michael.wilson@email.com' },
    ]);

    /**
     * Vehicles Data
     * 
     * Mock data for the vehicle fleet used in waste collection operations.
     * Contains detailed information about each vehicle's specifications and status.
     */
    const [vehicles, setVehicles] = useState([
        {
            id: 'Truck-001',
            name: 'Truck-001',
            type: 'Garbage Truck',
            capacity: '5 tons',
            licensePlate: 'ABC123',
            status: 'active',
            assignedDriver: 'John Driver',
            wasteType: 'Mixed'
        },
        {
            id: 2,
            name: 'Van-001',
            type: 'Recycling Van',
            capacity: '2 tons',
            licensePlate: 'DEF456',
            status: 'Active',
            lastMaintenance: '2023-03-10',
            nextMaintenance: '2023-06-10',
            fuelLevel: '60%',
            assignedDriver: 'Sarah Driver',
            wasteType: 'Recyclable'
        },
        {
            id: 3,
            name: 'Truck-002',
            type: 'Organic Waste Truck',
            capacity: '4 tons',
            licensePlate: 'GHI789',
            status: 'Maintenance',
            lastMaintenance: '2023-04-01',
            nextMaintenance: '2023-07-01',
            fuelLevel: '30%',
            assignedDriver: 'Mike Driver',
            wasteType: 'Organic'
        },
        {
            id: 4,
            name: 'Van-002',
            type: 'Recycling Van',
            capacity: '2 tons',
            licensePlate: 'JKL012',
            status: 'Active',
            lastMaintenance: '2023-03-20',
            nextMaintenance: '2023-06-20',
            fuelLevel: '85%',
            assignedDriver: 'Lisa Driver',
            wasteType: 'Recyclable'
        },
        {
            id: 5,
            name: 'Truck-003',
            type: 'Garbage Truck',
            capacity: '5 tons',
            licensePlate: 'MNO345',
            status: 'Inactive',
            lastMaintenance: '2023-02-15',
            nextMaintenance: '2023-05-15',
            fuelLevel: '10%',
            assignedDriver: 'Tom Driver',
            wasteType: 'Mixed'
        },
    ]);

    /**
     * Vehicle Statistics
     * 
     * Summary statistics for the vehicle fleet.
     * Provides a quick overview of vehicle operational status.
     */
    const vehicleStats = {
        totalVehicles: 5,
        activeVehicles: 3,
        maintenanceVehicles: 1,
        inactiveVehicles: 1
    };

    /**
     * Collections Data
     *
     * Detailed mock data for all collections, including those in progress.
     * Contains comprehensive information about each collection operation.
     */
    const [collections, setCollections] = useState([
        {
            id: 1,
            location: '123 Main Street',
            date: '2024-03-15',
            time: '09:00 AM',
            status: 'Completed',
            wasteType: 'Mixed',
            weight: '250 kg',
            assignedVehicle: 'Truck-001',
            assignedDriver: 'John Driver',
            notes: 'Regular collection completed'
        },
        {
            id: 2,
            location: '456 Oak Avenue',
            date: '2024-03-15',
            time: '10:30 AM',
            status: 'Pending',
            wasteType: 'Recyclable',
            weight: 'N/A',
            assignedVehicle: 'Van-001',
            assignedDriver: 'Sarah Driver',
            notes: 'Scheduled collection'
        },
        {
            id: 3,
            location: '789 Pine Road',
            date: '2024-03-15',
            time: '02:00 PM',
            status: 'In Progress',
            wasteType: 'Organic',
            weight: '180 kg',
            assignedVehicle: 'Truck-002',
            assignedDriver: 'Mike Driver',
            notes: 'Collection in progress'
        },
        {
            id: 4,
            location: '321 Elm Street',
            date: '2024-03-16',
            time: '08:00 AM',
            status: 'Scheduled',
            wasteType: 'Mixed',
            weight: 'N/A',
            assignedVehicle: 'Truck-001',
            assignedDriver: 'John Driver',
            notes: 'Upcoming collection'
        },
        {
            id: 5,
            location: '654 Maple Drive',
            date: '2024-03-16',
            time: '11:00 AM',
            status: 'Scheduled',
            wasteType: 'Recyclable',
            weight: 'N/A',
            assignedVehicle: 'Van-002',
            assignedDriver: 'Lisa Driver',
            notes: 'Upcoming collection'
        }
    ]);

    // Add new state for new collection form
    const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
    const [newCollectionData, setNewCollectionData] = useState({
        location: '',
        date: '',
        time: '',
        status: 'Scheduled',
        wasteType: 'Mixed',
        assignedVehicle: ''
    });

    // Handle new collection form input changes
    const handleNewCollectionChange = (e) => {
        const { name, value } = e.target;
        setNewCollectionData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle new collection form submission
    const handleNewCollectionSubmit = () => {
        if (!newCollectionData.location || !newCollectionData.date || !newCollectionData.time || !newCollectionData.assignedVehicle) {
            alert('Please fill in all required fields');
            return;
        }

        const newCollection = {
            id: collections.length + 1,
            location: newCollectionData.location,
            date: newCollectionData.date,
            time: newCollectionData.time,
            status: 'Scheduled',
            wasteType: newCollectionData.wasteType,
            vehicle: newCollectionData.assignedVehicle,
            type: 'Collection'
        };

        // Update collections state
        setCollections(prevCollections => [...prevCollections, newCollection]);

        // Reset form
        setNewCollectionData({
            location: '',
            date: '',
            time: '',
            status: 'Scheduled',
            wasteType: 'Mixed',
            assignedVehicle: ''
        });
        setShowNewCollectionForm(false);

        // Switch to schedule tab and calendar view
        setActiveTab('schedule');
        setScheduleView('calendar');
        setSelectedDate(new Date(newCollectionData.date));
    };

    // Add state for editing
    const [editingCollection, setEditingCollection] = useState(null);
    const [editFormData, setEditFormData] = useState({
        location: '',
        date: '',
        time: '',
        status: '',
        wasteType: '',
        weight: '',
        assignedVehicle: '',
        assignedDriver: '',
        notes: ''
    });

    // Handle edit button click
    const handleEditClick = (collection) => {
        setEditingCollection(collection.id);
        setEditFormData({
            location: collection.location,
            date: collection.date,
            time: collection.time,
            status: collection.status,
            wasteType: collection.wasteType,
            weight: collection.weight,
            assignedVehicle: collection.assignedVehicle,
            assignedDriver: collection.assignedDriver,
            notes: collection.notes
        });
    };

    // Handle form input changes
    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    // Handle form submission
    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        setCollections(collections.map(collection =>
            collection.id === editingCollection
                ? { ...collection, ...editFormData }
                : collection
        ));
        setEditingCollection(null);
    };

    // Handle delete button click
    const handleDeleteClick = (collectionId) => {
        setCollections(collections.filter(collection => collection.id !== collectionId));
    };

    /**
     * Schedule Data
     * 
     * Mock data for the waste collection center's schedule.
     * Includes collections, staff assignments, and vehicle schedules.
     */
    const scheduleData = {
        collections: [
            { id: 1, title: 'Morning Collection Route', date: '2024-03-16', startTime: '08:00 AM', endTime: '12:00 PM', location: 'Downtown Area', assignedTo: 'John Driver', vehicle: 'Truck-001', status: 'Scheduled' },
            { id: 2, title: 'Afternoon Collection Route', date: '2024-03-16', startTime: '01:00 PM', endTime: '05:00 PM', location: 'Suburban Area', assignedTo: 'Sarah Driver', vehicle: 'Van-001', status: 'Scheduled' },
            { id: 3, title: 'Evening Collection Route', date: '2024-03-16', startTime: '06:00 PM', endTime: '10:00 PM', location: 'Industrial Area', assignedTo: 'Mike Driver', vehicle: 'Truck-002', status: 'Scheduled' },
        ],
        staff: [
            { id: 11, title: 'John Driver', date: '2024-03-16', startTime: '08:00 AM', endTime: '05:00 PM', role: 'Collection Driver', location: 'Downtown Area', status: 'Scheduled' },
            { id: 12, title: 'Sarah Driver', date: '2024-03-16', startTime: '01:00 PM', endTime: '10:00 PM', role: 'Collection Driver', location: 'Suburban Area', status: 'Scheduled' },
            { id: 13, title: 'Mike Driver', date: '2024-03-16', startTime: '06:00 PM', endTime: '02:00 AM', role: 'Collection Driver', location: 'Industrial Area', status: 'Scheduled' },
            { id: 14, title: 'Lisa Driver', date: '2024-03-17', startTime: '09:00 AM', endTime: '05:00 PM', role: 'Collection Driver', location: 'Commercial District', status: 'Scheduled' },
            { id: 15, title: 'Tom Driver', date: '2024-03-17', startTime: '02:00 PM', endTime: '10:00 PM', role: 'Collection Driver', location: 'Industrial Park', status: 'Scheduled' },
        ],
        vehicles: [
            { id: 21, title: 'Truck-001', date: '2024-03-16', startTime: '08:00 AM', endTime: '12:00 PM', type: 'Garbage Truck', assignedTo: 'John Driver', route: 'Downtown Area', status: 'Scheduled' },
            { id: 22, title: 'Van-001', date: '2024-03-16', startTime: '01:00 PM', endTime: '05:00 PM', type: 'Recycling Van', assignedTo: 'Sarah Driver', route: 'Suburban Area', status: 'Scheduled' },
            { id: 23, title: 'Truck-002', date: '2024-03-16', startTime: '06:00 PM', endTime: '10:00 PM', type: 'Organic Waste Truck', assignedTo: 'Mike Driver', route: 'Industrial Area', status: 'Scheduled' },
            { id: 24, title: 'Van-002', date: '2024-03-17', startTime: '09:00 AM', endTime: '11:00 AM', type: 'Recycling Van', assignedTo: 'Lisa Driver', route: 'Commercial District', status: 'Scheduled' },
            { id: 25, title: 'Truck-003', date: '2024-03-17', startTime: '02:00 PM', endTime: '04:00 PM', type: 'Garbage Truck', assignedTo: 'Tom Driver', route: 'Industrial Park', status: 'Scheduled' },
        ]
    };

    /**
     * Report Data
     * 
     * Mock data for various reports and analytics.
     * In a production environment, this would be fetched from an API.
     */
    const reportData = {
        collectionTrends: [
            { month: 'Jan', collections: 145, wasteCollected: '2,100 kg', recyclingRate: '65%' },
            { month: 'Feb', collections: 152, wasteCollected: '2,250 kg', recyclingRate: '67%' },
            { month: 'Mar', collections: 148, wasteCollected: '2,180 kg', recyclingRate: '68%' },
            { month: 'Apr', collections: 156, wasteCollected: '2,450 kg', recyclingRate: '68%' },
            { month: 'May', collections: 162, wasteCollected: '2,600 kg', recyclingRate: '70%' },
            { month: 'Jun', collections: 158, wasteCollected: '2,500 kg', recyclingRate: '71%' },
        ],
        wasteTypeDistribution: [
            { type: 'Mixed', percentage: 40, weight: '980 kg' },
            { type: 'Organic', percentage: 25, weight: '612 kg' },
            { type: 'Recyclable', percentage: 35, weight: '858 kg' },
        ],
        areaPerformance: [
            { area: 'Downtown', collections: 45, completionRate: '98%', recyclingRate: '72%' },
            { area: 'Suburban', collections: 38, completionRate: '95%', recyclingRate: '68%' },
            { area: 'Industrial', collections: 42, completionRate: '92%', recyclingRate: '65%' },
            { area: 'Residential', collections: 31, completionRate: '97%', recyclingRate: '70%' },
            { area: 'Commercial', collections: 28, completionRate: '96%', recyclingRate: '69%' },
        ],
        vehicleEfficiency: [
            { vehicle: 'Truck-001', trips: 85, distance: '1,250 km', fuelUsed: '450 L', efficiency: '2.8 km/L' },
            { vehicle: 'Van-001', trips: 92, distance: '980 km', fuelUsed: '320 L', efficiency: '3.1 km/L' },
            { vehicle: 'Truck-002', trips: 78, distance: '1,180 km', fuelUsed: '420 L', efficiency: '2.8 km/L' },
            { vehicle: 'Van-002', trips: 88, distance: '950 km', fuelUsed: '310 L', efficiency: '3.1 km/L' },
            { vehicle: 'Truck-003', trips: 82, distance: '1,220 km', fuelUsed: '440 L', efficiency: '2.8 km/L' },
        ],
        staffPerformance: [
            { staff: 'John Driver', collections: 42, completionRate: '98%', customerRating: '4.8/5' },
            { staff: 'Sarah Driver', collections: 38, completionRate: '97%', customerRating: '4.7/5' },
            { staff: 'Mike Driver', collections: 40, completionRate: '96%', customerRating: '4.6/5' },
            { staff: 'Lisa Driver', collections: 36, completionRate: '98%', customerRating: '4.9/5' },
            { staff: 'Tom Driver', collections: 39, completionRate: '95%', customerRating: '4.5/5' },
        ],
        costAnalysis: [
            { category: 'Fuel', amount: '$2,450', percentage: 35 },
            { category: 'Maintenance', amount: '$1,800', percentage: 25 },
            { category: 'Staff', amount: '$1,500', percentage: 20 },
            { category: 'Equipment', amount: '$1,000', percentage: 15 },
            { category: 'Other', amount: '$500', percentage: 5 },
        ]
    };

    // Add shop data after other mock data
    const shopData = {
        categories: [
            "Bins & Containers",
            "Safety Equipment",
            "Recycling Equipment",
            "Waste Processing",
            "Educational Materials",
            "Organic Products",
            "Plastic Recycling"
        ],
        products: [
            {
                id: 1,
                name: "Large Recycling Bin",
                category: "Bins & Containers",
                description: "120L capacity recycling bin with color-coded compartments",
                price: 89.99,
                stock: 15,
                rating: 4.5,
                image: "https://via.placeholder.com/300x200?text=Recycling+Bin"
            },
            {
                id: 2,
                name: "Safety Gloves",
                category: "Safety Equipment",
                description: "Heavy-duty gloves for waste handling",
                price: 24.99,
                stock: 50,
                rating: 4.2,
                image: "https://via.placeholder.com/300x200?text=Safety+Gloves"
            },
            {
                id: 3,
                name: "Plastic Shredder",
                category: "Recycling Equipment",
                description: "Industrial-grade plastic waste shredder",
                price: 2499.99,
                stock: 3,
                rating: 4.8,
                image: "https://via.placeholder.com/300x200?text=Plastic+Shredder"
            },
            {
                id: 4,
                name: "Paper Baler",
                category: "Recycling Equipment",
                description: "Compact paper and cardboard baler",
                price: 1899.99,
                stock: 2,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Paper+Baler"
            },
            {
                id: 5,
                name: "Glass Crusher",
                category: "Recycling Equipment",
                description: "Commercial glass crushing machine",
                price: 2999.99,
                stock: 1,
                rating: 4.9,
                image: "https://via.placeholder.com/300x200?text=Glass+Crusher"
            },
            {
                id: 6,
                name: "Composting Unit",
                category: "Waste Processing",
                description: "Large-scale organic waste composting system",
                price: 3499.99,
                stock: 2,
                rating: 4.6,
                image: "https://via.placeholder.com/300x200?text=Composting+Unit"
            },
            {
                id: 7,
                name: "Recycling Education Kit",
                category: "Educational Materials",
                description: "Complete educational kit for teaching recycling",
                price: 149.99,
                stock: 20,
                rating: 4.4,
                image: "https://via.placeholder.com/300x200?text=Education+Kit"
            },
            {
                id: 8,
                name: "Electronic Waste Bin",
                category: "Bins & Containers",
                description: "Secure container for e-waste collection",
                price: 199.99,
                stock: 8,
                rating: 4.3,
                image: "https://via.placeholder.com/300x200?text=E-Waste+Bin"
            },
            {
                id: 9,
                name: "Hazardous Waste Container",
                category: "Bins & Containers",
                description: "Specialized container for hazardous materials",
                price: 299.99,
                stock: 5,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Hazardous+Waste+Container"
            },
            {
                id: 10,
                name: "Recycling Sorting Station",
                category: "Recycling Equipment",
                description: "Multi-compartment sorting station",
                price: 599.99,
                stock: 4,
                rating: 4.5,
                image: "https://via.placeholder.com/300x200?text=Sorting+Station"
            },
            {
                id: 11,
                name: "Premium Organic Compost",
                category: "Organic Products",
                description: "High-quality organic compost made from recycled food waste, perfect for gardening",
                price: 29.99,
                stock: 50,
                rating: 4.8,
                image: "https://via.placeholder.com/300x200?text=Organic+Compost"
            },
            {
                id: 12,
                name: "Home Composting Kit",
                category: "Organic Products",
                description: "Complete kit for home composting including bin, starter mix, and guide",
                price: 79.99,
                stock: 25,
                rating: 4.6,
                image: "https://via.placeholder.com/300x200?text=Composting+Kit"
            },
            {
                id: 13,
                name: "Herb Garden Starter Kit",
                category: "Organic Products",
                description: "Everything needed to start your own organic herb garden",
                price: 49.99,
                stock: 30,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Herb+Garden+Kit"
            },
            {
                id: 14,
                name: "Vegetable Grow Kit",
                category: "Organic Products",
                description: "Complete kit for growing organic vegetables at home",
                price: 59.99,
                stock: 20,
                rating: 4.5,
                image: "https://via.placeholder.com/300x200?text=Vegetable+Grow+Kit"
            },
            {
                id: 15,
                name: "Recycled Plastic Pellets (5kg)",
                category: "Plastic Recycling",
                description: "High-quality recycled plastic pellets for manufacturing",
                price: 89.99,
                stock: 15,
                rating: 4.4,
                image: "https://via.placeholder.com/300x200?text=Plastic+Pellets"
            },
            {
                id: 16,
                name: "Plastic Recycling Bundle (10kg)",
                category: "Plastic Recycling",
                description: "Mixed recycled plastic materials for industrial use",
                price: 149.99,
                stock: 10,
                rating: 4.3,
                image: "https://via.placeholder.com/300x200?text=Plastic+Bundle"
            },
            {
                id: 17,
                name: "Organic Fertilizer Mix",
                category: "Organic Products",
                description: "Natural fertilizer made from composted organic waste",
                price: 39.99,
                stock: 40,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Organic+Fertilizer"
            },
            {
                id: 18,
                name: "Indoor Plant Grow Kit",
                category: "Organic Products",
                description: "Complete kit for growing plants indoors with recycled materials",
                price: 69.99,
                stock: 15,
                rating: 4.6,
                image: "https://via.placeholder.com/300x200?text=Indoor+Grow+Kit"
            }
        ]
    };

    // Add shop state after other state declarations
    const [shopCategory, setShopCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    // Add shop functions after other functions
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Add daily transactions data after other mock data
    const dailyTransactions = [
        {
            id: 1,
            date: '2024-03-15',
            time: '09:15 AM',
            type: 'Collection',
            amount: 250.00,
            status: 'Completed',
            description: 'Regular waste collection - Downtown area',
            paymentMethod: 'Cash',
            reference: 'COL-2024-001'
        },
        {
            id: 2,
            date: '2024-03-15',
            time: '10:30 AM',
            type: 'Shop',
            amount: 89.99,
            status: 'Completed',
            description: 'Large Recycling Bin purchase',
            paymentMethod: 'Credit Card',
            reference: 'SHOP-2024-001'
        },
        {
            id: 3,
            date: '2024-03-15',
            time: '11:45 AM',
            type: 'Collection',
            amount: 180.00,
            status: 'Completed',
            description: 'Bulk waste collection - Industrial area',
            paymentMethod: 'Bank Transfer',
            reference: 'COL-2024-002'
        },
        {
            id: 4,
            date: '2024-03-15',
            time: '02:15 PM',
            type: 'Shop',
            amount: 149.99,
            status: 'Completed',
            description: 'Plastic Recycling Bundle purchase',
            paymentMethod: 'Credit Card',
            reference: 'SHOP-2024-002'
        },
        {
            id: 5,
            date: '2024-03-15',
            time: '03:30 PM',
            type: 'Collection',
            amount: 320.00,
            status: 'Pending',
            description: 'Hazardous waste collection - Commercial area',
            paymentMethod: 'Bank Transfer',
            reference: 'COL-2024-003'
        },
        {
            id: 6,
            date: '2024-03-15',
            time: '04:45 PM',
            type: 'Shop',
            amount: 29.99,
            status: 'Completed',
            description: 'Premium Organic Compost purchase',
            paymentMethod: 'Credit Card',
            reference: 'SHOP-2024-003'
        }
    ];

    // Add transaction statistics
    const transactionStats = {
        totalTransactions: dailyTransactions.length,
        totalAmount: dailyTransactions.reduce((sum, t) => sum + t.amount, 0),
        completedTransactions: dailyTransactions.filter(t => t.status === 'Completed').length,
        pendingTransactions: dailyTransactions.filter(t => t.status === 'Pending').length,
        collectionRevenue: dailyTransactions.filter(t => t.type === 'Collection').reduce((sum, t) => sum + t.amount, 0),
        shopRevenue: dailyTransactions.filter(t => t.type === 'Shop').reduce((sum, t) => sum + t.amount, 0)
    };

    // Add shop transaction data after other mock data
    const shopTransactions = [
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
    ];

    // Add shop transaction statistics
    const shopTransactionStats = {
        totalTransactions: shopTransactions.length,
        totalRevenue: shopTransactions.reduce((sum, t) => sum + t.total, 0),
        completedTransactions: shopTransactions.filter(t => t.status === 'Completed').length,
        pendingTransactions: shopTransactions.filter(t => t.status === 'Pending').length,
        averageTransactionValue: shopTransactions.reduce((sum, t) => sum + t.total, 0) / shopTransactions.length,
        topSellingItems: [
            { name: 'Premium Organic Compost', quantity: 3 },
            { name: 'Herb Garden Starter Kit', quantity: 2 },
            { name: 'Safety Gloves', quantity: 2 }
        ]
    };

    // Add new state for new vehicle form
    const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
    const [newVehicleData, setNewVehicleData] = useState({
        id: '',
        vehicleNumber: '',
        type: '',
        capacity: '',
        fuelLevel: '',
        status: 'Active',
        lastMaintenance: '',
        nextMaintenance: '',
        assignedDriver: '',
        notes: ''
    });

    // Handle new vehicle form input changes
    const handleNewVehicleChange = (e) => {
        const { name, value } = e.target;
        setNewVehicleData({
            ...newVehicleData,
            [name]: value
        });
    };

    // Handle new vehicle form submission
    const handleNewVehicleSubmit = () => {
        const newVehicle = {
            ...newVehicleData,
            id: vehicles.length + 1
        };
        setVehicles([...vehicles, newVehicle]);
        setShowNewVehicleForm(false);
        setNewVehicleData({
            id: '',
            vehicleNumber: '',
            type: '',
            capacity: '',
            fuelLevel: '',
            status: 'Active',
            lastMaintenance: '',
            nextMaintenance: '',
            assignedDriver: '',
            notes: ''
        });
    };

    // Add state for editing vehicles
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [editVehicleForm, setEditVehicleForm] = useState({
        name: '',
        type: '',
        capacity: '',
        licensePlate: '',
        status: '',
        assignedDriver: '',
        wasteType: ''
    });

    // Handle edit vehicle button click
    const handleEditVehicleClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setEditVehicleForm({
            name: vehicle.name,
            type: vehicle.type,
            capacity: vehicle.capacity,
            licensePlate: vehicle.licensePlate,
            status: vehicle.status,
            assignedDriver: vehicle.assignedDriver,
            wasteType: vehicle.wasteType
        });
    };

    // Handle form changes in edit mode
    const handleEditVehicleChange = (e) => {
        const { name, value } = e.target;
        setEditVehicleForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handle edit form submission
    const handleEditVehicleSubmit = (vehicleId) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === vehicleId
                ? { ...vehicle, ...editVehicleForm }
                : vehicle
        ));
        setEditingVehicle(null);
        setEditVehicleForm({
            name: '',
            type: '',
            capacity: '',
            licensePlate: '',
            status: '',
            assignedDriver: '',
            wasteType: ''
        });
    };

    // Handle delete vehicle
    const handleDeleteVehicle = (vehicleId) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
        }
    };

    // Handle maintenance status toggle
    const handleMaintenanceClick = (vehicleId) => {
        setVehicles(vehicles.map(vehicle =>
            vehicle.id === vehicleId
                ? { ...vehicle, status: vehicle.status === 'maintenance' ? 'active' : 'maintenance' }
                : vehicle
        ));
    };

    // Add state for residents
    const [editingResident, setEditingResident] = useState(null);
    const [editResidentForm, setEditResidentForm] = useState({
        name: '',
        address: '',
        postalCode: '',
        phone: '',
        email: ''
    });

    // Handle edit resident button click
    const handleEditResidentClick = (resident) => {
        setEditingResident(resident);
        setEditResidentForm({
            name: resident.name,
            address: resident.address,
            postalCode: resident.postalCode,
            phone: resident.phone,
            email: resident.email
        });
    };

    // Handle resident form changes
    const handleEditResidentChange = (e) => {
        const { name, value } = e.target;
        setEditResidentForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    // Handle edit form submission
    const handleEditResidentSubmit = (residentId) => {
        setResidents(residents.map(resident =>
            resident.id === residentId
                ? { ...resident, ...editResidentForm }
                : resident
        ));
        setEditingResident(null);
        setEditResidentForm({
            name: '',
            address: '',
            postalCode: '',
            phone: '',
            email: ''
        });
    };

    // Handle delete resident
    const handleDeleteResident = (residentId) => {
        if (window.confirm('Are you sure you want to delete this resident?')) {
            setResidents(residents.filter(resident => resident.id !== residentId));
        }
    };

    // Add state for new resident form
    const [showNewResidentForm, setShowNewResidentForm] = useState(false);
    const [newResidentData, setNewResidentData] = useState({
        name: '',
        address: '',
        postalCode: '',
        phone: '',
        email: ''
    });

    // Handle new resident form changes
    const handleNewResidentChange = (e) => {
        const { name, value } = e.target;
        setNewResidentData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle new resident form submission
    const handleNewResidentSubmit = () => {
        const newResident = {
            ...newResidentData,
            id: residents.length + 1
        };
        setResidents([...residents, newResident]);
        setShowNewResidentForm(false);
        setNewResidentData({
            name: '',
            address: '',
            postalCode: '',
            phone: '',
            email: ''
        });
    };

    // Add this function to handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // Add this function to get events for a specific date
    const getEventsForDate = (date) => {
        const dateString = date.toISOString().split('T')[0];
        return collections.filter(collection => collection.date === dateString);
    };

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

    const [schedules, setSchedules] = useState([
        {
            id: 1,
            date: '2024-03-20',
            time: '09:00',
            location: 'Main Street Area',
            type: 'Regular Collection',
            status: 'Scheduled',
            vehicle: 'Truck-001',
            notes: 'Regular household waste collection'
        },
        {
            id: 2,
            date: '2024-03-21',
            time: '10:30',
            location: 'Downtown Area',
            type: 'Bulk Collection',
            status: 'Scheduled',
            vehicle: 'Truck-002',
            notes: 'Large item collection'
        }
    ]);

    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [newSchedule, setNewSchedule] = useState({
        date: '',
        time: '',
        location: '',
        type: 'Regular Collection',
        vehicle: '',
        notes: ''
    });

    const handleScheduleSubmit = (e) => {
        e.preventDefault();
        const schedule = {
            id: schedules.length + 1,
            ...newSchedule,
            status: 'Scheduled'
        };
        setSchedules([...schedules, schedule]);
        setShowScheduleModal(false);
        setNewSchedule({
            date: '',
            time: '',
            location: '',
            type: 'Regular Collection',
            vehicle: '',
            notes: ''
        });
    };

    const [showTruckLocation, setShowTruckLocation] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);

    const handleTruckLocationClick = (vehicle) => {
        setSelectedTruck(vehicle);
        setShowTruckLocation(true);
    };

    // Add new state for postal code residents list
    const [selectedPostalCode, setSelectedPostalCode] = useState('');
    const [postalCodeMessage, setPostalCodeMessage] = useState('');
    const [showMessageModal, setShowMessageModal] = useState(false);

    // Function to get unique postal codes from residents
    const getUniquePostalCodes = () => {
        return [...new Set(residents.map(resident => resident.postalCode))];
    };

    // Function to get residents by postal code
    const getResidentsByPostalCode = (postalCode) => {
        return residents.filter(resident => resident.postalCode === postalCode);
    };

    // Function to handle sending message to residents
    const handleSendMessage = () => {
        // Here you would typically integrate with your backend to send messages
        // For now, we'll just show an alert
        alert(`Message sent to residents in postal code ${selectedPostalCode}`);
        setShowMessageModal(false);
        setPostalCodeMessage('');
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
                        <li className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
                            <span className="icon">⚙️</span> Settings
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
                        <div className="residents">
                            <h2>Residents Details</h2>
                            <div className="action-bar">
                                <button
                                    className="add-btn"
                                    onClick={() => setShowNewResidentForm(true)}
                                >
                                    Add New Resident
                                </button>
                                <div className="search-bar">
                                    <input type="text" placeholder="Search residents..." />
                                    <button className="search-btn">Search</button>
                                </div>
                            </div>

                            {/* New Resident Form */}
                            {showNewResidentForm && (
                                <div className="form-overlay">
                                    <div className="form-container">
                                        <h3>Add New Resident</h3>
                                        <div className="form-group">
                                            <label>Name:</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={newResidentData.name}
                                                onChange={handleNewResidentChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Address:</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={newResidentData.address}
                                                onChange={handleNewResidentChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Postal Code:</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={newResidentData.postalCode}
                                                onChange={handleNewResidentChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Phone:</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={newResidentData.phone}
                                                onChange={handleNewResidentChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email:</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={newResidentData.email}
                                                onChange={handleNewResidentChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button
                                                className="submit-btn"
                                                onClick={handleNewResidentSubmit}
                                            >
                                                Add Resident
                                            </button>
                                            <button
                                                className="cancel-btn"
                                                onClick={() => setShowNewResidentForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Postal Code</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {residents.map(resident => (
                                        <tr key={resident.id}>
                                            {editingResident?.id === resident.id ? (
                                                <>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="edit-input"
                                                            name="name"
                                                            value={editResidentForm.name}
                                                            onChange={handleEditResidentChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="edit-input"
                                                            name="address"
                                                            value={editResidentForm.address}
                                                            onChange={handleEditResidentChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="edit-input"
                                                            name="postalCode"
                                                            value={editResidentForm.postalCode}
                                                            onChange={handleEditResidentChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="edit-input"
                                                            name="phone"
                                                            value={editResidentForm.phone}
                                                            onChange={handleEditResidentChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="email"
                                                            className="edit-input"
                                                            name="email"
                                                            value={editResidentForm.email}
                                                            onChange={handleEditResidentChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="action-btn save"
                                                            onClick={() => handleEditResidentSubmit(resident.id)}
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            className="action-btn cancel"
                                                            onClick={() => setEditingResident(null)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{resident.name}</td>
                                                    <td>{resident.address}</td>
                                                    <td>{resident.postalCode}</td>
                                                    <td>{resident.phone}</td>
                                                    <td>{resident.email}</td>
                                                    <td>
                                                        <button
                                                            className="action-btn edit"
                                                            onClick={() => handleEditResidentClick(resident)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => handleDeleteResident(resident.id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                                                            {calculateDuration(step.startTime, step.endTime)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="step-description">
                                                {getStepDescription(step.id)}
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
                        <div className="shop">
                            <h2>Shop</h2>

                            {/* Shop Navigation */}
                            <div className="shop-nav">
                                <button className="shop-nav-btn active">Products</button>
                                <Link to="/shop-transactions" className="shop-nav-btn">
                                    Transaction History
                                </Link>
                            </div>

                            {/* Shop Content */}
                            <div className="shop-content">
                                <div className="shop-controls">
                                    <div className="search-bar">
                                        <input
                                            type="text"
                                            placeholder="Search recycling products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="category-filter">
                                        <select
                                            value={shopCategory}
                                            onChange={(e) => setShopCategory(e.target.value)}
                                        >
                                            <option value="">All Categories</option>
                                            {shopData.categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="shop-content">
                                    <div className="products-grid">
                                        {shopData.products
                                            .filter((product) => {
                                                const matchesCategory = !shopCategory || product.category === shopCategory;
                                                const matchesSearch = !searchQuery ||
                                                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                                    product.description.toLowerCase().includes(searchQuery.toLowerCase());
                                                return matchesCategory && matchesSearch;
                                            })
                                            .map((product) => (
                                                <div key={product.id} className="product-card">
                                                    <img src={product.image} alt={product.name} />
                                                    <div className="product-info">
                                                        <h3>{product.name}</h3>
                                                        <p className="product-category">{product.category}</p>
                                                        <p className="product-description">{product.description}</p>
                                                        <div className="product-rating">
                                                            {'★'.repeat(Math.floor(product.rating))}
                                                            {'☆'.repeat(5 - Math.floor(product.rating))}
                                                        </div>
                                                        <p className="product-price">${product.price.toFixed(2)}</p>
                                                        <p className="product-stock">
                                                            {product.stock > 0
                                                                ? `${product.stock} in stock`
                                                                : 'Out of stock'}
                                                        </p>
                                                        <button
                                                            className="add-to-cart-btn"
                                                            onClick={() => addToCart(product)}
                                                            disabled={product.stock === 0}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                    <div className="shopping-cart">
                                        <h3>Shopping Cart</h3>
                                        {cart.length === 0 ? (
                                            <p className="empty-cart">Your cart is empty</p>
                                        ) : (
                                            <>
                                                <div className="cart-items">
                                                    {cart.map((item) => (
                                                        <div key={item.id} className="cart-item">
                                                            <img src={item.image} alt={item.name} />
                                                            <div className="cart-item-info">
                                                                <h4>{item.name}</h4>
                                                                <p>${item.price.toFixed(2)}</p>
                                                            </div>
                                                            <div className="cart-item-actions">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                                />
                                                                <button
                                                                    className="remove-btn"
                                                                    onClick={() => removeFromCart(item.id)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="cart-summary">
                                                    <p>
                                                        Total: $
                                                        {cart
                                                            .reduce((total, item) => total + item.price * item.quantity, 0)
                                                            .toFixed(2)}
                                                    </p>
                                                    <button className="checkout-btn">Proceed to Checkout</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Add Shop Transaction Statistics */}
                                <div className="shop-stats">
                                    <div className="stat-card">
                                        <div className="stat-icon">💰</div>
                                        <div className="stat-info">
                                            <h3>Total Revenue</h3>
                                            <p className="stat-value">${shopTransactionStats.totalRevenue.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <div className="stat-icon">🛒</div>
                                        <div className="stat-info">
                                            <h3>Total Transactions</h3>
                                            <p className="stat-value">{shopTransactionStats.totalTransactions}</p>
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <div className="stat-icon">✅</div>
                                        <div className="stat-info">
                                            <h3>Completed</h3>
                                            <p className="stat-value">{shopTransactionStats.completedTransactions}</p>
                                        </div>
                                    </div>

                                    <div className="stat-card">
                                        <div className="stat-icon">⏳</div>
                                        <div className="stat-info">
                                            <h3>Pending</h3>
                                            <p className="stat-value">{shopTransactionStats.pendingTransactions}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Shop Transaction History */}
                                <div className="shop-transactions">
                                    <h3>Transaction History</h3>
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Date & Time</th>
                                                <th>Customer</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Payment Method</th>
                                                <th>Status</th>
                                                <th>Reference</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {shopTransactions.map(transaction => (
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
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Add Top Selling Items */}
                                <div className="top-selling-items">
                                    <h3>Top Selling Items</h3>
                                    <div className="items-grid">
                                        {shopTransactionStats.topSellingItems.map((item, index) => (
                                            <div key={index} className="item-card">
                                                <h4>{item.name}</h4>
                                                <p>Quantity Sold: {item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Complaints Tab */}
                    {activeTab === 'complaints' && (
                        <Complaint/>
                    )}

                    {/* Postal Residents Tab */}
                    {activeTab === 'postal-residents' && (
                        <div className="postal-residents-container">
                            <PostalResidents residents={residents} />
                        </div>
                    )}
                    {activeTab === 'live-location' && (
                        <div className="live-location-section">
                            <h2>Live Location Tracking</h2>
                            <div className="map-container">
                                {/* Map will be implemented here */}
                                <div className="map-placeholder">
                                    <span className="icon">🗺️</span>
                                    <p>Map loading...</p>
                                </div>
                            </div>
                            <div className="location-details">
                                <div className="current-location">
                                    <h3>Current Location</h3>
                                    <p>Loading location data...</p>
                                </div>
                                <div className="collection-route">
                                    <h3>Collection Route</h3>
                                    <p>Route information will be displayed here</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="settings-section">
                            <h2>Settings</h2>
                            {/* Add your settings components here */}
                        </div>
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
                                <h4>Vehicle: {selectedTruck}</h4>
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