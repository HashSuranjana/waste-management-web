import {db} from '../config/firebase-config.js';
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc} from 'firebase/firestore';

const collectionRef = collection(db, "collections");

export const addSchedule = async (data) => {
    const docRef = await addDoc(collectionRef, data);
    return { id: docRef.id, ...data };
};

export const fetchSchedules = async () => {
    const snapshot = await getDocs(collectionRef);

    return await Promise.all(
        snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let vehicleNumber = null;

            if (data.assignedVehicle) {
                try {
                    const vehicleSnap = await getDoc(data.assignedVehicle);
                    if (vehicleSnap.exists()) {
                        vehicleNumber = vehicleSnap.data().vehicleNumber;
                    }
                } catch (error) {
                    console.error('Error fetching vehicle data:', error);
                }
            }

            return {
                id: doc.id,
                ...data,
                vehicleNumber,
            };
        })
    );
};


export const updateSchedule = async (id, updatedData) => {
    const docRef = doc(db, "collections", id);
    await updateDoc(docRef, updatedData);
};

export const deleteSchedule = async (id) => {
    const docRef = doc(db, "collections", id);
    await deleteDoc(docRef);
};
