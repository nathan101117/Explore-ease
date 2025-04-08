import React from 'react';
import '../styles/AboutPage.css'; // Adjust the import path as per your file structure

const AboutPage = () => {
  return (
    <div className="aboutpage-container">
      <header className="aboutpage-header">
        <h1>About Us</h1>
        <p>
          At <strong>ExploreEase</strong>, we specialize in providing personalized travel planning services that ensure you have seamless and memorable journeys. Whether you're traveling for business or leisure, we are dedicated to simplifying your travel experience by organizing all the details with precision and care.
        </p>
        <a href="/services" className="aboutpage-button">Explore Our Services</a>
      </header>

      <section className="aboutpage-content">
        <h2>Our Mission</h2>
        <p>
          To empower travelers by offering tailored travel solutions, fostering trust, and delivering excellence in every journey. We aim to remove the stress of planning, so you can focus on enjoying your trip to the fullest.
        </p>

        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Personalized Itineraries:</strong> Crafted to match your preferences and needs.</li>
          <li><strong>Seamless Booking:</strong> From accommodations to transport, we handle everything.</li>
          <li><strong>24/7 Support:</strong> Our team is available around the clock for any assistance.</li>
          <li><strong>Affordable Solutions:</strong> Transparent pricing with no hidden costs.</li>
        </ul>

        <h2>Our Values</h2>
        <p>
          At the heart of our service lies a commitment to innovation, customer satisfaction, and sustainability. We aim to minimize the environmental impact of travel while maximizing the joy it brings.
        </p>
      </section>

      <footer className="aboutpage-footer">
        <p>Ready to plan your next adventure? <a href="/contact">Get in touch with us today!</a></p>
      </footer>
    </div>
  );
};

export default AboutPage;
