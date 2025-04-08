import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './authService';  // Import authService with the correct method
import '../styles/LoginPage.css'; 

function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Use navigate for redirect after login

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Use the loginUser method from authService
      const user = await authService.loginUser(email, password);

      // Set user data (you can also store additional user data here)
      setUser({
        uid: user.uid,
        email: user.email,
        role: user.role,
        username: user.username,
      });

      // Optionally, store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        role: user.role,
        username: user.username,
      }));

      // Check if the user is an admin
      if (user.role === 'admin') {
        // Redirect to AdminLoginPage if the user is an admin
        navigate('/Admin-Dashboard');
      } else {
        // Redirect to a regular user dashboard or home page
        navigate('/dashboard');
      }

    } catch (error) {
      setError(error.message);  // Display error message if login fails
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <br />
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}  {/* Display error message if login fails */}
    </div>
  );
}

export default LoginPage;
