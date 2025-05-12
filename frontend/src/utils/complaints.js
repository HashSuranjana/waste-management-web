import {collection, doc, getDoc, getDocs, updateDoc,} from 'firebase/firestore';
import {db} from '../config/firebase-config.js';

const complaintsCollectionRef = collection(db, 'complaints');

export const fetchComplaints = async () => {
    const snapshot = await getDocs(complaintsCollectionRef);

    return await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const complaintData = docSnap.data();
            const complaintId = docSnap.id;

            let residentName = 'Unknown';
            let postal_code = '';

            if (complaintData.residentId) {
                try {
                    const residentDoc = await getDoc(doc(db, 'residents', complaintData.residentId.id));
                    if (residentDoc.exists()) {
                        const residentData = residentDoc.data();
                        residentName = residentData.name;
                        postal_code = residentData.postalCode;
                    }
                } catch (error) {
                    console.error('Error fetching resident data:', error);
                }
            }

            return {
                ...complaintData,
                id: complaintId,
                residentName,
                postal_code,
                created_date: complaintData.created_date.toDate().toISOString().split('T')[0],
            };
        })
    );
};

export const updateComplaint = async (id, updatedData) => {
    const docRef = doc(db, "complaints", id);
    await updateDoc(docRef, updatedData);
};