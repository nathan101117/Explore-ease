import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';
import '../styles/LandingPage.css';
import Chatbot from './chatbot';  // Import the Chatbot component

const LandingPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [isChatbotVisible, setChatbotVisible] = useState(false);  // State to manage visibility of chatbot
  const chatButtonRef = useRef(null);  // Reference for the chat button

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'destinations'));
        const destinationsArray = [];
        querySnapshot.forEach((doc) => {
          destinationsArray.push({ id: doc.id, ...doc.data() });
        });
        setDestinations(destinationsArray);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  // Toggle visibility of the chatbot
  const toggleChatbot = () => {
    setChatbotVisible(!isChatbotVisible);
  };

  // Close chatbot modal
  const closeChatbot = () => {
    setChatbotVisible(false);
  };

  return (
    <div className="landing-container">
      <div className="landing-content" style={{ textAlign: 'center' }}>
        <h1>Welcome to ExploreEase!</h1>
        <p>Your journey to planning the perfect trip starts here.</p>
      </div>

      <section className="popular-destinations">
        <h2>Popular Destinations</h2>
        <div className="destination-list">
          {destinations.length > 0 ? (
            destinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <h3>{destination.Name}</h3>
                <p>{destination.Description}</p>
                <img src={destination.ImageUrl} alt={destination.Name} />
                <Link to={`/destinationDetails/${destination.id}`}>Learn More</Link>
              </div>
            ))
          ) : (
            <p>No popular destinations found.</p>
          )}
        </div>
      </section>

      {/* Chatbot Button */}
      <div
        className="chat-icon"
        onClick={toggleChatbot}
        ref={chatButtonRef}  // Attach the ref here
      >
        💬
      </div>

      {/* Chatbot Modal */}
      {isChatbotVisible && (
        <div className="chatbot-modal" style={{ top: chatButtonRef.current?.getBoundingClientRect().top }}>
          <div className="chatbot-content">
            <button className="close-chatbot" onClick={closeChatbot}>
              X
            </button>
            <Chatbot />
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>Contact Us: info@exploreease.com</p>
          <p>Follow Us: Facebook | Twitter | Instagram</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
