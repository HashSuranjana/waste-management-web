import { db } from '../config/firebase-config.js';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';

const collectionRef = collection(db, "collections");

export const addSchedule = async (data) => {
    const docRef = await addDoc(collectionRef, data);
    return { id: docRef.id, ...data };
};

export const fetchSchedules = async () => {
    const snapshot = await getDocs(collectionRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateSchedule = async (id, updatedData) => {
    const docRef = doc(db, "collections", id);
    await updateDoc(docRef, updatedData);
};

export const deleteSchedule = async (id) => {
    const docRef = doc(db, "collections", id);
    await deleteDoc(docRef);
};
