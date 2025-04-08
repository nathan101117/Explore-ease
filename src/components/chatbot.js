import React, { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import '../styles/chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  // Utility function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Function to handle user queries
  const getBotResponse = async (userInput) => {
    const lowerCaseInput = userInput.toLowerCase();

    // Destination keywords
    const destinations = ['mombasa', 'malindi', 'nairobi', 'nakuru', 'naivasha', 'diani', 'kisumu'];
    const matchedDestination = destinations.find((destination) =>
      lowerCaseInput.includes(destination)
    );

    if (matchedDestination) {
      const destinationName = capitalizeFirstLetter(matchedDestination); // Capitalize to match database
      console.log('Matched Destination:', destinationName);

      try {
        const docRef = doc(db, 'destinationDetails', destinationName); // Match document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Document Data:', data);

          // Generate a response based on keywords in user input
          if (lowerCaseInput.includes('accommodation')) {
            return `In ${destinationName}, you can stay at: ${data.accommodation}`;
          } else if (lowerCaseInput.includes('attractions')) {
            return `Top attractions in ${destinationName} include: ${data.attractions}`;
          } else if (lowerCaseInput.includes('food')) {
            return `Popular food in ${destinationName}: ${data.food}`;
          } else if (lowerCaseInput.includes('nightlife')) {
            return `Nightlife in ${destinationName} is described as: ${data.nightlife}`;
          } else if (lowerCaseInput.includes('transportation')) {
            return `Transportation options in ${destinationName}: ${data.transportation}`;
          } else if (lowerCaseInput.includes('history')) {
            return `The history of ${destinationName}: ${data.history}`;
          } else {
            return `Here's some information about ${destinationName}: ${data.description}`;
          }
        } else {
          console.log(`No document found for: ${destinationName}`);
          return `I couldn't find detailed information about ${destinationName}.`;
        }
      } catch (error) {
        console.error('Error fetching destination details:', error);
        return `Sorry, I encountered an error while fetching information about ${destinationName}.`;
      }
    } else {
      if (lowerCaseInput === 'hi' || lowerCaseInput === 'hello') {
        return 'Hello and welcome to Explore-ease!';
      } else if (lowerCaseInput.includes('help')) {
        return 'I am here to assist! You can ask me about destinations, travel tips, or anything else.';
      } else {
        return "I'm still learning! Can you rephrase that or ask me something else?";
      }
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user message
    const newMessages = [...messages, { sender: 'user', text: input }];

    // Get bot response
    const botResponse = await getBotResponse(input);
    newMessages.push({ sender: 'bot', text: botResponse });

    setMessages(newMessages);
    setInput(''); // Clear input
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Chatbot</div>
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chatbot-message ${message.sender === 'user' ? 'user' : 'bot'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
