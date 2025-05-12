// src/utils/resident.js
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import { db } from '../config/firebase-config.js';

const residentsCollectionRef = collection(db, 'residents');

export const fetchResidents = async () => {
    const snapshot = await getDocs(residentsCollectionRef);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

export const addResident = async (residentData) => {
    return await addDoc(residentsCollectionRef, residentData);
};

export const updateResident = async (id, updatedData) => {
    const residentDoc = doc(db, 'residents', id);
    return await updateDoc(residentDoc, updatedData);
};

export const deleteResident = async (id) => {
    const residentDoc = doc(db, 'residents', id);
    return await deleteDoc(residentDoc);
};
