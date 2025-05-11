import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBcaKr5AMbdU-CsqdMR_8Ph17OpC7cbILY",
    authDomain: "waste-management-web-app.firebaseapp.com",
    projectId: "waste-management-web-app",
    storageBucket: "waste-management-web-app.firebasestorage.app",
    messagingSenderId: "733550957011",
    appId: "1:733550957011:web:61189037a38630e7099f26",
    measurementId: "G-6R9T1FM0GW"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);