import React from 'react';
import '../styles/SignupPage.css';

const SignupPage = () => {
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <input type="text" placeholder="Full Name" required />
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
