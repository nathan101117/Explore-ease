import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Correct Navbar import
import '../styles/TripPlanningPage.css'; // Import relevant CSS for styling
import { db } from './firebase'; // Ensure db is correctly set up in your Firebase config file
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import authService from './authService'; // Import the entire default export

const currentUser = authService.getCurrentUser(); // Access the function from the default export

const TripPlanningPage = ({ addTripToDashboard }) => {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [tripFrom, setTripFrom] = useState('');
  const [tripTo, setTripTo] = useState('');
  const [activities, setActivities] = useState({
    sightseeing: false,
    outdoors: false,
    adventure: false,
    relaxation: false,
  });
  const [numPeople, setNumPeople] = useState(1);
  const [accommodation, setAccommodation] = useState('Hotel'); // Default selection for accommodation
  const [accommodationCost, setAccommodationCost] = useState('');
  const [transport, setTransport] = useState('Car'); // Default selection for transport
  const [transportCost, setTransportCost] = useState('');
  const [food, setFood] = useState('');
  const [other, setOther] = useState('');
  const [totalBudget, setTotalBudget] = useState(0);
  const [currency, setCurrency] = useState('USD');
  const [specificRecommendations, setSpecificRecommendations] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState(0);
  const [convertedTotalBudget, setConvertedTotalBudget] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const exchangeRateUSDToKES = 150;
  const exchangeRateKESToUSD = 1 / exchangeRateUSDToKES;

  const handleActivityChange = (e) => {
    const { name, checked } = e.target;
    setActivities((prevActivities) => ({
      ...prevActivities,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const allocatedTotal =
      parseFloat(activities.sightseeing ? 50 : 0) +
      parseFloat(activities.outdoors ? 30 : 0) +
      parseFloat(activities.adventure ? 70 : 0) +
      parseFloat(activities.relaxation ? 20 : 0) +
      parseFloat(accommodationCost || 0) +
      parseFloat(transportCost || 0) +
      parseFloat(food || 0) +
      parseFloat(other || 0);

    setAllocatedBudget(allocatedTotal);
    setTotalBudget(allocatedTotal);
    setConvertedTotalBudget(allocatedTotal);
  }, [activities, accommodationCost, transportCost, food, other]);

  const handleCurrencyConversion = () => {
    if (currency === 'USD') {
      const convertedAmount = totalBudget * exchangeRateUSDToKES;
      setConvertedTotalBudget(convertedAmount);
      setCurrency('KES');
    } else {
      const convertedAmount = totalBudget * exchangeRateKESToUSD;
      setConvertedTotalBudget(convertedAmount);
      setCurrency('USD');
    }
  };

  const validateDates = () => {
    if (new Date(tripFrom) >= new Date(tripTo)) {
      alert('Start date must be before end date!');
      return false;
    }
    return true;
  };

  const validateFields = () => {
    if (!tripName || !destination || !tripFrom || !tripTo) {
      alert('Please fill out all required fields!');
      return false;
    }
    if (totalBudget <= 0) {
      alert('Total budget should be greater than zero!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates() || !validateFields()) return;

    const currentUser = authService.getCurrentUser();

    if (!currentUser) {
      alert('Please log in first to submit a trip!');
      return;
    }

    const tripData = {
      tripName,
      destination,
      tripFrom,
      tripTo,
      numPeople,
      currency,
      activities,
      accommodation,
      accommodationCost,
      transport,
      transportCost,
      food,
      other,
      specificRecommendations,
      totalBudget,
      bookedBy: currentUser.uid || currentUser.username,
    };

    try {
      // Use the correct Firestore function
      const docRef = await addDoc(collection(db, 'trips'), tripData);
      console.log('Document written with ID: ', docRef.id);
      alert('Trip successfully saved!');
      addTripToDashboard(tripData);
      setShowSummary(true); // Show the trip summary after saving
    } catch (error) {
      console.error('Error saving trip data: ', error);
      alert('Error saving trip. Please try again.');
    }
  };

  const incrementGuests = () => setNumPeople(numPeople + 1);
  const decrementGuests = () => setNumPeople(numPeople > 1 ? numPeople - 1 : 1);

  return (
    <div className="trip-planning-container">
      <h2>Plan Your Trip</h2>
      <form onSubmit={handleSubmit}>
        {/* Trip Name */}
        <div>
          <label>Trip Name:</label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            required
          />
        </div>

        {/* Destination */}
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        {/* Dates */}
        <div className="trip-dates">
          <div>
            <label>From:</label>
            <input
              type="date"
              value={tripFrom}
              onChange={(e) => setTripFrom(e.target.value)}
              required
            />
          </div>
          <div>
            <label>To:</label>
            <input
              type="date"
              value={tripTo}
              onChange={(e) => setTripTo(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Choose Activities */}
        <div>
          <h3>Choose Activities</h3>
          {Object.keys(activities).map((activity) => (
            <label key={activity}>
              <input
                type="checkbox"
                name={activity}
                checked={activities[activity]}
                onChange={handleActivityChange}
              />
              {activity.charAt(0).toUpperCase() + activity.slice(1)}
            </label>
          ))}
        </div>
                {/* Number of People (dynamically displayed) */}
        <div>
          <h3>Number of People: {numPeople}</h3>
          <button type="button" onClick={decrementGuests}>-</button>
          <button type="button" onClick={incrementGuests}>+</button>
        </div>

        {/* Budget Allocation (after activities) */}
        <div>
          <h3>Budget Allocation</h3>
        </div>

        {/* Currency Dropdown */}
         <div>
          <label>Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">USD</option>
            <option value="KES">KES</option>
          </select>
        </div>

        {/* Accommodation Dropdown */}
        <div>
          <label>Accommodation:</label>
          <select
            value={accommodation}
            onChange={(e) => setAccommodation(e.target.value)}
          >
            <option value="Hotel">Hotel</option>
            <option value="Hostel">Hostel</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Guesthouse">Guesthouse</option>
            <option value="Camping">Camping</option>
          </select>
        </div>

        {/* Accommodation Cost */}
        <div>
          <label>Accommodation Cost:</label>
          <input
            type="number"
            value={accommodationCost}
            onChange={(e) => setAccommodationCost(e.target.value)}
            required
          />
        </div>

        {/* Transport Dropdown */}
        <div>
          <label>Transport:</label>
          <select
            value={transport}
            onChange={(e) => setTransport(e.target.value)}
          >
            <option value="Car">Car</option>
            <option value="Bus">Bus</option>
            <option value="Train">Train</option>
            <option value="Flight">Flight</option>
          </select>
        </div>

        {/* Transport Cost */}
        <div>
          <label>Transport Cost:</label>
          <input
            type="number"
            value={transportCost}
            onChange={(e) => setTransportCost(e.target.value)}
            required
          />
        </div>

        {/* Food */}
        <div>
          <label>Food Budget:</label>
          <input
            type="number"
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />
        </div>

        {/* Other Expenses */}
        <div>
          <label>Other Expenses:</label>
          <input
            type="number"
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        </div>

        {/* Total Cost and Convert Currency */}
        <div>
          <h4>Total Cost: {currency === 'USD' ? totalBudget : convertedTotalBudget} {currency}</h4>
          <button type="button" onClick={handleCurrencyConversion}>Convert Currency</button>
        </div>

        {/* Specific Recommendations */}
        <div>
          <label>Specific Recommendations:</label>
          <textarea
            value={specificRecommendations}
            onChange={(e) => setSpecificRecommendations(e.target.value)}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>

      {/* Show Trip Summary */}
      {showSummary && (
        <div className="trip-summary">
          <h3>Trip Summary</h3>
          <p>Trip Name: {tripName}</p>
          <p>Destination: {destination}</p>
          <p>From: {tripFrom}</p>
          <p>To: {tripTo}</p>
          <p>Accommodation: {accommodation}</p>
          <p>Transport: {transport}</p>
          <p>Total Budget: {totalBudget}</p>
        </div>
      )}
    </div>
  );
};

export default TripPlanningPage;
