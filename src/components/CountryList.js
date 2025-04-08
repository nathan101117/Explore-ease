import React, { useState, useEffect } from 'react';

const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all'); 
        const data = await response.json();
        console.log(data); // Log the fetched data for debugging
        setCountries(data); // Set the fetched countries data to state
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoading(false); // Stop loading after data is fetched
      }
    };

    fetchCountries();
  }, []);

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="country-list">
      <h3>Select a Country</h3>
      <input
        type="text"
        placeholder="Search for a country..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      {loading ? (
        <p>Loading countries...</p> // Show loading message while fetching
      ) : (
        <ul>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <li key={country.cca3}>{country.name.common}</li>
            ))
          ) : (
            <p>No countries found.</p> // Show message if no countries match search
          )}
        </ul>
      )}
    </div>
  );
};

export default CountryList;
