import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";  // Modular imports

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);  // Initialize Firestore

// Register a new user with email, password, and username.
const registerUser = async (email, password, username) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userDocRef = doc(collection(db, "users"), userCredential.user.uid);  // Use modular method for Firestore
        await setDoc(userDocRef, { 
            email, 
            username, 
            role: "user" 
        });
        return userCredential.user;
    } catch (error) {
        throw new Error(`Registration failed: ${error.message}`);
    }
};

// Log in a user with email and password.
const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userProfile = await getUserProfile(user.uid); // Fetch user's profile from Firestore
      // Return the user with role (and other details as needed)
      return { ...user, role: userProfile.role, username: userProfile.username };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  };
  

// Get user profile data from Firestore.
const getUserProfile = async (uid) => {
    try {
        const userDocRef = doc(db, "users", uid);  // Use modular method for Firestore
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data(); // Returns the user data as an object
        } else {
            throw new Error("No such document!");
        }
    } catch (error) {
        throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
};

// Get all user profiles from Firestore.
const getAllUserProfiles = async () => {
    try {
        const userCollectionRef = collection(db, "users");  // Use modular method for Firestore
        const snapshot = await getDocs(userCollectionRef);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        throw new Error(`Failed to fetch user profiles: ${error.message}`);
    }
};

// Log out the current user.
const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(`Logout failed: ${error.message}`);
    }
};

// Get the current authenticated user.
const getCurrentUser = () => {
    return auth.currentUser;  // This returns the current user if authenticated, or null if not
};

// Create an authService object containing all functions to be used
const authService = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllUserProfiles,
    logoutUser,
    getCurrentUser,
    auth,
};

export { authService };
export default authService;
