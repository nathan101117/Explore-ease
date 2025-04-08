import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";  // Import Firestore configuration
import "../styles/admin-dashboard.css";  // Importing the CSS file for Admin Dashboard

function AdminDashboard() {
  const [users, setUsers] = useState([]);  // State to store users
  const [trips, setTrips] = useState([]);  // State to store trips
  const [error, setError] = useState('');  // For error handling
  const navigate = useNavigate();  // For navigation

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users from Firestore
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        
        const usersData = [];
        // Loop through Firestore documents to get user data
        for (const userDoc of usersSnapshot.docs) {
          const user = userDoc.data();
          const userId = userDoc.id; // Firestore document ID (this is the UID)

          // Log the user data to check the structure
          console.log("Fetched User Data:", user);

          // Push user data into usersData with their UID as the Firestore document ID
          usersData.push({
            id: userId, // This is the UID for each user
            ...user,
          });
        }

        // Set fetched data to state
        setUsers(usersData);

        // Fetch trips from Firestore
        const tripsCollection = collection(db, "trips");
        const tripsSnapshot = await getDocs(tripsCollection);

        const tripsData = [];
        for (const tripDoc of tripsSnapshot.docs) {
          const trip = tripDoc.data();
          const tripId = tripDoc.id;

          tripsData.push({
            id: tripId,
            ...trip,
          });
        }
        setTrips(tripsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);  // Empty dependency array means this effect runs once on component mount

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, "users", userId));  // Deletes from Firestore
      setUsers(users.filter((user) => user.id !== userId));  // Remove from local state
      console.log("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  // Handle trip cancellation
  const handleCancelTrip = async (tripId) => {
    try {
      await deleteDoc(doc(db, "trips", tripId));  // Deletes from Firestore
      setTrips(trips.filter((trip) => trip.id !== tripId));  // Remove from local state
      console.log("Trip cancelled successfully");
    } catch (err) {
      console.error("Error cancelling trip:", err);
      setError("Failed to cancel trip.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");  // Redirect to login page after logout
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="user-management">
        <h2>User Management</h2>
        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>UID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td> {/* Display Firestore-generated UID */}
                  <td>{user.username || "N/A"}</td> {/* Display user username */}
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>

      <div className="trip-management">
        <h2>Trip Management</h2>
        {trips.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Trip Name</th>
                <th>Trip ID</th>
                <th>Destination</th>
                <th>Booked By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.tripName || "Unknown Trip"}</td> {/* Display trip name */}
                  <td>{trip.id || "Unknown Trip"}</td> {/* Display trip ID */}
                  <td>{trip.destination || "Unknown Destination"}</td> {/* Display trip destination */}
                  <td>{trip.bookedBy || "Unknown"}</td> {/* Display who booked the trip */}
                  <td>
                    <button onClick={() => handleCancelTrip(trip.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No trips found.</p>
        )}
      </div>

      <div className="admin-actions">
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default AdminDashboard;
