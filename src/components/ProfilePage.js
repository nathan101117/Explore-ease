import React, { useState, useEffect } from 'react';
import authService from './authService';  // Import the default export from authService
import '../styles/ProfilePage.css';  

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = authService.getCurrentUser();  // Get the current authenticated user

        if (currentUser) {
          // Fetch user profile data from Firestore
          const userProfile = await authService.getUserProfile(currentUser.uid);
          setProfile({
            name: userProfile.username,  // Assuming 'username' is stored in Firestore
            email: currentUser.email,
            profilePicture: userProfile.profilePicture || ''  // Handle missing profile picture
          });
        } else {
          setError('No user is currently logged in.');
        }
      } catch (err) {
        setError(`Failed to fetch profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);  // Empty dependency array to run once when the component mounts

  const handleLogout = async () => {
    try {
      await authService.logoutUser();  // Log out the user using authService
      // Redirect or show success message after logout
      window.location.href = '/login';  // Example: redirect to login page
    } catch (err) {
      setError(`Logout failed: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-info">
        <img
          src={profile.profilePicture || '/default-profile-picture.jpg'}  // Fallback to default image if no picture
          alt="Profile"
          className="profile-picture"
        />
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
