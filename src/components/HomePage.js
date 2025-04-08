import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import '../styles/HomePage.css';  // Update the import path

const HomePage = () => {
  const navigate = useNavigate();  // Initialize useNavigate hook

  // Function to handle "Get Started" button click
  const handleGetStartedClick = () => {
    navigate('/landing');  // Redirect to the landing page
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to ExploreEase</h1>
        <p>Your all-in-one platform for planning your dream trip.</p>
        <button className="homepage-button" onClick={handleGetStartedClick}>
          Get Started
        </button>
      </header>
    </div>
  );
};

export default HomePage;
