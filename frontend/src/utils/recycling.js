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

        // Calculate total weight processed
        const totalWeight = materials.reduce((total, material) => {
            const weight = material.weight ? parseInt(material.weight.split(' ')[0]) : 0;
            return total + weight;
        }, 0);

        // Calculate recycling rate
        const recyclableCount = materials.filter(m => getValidStatus(m.status) === 'Recycled').length;
        const recyclingRate = totalMaterials > 0 
            ? Math.round((recyclableCount / totalMaterials) * 100)
            : 0;

        // Calculate processing efficiency
        const completedMaterials = materials.filter(m => {
            const status = getValidStatus(m.status);
            return status === 'Recycled' || status === 'Processed';
        });
        const totalProcessingTime = completedMaterials.reduce((total, material) => {
            const startTime = material.startTime ? new Date(material.startTime) : null;
            const endTime = material.endTime ? new Date(material.endTime) : null;
            if (startTime && endTime) {
                return total + (endTime - startTime) / (1000 * 60 * 60); // Convert to hours
            }
            return total;
        }, 0);
        const averageProcessingTime = completedMaterials.length > 0
            ? Math.round(totalProcessingTime / completedMaterials.length)
            : 0;

        // Get recent recycling activities
        const recentRecycling = [...materials]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(material => ({
                material: material.type || 'Unknown',
                date: material.date || new Date().toISOString().split('T')[0],
                weight: material.weight || '0 kg',
                status: getValidStatus(material.status)
            }));

        // Get upcoming collections
        const upcomingCollections = materials
            .filter(m => getValidStatus(m.status) === 'Scheduled')
            .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
            .slice(0, 5)
            .map(material => ({
                location: material.location || 'Unknown Location',
                date: material.scheduledDate || new Date().toISOString().split('T')[0],
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
            totalWeight: `${totalWeight} kg`,
            recyclingRate: `${recyclingRate}%`,
            averageProcessingTime: `${averageProcessingTime} hours`,
            recentRecycling,
            upcomingCollections,
            materialDistribution
        };
    } catch (error) {
        console.error('Error fetching recycling stats:', error);
        throw error;
    }
}; 