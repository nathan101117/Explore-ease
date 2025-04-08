// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaYoBfhIyogpzuIANQD-v7K9vPQw7aEFY",
  authDomain: "explore-ease-c258e.firebaseapp.com",
  projectId: "explore-ease-c258e",
  storageBucket: "explore-ease-c258e.appspot.com",
  messagingSenderId: "451990376581",
  appId: "1:451990376581:web:ed6a9a15e0e3e8768f19ec",
  measurementId: "G-4HH6Z6YVEC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export the necessary components
export { app, db, analytics };
