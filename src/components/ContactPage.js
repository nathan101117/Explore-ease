import React from 'react';
import '../styles/ContactPage.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <form>
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;
