import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD9CApePbzdHg6jFqMaKBOCVB7C7G8efgE",
    authDomain: "wastemanagement-60c33.firebaseapp.com",
    databaseURL: "https://wastemanagement-60c33-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wastemanagement-60c33",
    storageBucket: "wastemanagement-60c33.firebasestorage.app",
    messagingSenderId: "455331973314",
    appId: "1:455331973314:web:35c632c0e76475a262535b"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);