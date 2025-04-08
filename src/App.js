import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';  // Import useNavigate
import './styles/HomePage.css';  // Link to the CSS file for HomePage styling

// Importing components
import Navbar from './components/Navbar';  // Import Navbar
import HomePage from './components/HomePage';  
import AboutPage from './components/AboutPage';  
import LoginPage from './components/LoginPage';  
import SignupPage from './components/SignUpPage';  
import DashboardPage from './components/DashboardPage';  
import ContactPage from './components/ContactPage';  
import TripPlanningPage from './components/TripPlanningPage';  
import ProfilePage from './components/ProfilePage';  
import LandingPage from './components/Landing';  
import DestinationDetails from './components/DestinationDetails';  
import AdminDashboard from './components/AdminDashboard';  // Import AdminDashboard

function App() {
  const [user, setUser] = useState(null); // Add user state here

  // Check for user session in localStorage or other persistent storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Restore user session from localStorage
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');  // Remove user data from localStorage on logout
    setUser(null); // Clear user state on logout
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser); // Set user on login
    localStorage.setItem('user', JSON.stringify(loggedInUser));  // Store user in localStorage
  };

  return (
    <Router> {/* Make sure everything is inside the Router */}
      <div className="App">
        <Navbar user={user} setUser={setUser} onLogout={handleLogout} />  {/* Pass user and setUser */}

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<HomePage />} />  {/* Render HomePage at root */}
          <Route path="/about" element={<AboutPage />} />  {/* Render AboutPage */}
          <Route path="/login" element={<LoginPage setUser={setUser} handleLogin={handleLogin} />} />  {/* Pass handleLogin to LoginPage */}
          <Route path="/signup" element={<SignupPage />} />  {/* Render SignupPage */}
          <Route path="/dashboard" element={<DashboardPage />} />  {/* Render DashboardPage */}
          <Route path="/contact" element={<ContactPage />} />  {/* Render ContactPage */}
          <Route path="/trip-planning" element={<TripPlanningPage />} />  {/* Render TripPlanningPage */}
          <Route path="/profile" element={<ProfilePage />} />  {/* Render ProfilePage */}
          <Route path="/landing" element={<LandingPage />} />  {/* Render LandingPage */}
          
          {/* Route for individual destination details */}
          <Route path="/destinationDetails/:destinationId" element={<DestinationDetails />} />  

          {/* Admin Dashboard Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />  {/* Admin Dashboard */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
