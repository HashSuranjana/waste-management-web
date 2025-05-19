import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config.js';

const recyclingCollectionRef = collection(db, "recycle");

// Helper function to get valid status
const getValidStatus = (status) => {
    if (!status || typeof status !== 'string') return 'Pending';
    return status;
};

export const fetchRecyclingStats = async () => {
    try {
        const snapshot = await getDocs(recyclingCollectionRef);
        const materials = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Calculate total materials processed
        const totalMaterials = materials.length;

        // Get recent recycling activities
        const recentRecycling = [...materials]
            .sort((a, b) => new Date(b.lastUpdated || b.date) - new Date(a.lastUpdated || a.date))
            .slice(0, 5)
            .map(material => ({
                material: material.type || 'Unknown',
                date: material.lastUpdated || material.date || new Date().toISOString().split('T')[0],
                quantity: Number(material.quantity) || 0,
                status: material.status === 2 ? 'Completed' : material.status === 1 ? 'In Progress' : 'Pending'
            }));

        // Calculate total weight from recent recycling
        const totalWeight = recentRecycling.reduce((total, material) => {
            return total + (material.quantity || 0);
        }, 0);

        // Calculate recycling rate
        const recyclableCount = materials.filter(m => m.status === 2).length;
        const recyclingRate = totalMaterials > 0 
            ? Math.round((recyclableCount / totalMaterials) * 100)
            : 0;

        // Get upcoming collections
        const upcomingCollections = materials
            .filter(m => m.status === 0)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 5)
            .map(material => ({
                location: material.location || 'Unknown Location',
                date: material.date || new Date().toISOString().split('T')[0],
                time: material.scheduledTime || '00:00',
                material: material.type || 'Unknown'
            }));

        // Calculate material type distribution
        const materialTypes = [...new Set(materials.map(m => m.type || 'Unknown'))];
        const materialDistribution = materialTypes.map(type => {
            const count = materials.filter(m => (m.type || 'Unknown') === type).length;
            return {
                type,
                count,
                percentage: Math.round((count / totalMaterials) * 100)
            };
        });

        return {
            totalMaterials,
            totalWeight,
            recyclingRate,
            averageProcessingTime: '0 hours',
            recentRecycling,
            upcomingCollections,
            materialDistribution
        };
    } catch (error) {
        console.error('Error fetching recycling stats:', error);
        throw error;
    }
}; 