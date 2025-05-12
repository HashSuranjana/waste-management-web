import {addDoc, collection, getDocs} from "firebase/firestore";
import {db} from "../config/firebase-config.js";

const bulkCollectionRef = collection(db, "bulkMaterials");

export const addBulkMaterial = async (newBulkData) => {
    return await addDoc(bulkCollectionRef, newBulkData);

};

export const fetchBulkMaterials = async () => {
    const snapshot = await getDocs(bulkCollectionRef);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}