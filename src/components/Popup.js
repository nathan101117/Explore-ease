// Popup.js
import React from 'react';
import '../styles/Popup.css';

const Popup = ({ content, onClose }) => {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>Close</button>
        {Array.isArray(content) ? (
          <ul>
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div>{content}</div> // Render as plain text if not an array
        )}
      </div>
    </div>
  );
};

export default Popup;
