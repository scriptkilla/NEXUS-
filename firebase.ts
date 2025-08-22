// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// IMPORTANT: Replace these with your actual Firebase project configuration. These are validly-formatted placeholders.
const firebaseConfig = {
  apiKey: "AIzaSyDEFGH-abcdefghijklmnopqrstuvwxyz123",
  authDomain: "nexus-platform-prod.firebaseapp.com",
  projectId: "nexus-platform-prod",
  storageBucket: "nexus-platform-prod.appspot.com",
  messagingSenderId: "112233445566",
  appId: "1:112233445566:web:a1b2c3d4e5f6a1b2c3d4e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the necessary Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;