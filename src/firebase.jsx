// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-mHdar0bT2opSCbZNYaWeZqfpjGMT18Q",
  authDomain: "comprl.firebaseapp.com",
  projectId: "comprl",
  storageBucket: "comprl.firebasestorage.app",
  messagingSenderId: "641618420607",
  appId: "1:641618420607:web:2d630e56b40f1bf542f04a",
  measurementId: "G-FLFZMVG083"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);