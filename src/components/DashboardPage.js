import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Ensure db is correctly set up
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import authService from './authService'; // Import authService for accessing the current user
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [tripDetails, setTripDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null); // Track selected trip for showing details

  useEffect(() => {
    const currentUser = authService.getCurrentUser(); // Get the current logged-in user

    if (currentUser) {
      const fetchTrips = async () => {
        try {
          const tripsCollection = collection(db, 'trips');
          const q = query(tripsCollection, where('bookedBy', '==', currentUser.uid || currentUser.username));
          const querySnapshot = await getDocs(q);

          const trips = querySnapshot.docs.map(doc => doc.data());

          // Sort trips by date (upcoming first)
          const sortedTrips = trips.sort((a, b) => new Date(a.tripFrom) - new Date(b.tripFrom));

          setTripDetails(sortedTrips);
        } catch (error) {
          console.error('Error fetching trips:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchTrips();
    } else {
      setLoading(false); // Stop loading if no user is logged in
    }
  }, []);

  // Function to categorize trips as upcoming or past
  const categorizeTrips = (trip) => {
    const today = new Date();
    const tripDate = new Date(trip.tripFrom);
    return tripDate >= today ? 'upcoming' : 'past';
  };

  // Function to handle click on a trip tile to show details
  const handleTripClick = (trip) => {
    if (selectedTrip === trip) {
      setSelectedTrip(null); // Deselect trip if it's already selected
    } else {
      setSelectedTrip(trip); // Select the clicked trip
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Your Dashboard</h2>
      <p>Welcome to your personalized travel dashboard!</p>

      {loading ? (
        <p>Loading trips...</p>
      ) : (
        <>
          {tripDetails.length === 0 ? (
            <p>No trips found.</p>
          ) : (
            <div className="trip-list">
              <div className="trip-category">
                <h3>Upcoming Trips</h3>
                {tripDetails
                  .filter((trip) => categorizeTrips(trip) === 'upcoming')
                  .map((trip, index) => (
                    <div key={index} className="trip-tile" onClick={() => handleTripClick(trip)}>
                      <h4>{trip.tripName}</h4>
                      <p>Destination: {trip.destination}</p>
                      <p>From: {trip.tripFrom}</p>
                      <p>To: {trip.tripTo}</p>

                      {/* Show details only for selected trip */}
                      {selectedTrip === trip && (
                        <div className="trip-details">
                          <p><strong>Trip Name:</strong> {trip.tripName}</p>
                          <p><strong>Destination:</strong> {trip.destination}</p>
                          <p><strong>From:</strong> {trip.tripFrom}</p>
                          <p><strong>To:</strong> {trip.tripTo}</p>
                          <p><strong>Accommodation:</strong> {trip.accommodation || 'Not available'}</p>
                          <p><strong>Transport:</strong> {trip.transport || 'Not available'}</p>
                          <p><strong>Recommendations:</strong> {trip.specificRecommendations || 'No description available'}</p>
                          <p><strong>Guest count:</strong> {trip.numPeople || 'Not specified'}</p>
                          <p><strong> Total Cost (USD):</strong> {trip.totalBudget  || 'Not available'}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>

              <div className="trip-category">
                <h3>Past Trips</h3>
                {tripDetails
                  .filter((trip) => categorizeTrips(trip) === 'past')
                  .map((trip, index) => (
                    <div key={index} className="trip-tile" onClick={() => handleTripClick(trip)}>
                      <h4>{trip.tripName}</h4>
                      <p>Destination: {trip.destination}</p>
                      <p>From: {trip.tripFrom}</p>
                      <p>To: {trip.tripTo}</p>

                      {/* Show details only for selected trip */}
                      {selectedTrip === trip && (
                        <div className="trip-details">
                          <p><strong>Trip Name:</strong> {trip.tripName}</p>
                          <p><strong>Destination:</strong> {trip.destination}</p>
                          <p><strong>From:</strong> {trip.tripFrom}</p>
                          <p><strong>To:</strong> {trip.tripTo}</p>
                          <p><strong>Accommodation:</strong> {trip.accommodation || 'Not available'}</p>
                          <p><strong>Departure Time:</strong> {trip.departureTime || 'Not available'}</p>
                          <p><strong>Arrival Time:</strong> {trip.arrivalTime || 'Not available'}</p>
                          <p><strong>Contact Person:</strong> {trip.contactPerson || 'Not available'}</p>
                          <p><strong>Trip Type:</strong> {trip.tripType || 'Not specified'}</p>
                          <p><strong>Description:</strong> {trip.description || 'No description available'}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
