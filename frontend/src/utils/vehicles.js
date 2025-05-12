// services/vehicleService.ts
import {db} from "../config/firebase-config";
import {addDoc, collection, deleteDoc, doc, getDocs, updateDoc} from "firebase/firestore";

const vehiclesRef = collection(db, "vehicles");

export const getVehicles = async () => {
    const snapshot = await getDocs(vehiclesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addVehicle = async (vehicleData) => {
    const docRef = await addDoc(vehiclesRef, vehicleData);
    return { id: docRef.id, ...vehicleData };
};

export const updateVehicle = async (id, updatedData) => {
    const docRef = doc(db, "vehicles", id);
    await updateDoc(docRef, updatedData);
};

export const deleteVehicle = async (id) => {
    const docRef = doc(db, "vehicles", id);
    await deleteDoc(docRef);
};