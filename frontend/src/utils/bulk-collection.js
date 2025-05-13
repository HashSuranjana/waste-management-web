import {addDoc, collection, doc, getDocs, updateDoc} from "firebase/firestore";
import {db} from "../config/firebase-config.js";

const bulkCollectionRef = collection(db, "recycle");

export const addBulkMaterial = async (newBulkData) => {
    return await addDoc(bulkCollectionRef, newBulkData);

};

export const fetchBulkMaterials = async () => {
    const snapshot = await getDocs(bulkCollectionRef);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export const updateStepStatus = async (bulkId, stepName, status) => {
    const bulkRef = doc(db, "recycle", bulkId);
    await updateDoc(bulkRef, {
        [`stepsCompletionStatus.${stepName}`]: status
    });
};

export const updateBulkStatus = async (bulkId, newStatus) => {
    const bulkRef = doc(db, "recycle", bulkId);
    await updateDoc(bulkRef, { status: newStatus });
};