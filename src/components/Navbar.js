import React, { useState } from 'react';  
import { Link } from 'react-router-dom';  
import { authService } from '../components/authService.js';  
import '../styles/Navbar.css';  

const Navbar = ({ user, setUser, onLogout }) => {  
  const [showDropdown, setShowDropdown] = useState(false);  
  const [showLoginForm, setShowLoginForm] = useState(false);  
  const [showSignupForm, setShowSignupForm] = useState(false);  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const [username, setUsername] = useState('');  
  const [error, setError] = useState('');  
  const [success, setSuccess] = useState('');  

  const handleLoginClick = () => {  
    setShowLoginForm(true);  
    setShowSignupForm(false);  
  };

  const handleSignupClick = () => {  
    setShowSignupForm(true);  
    setShowLoginForm(false);  
  };

  const handleSignUpSubmit = async (e) => {  
    e.preventDefault();  
    try {
      const registeredUser = await authService.registerUser(email, password, username);  
      setSuccess(`User registered successfully! Welcome, ${registeredUser.username}!`);  
      setError('');  
      setShowSignupForm(false);  
      setUser(registeredUser);  // Set user after successful registration
    } catch (err) {
      setError(`Failed to register: ${err.message}`);  
      setSuccess('');  
    }
  };

  const handleLoginSubmit = async (e) => {  
    e.preventDefault();  
    console.log("Login attempt with:", { email, password });  
    try {
      const loggedInUser = await authService.loginUser(email, password);  
      console.log("Logged in user:", loggedInUser);  
      setSuccess(`Welcome back, ${loggedInUser.username}!`);  
      setError('');  
      setShowLoginForm(false);  
      setUser(loggedInUser);  // Set user after successful login
      setEmail('');  
      setPassword('');  
    } catch (err) {
      console.error("Login error:", err);  
      setError(`Failed to login: ${err.message}`);  
      setSuccess('');  
    }
  };

  const toggleDropdown = () => {  
    setShowDropdown((prev) => !prev);  
  };

  return (  
    <>  
      <nav className="navbar">  
        <Link to="/landing" className="brand">ExploreEase</Link>  
        <ul className="nav-links">  
          <li><Link to="/dashboard">Dashboard</Link></li>  
          <li><Link to="/about">About</Link></li>  
          <li><Link to="/trip-planning">Trip Planning</Link></li>  
          <li><Link to="/contact">Contact</Link></li>  
        </ul>
        {user ? (  
          <div className="user-greeting">  
            <span onClick={toggleDropdown}>Hello, {user.username || 'Guest'}!</span>  
            {showDropdown && (  
              <div className="dropdown-menu">  
                <Link to="/profile">My Profile</Link>  
                <Link to="#" onClick={onLogout}>Logout</Link>  
              </div>
            )}
          </div>
        ) : (  
          <div className="auth-links">
            <button className="login-button" onClick={handleLoginClick}>Login</button>
            <Link to="/login" className="admin-login">Admin Login</Link> {/* Admin Login Link */}
          </div>
        )}
      </nav>

      {showLoginForm && (  
        <div className="login-form-overlay">  
          <div className="login-form">  
            <button className="close-button" onClick={() => setShowLoginForm(false)}>X</button>  
            <h2>Login</h2>  
            <form onSubmit={handleLoginSubmit}>  
              <input  
                type="email"  
                placeholder="Email"  
                value={email}  
                onChange={(e) => setEmail(e.target.value)}  
                required  
              />
              <input  
                type="password"  
                placeholder="Password"  
                value={password}  
                onChange={(e) => setPassword(e.target.value)}  
                required  
              />
              <button type="submit">Login</button>  
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}  
            {success && <p style={{ color: 'green' }}>{success}</p>}  
            <p>If not registered, <button onClick={handleSignupClick}>Sign up</button></p>  
          </div>
        </div>
      )}

      {showSignupForm && (  
        <div className="login-form-overlay">  
          <div className="login-form">  
            <button className="close-button" onClick={() => setShowSignupForm(false)}>X</button>  
            <h2>Sign Up</h2>  
            <form onSubmit={handleSignUpSubmit}>  
              <input  
                type="text"  
                placeholder="Username"  
                value={username}  
                onChange={(e) => setUsername(e.target.value)}  
                required  
              />
              <input  
                type="email"  
                placeholder="Email"  
                value={email}  
                onChange={(e) => setEmail(e.target.value)}  
                required  
              />
              <input  
                type="password"  
                placeholder="Password"  
                value={password}  
                onChange={(e) => setPassword(e.target.value)}  
                required  
              />
              <button type="submit">Sign Up</button>  
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}  
            {success && <p style={{ color: 'green' }}>{success}</p>}  
            <p>Already registered? <button onClick={handleLoginClick}>Login</button></p>  
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
