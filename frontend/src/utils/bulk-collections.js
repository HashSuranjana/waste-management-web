import { collection, addDoc, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase-config.js';

const bulkCollectionRef = collection(db, "bulk-collections");

export const addBulkRequest = async (requestData) => {
    try {
        const docRef = await addDoc(bulkCollectionRef, {
            ...requestData,
            requestDate: new Date().toISOString(),
            status: 'Pending'
        });
        return { id: docRef.id, ...requestData };
    } catch (error) {
        console.error('Error adding bulk request:', error);
        throw error;
    }
};

export const fetchBulkRequests = async () => {
    try {
        const snapshot = await getDocs(bulkCollectionRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching bulk requests:', error);
        throw error;
    }
};

export const updateBulkRequest = async (id, updateData) => {
    try {
        const docRef = doc(db, "bulk-collections", id);
        await updateDoc(docRef, updateData);
        return { id, ...updateData };
    } catch (error) {
        console.error('Error updating bulk request:', error);
        throw error;
    }
};

export const fetchBulkRequestsByStatus = async (status) => {
    try {
        const q = query(bulkCollectionRef, where("status", "==", status));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching bulk requests by status:', error);
        throw error;
    }
};

export const fetchBulkRequestsByDateRange = async (startDate, endDate) => {
    try {
        const snapshot = await getDocs(bulkCollectionRef);
        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(request => {
                const requestDate = new Date(request.preferredDate);
                return requestDate >= new Date(startDate) && requestDate <= new Date(endDate);
            });
    } catch (error) {
        console.error('Error fetching bulk requests by date range:', error);
        throw error;
    }
}; 